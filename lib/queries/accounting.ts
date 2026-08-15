import { createClient } from "@/lib/supabase/server";
import type { TransactionRow, CarBasic, SheetSummary, YearData, MonthFullData } from "@/lib/queries/accounting-shared";

export { SHEET_CONFIG, computeSummary } from "@/lib/queries/accounting-shared";
export type { SheetKey, TransactionRow, CarBasic, SheetSummary, YearData, MonthFullData } from "@/lib/queries/accounting-shared";

// Fetches the last `count` months in ONE query, grouped in JS.
// Used for the Level 1 overview to enable instant client-side month switching.
export async function getAccountingYearData(
  investorId: string,
  anchorMonthKey: string,
  count = 12
): Promise<YearData> {
  const supabase = await createClient();

  const [y, m] = anchorMonthKey.split("-").map(Number);
  const monthKeys: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(y, m - 1 - i, 1);
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const { data, error } = await supabase
    .from("financial_transactions")
    .select("sheet_type, direction, amount, month_key")
    .eq("investor_id", investorId)
    .in("month_key", monthKeys)
    .limit(60000);

  if (error) throw error;

  const result: YearData = {};
  for (const mk of monthKeys) result[mk] = {};

  for (const row of data ?? []) {
    const mk = row.month_key as string;
    if (!result[mk]) continue;
    const st = (row.sheet_type as string) ?? "other";
    if (!result[mk][st]) result[mk][st] = { total_in: 0, total_out: 0, net: 0, count: 0 };
    const s = result[mk][st];
    const amt = Number(row.amount);
    if (row.direction === "IN") { s.total_in += amt; } else { s.total_out += amt; }
    s.net = s.total_in - s.total_out;
    s.count++;
  }

  return result;
}

// Single batched query: ALL transactions + cars for one month across ALL sheet types.
// This is the data source for instant client-side sheet and car navigation.
export async function getMonthFullData(
  investorId: string,
  monthKey: string
): Promise<MonthFullData> {
  const supabase = await createClient();

  type CarWithModelRow = {
    id: number;
    plate_number: string;
    model_group_id: number | null;
    model_group: { id: number; name: string | null; image_url: string | null } | null;
  };

  const [txResult, carsResult] = await Promise.all([
    supabase
      .from("financial_transactions")
      .select("id, date, category, note, direction, amount, car_id, sheet_type, receipt_url")
      .eq("investor_id", investorId)
      .eq("month_key", monthKey)
      .order("date", { ascending: false })
      .limit(10000),
    supabase
      .from("cars")
      .select("id, plate_number, model_group_id, model_group:model_group_id(id, name, image_url)")
      .eq("investor_id", investorId)
      .eq("is_active", true)
      .order("plate_number")
      .limit(500),
  ]);

  if (txResult.error) throw txResult.error;
  if (carsResult.error) throw carsResult.error;

  const transactions: TransactionRow[] = (txResult.data ?? []).map((r) => ({
    id: Number(r.id),
    date: r.date as string,
    category: (r.category as string) ?? "Other",
    note: r.note as string | null,
    direction: r.direction as "IN" | "OUT",
    amount: Number(r.amount),
    car_id: r.car_id != null ? Number(r.car_id) : null,
    sheet_type: r.sheet_type as string | undefined,
    receipt_url: (r.receipt_url as string | null) ?? null,
  }));

  const cars: CarBasic[] = ((carsResult.data ?? []) as unknown as CarWithModelRow[]).map((r) => ({
    id: r.id,
    plate_number: r.plate_number,
    model_group_id: r.model_group_id,
    model_group: r.model_group
      ? { id: r.model_group.id, name: r.model_group.name ?? "", image_url: r.model_group.image_url }
      : null,
  }));

  return { transactions, cars };
}

// All sheets aggregated for the overview — used by server action for non-preloaded months
export async function getAccountingOverviewData(
  investorId: string,
  monthKey: string
): Promise<Record<string, SheetSummary>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("sheet_type, direction, amount")
    .eq("investor_id", investorId)
    .eq("month_key", monthKey)
    .limit(5000);

  if (error) throw error;

  const result: Record<string, SheetSummary> = {};
  for (const r of data ?? []) {
    const st = (r.sheet_type as string) ?? "other";
    if (!result[st]) result[st] = { total_in: 0, total_out: 0, net: 0, count: 0 };
    const s = result[st];
    const amt = Number(r.amount);
    if (r.direction === "IN") { s.total_in += amt; } else { s.total_out += amt; }
    s.net = s.total_in - s.total_out;
    s.count++;
  }
  return result;
}

type CarWithModelRowPrivate = {
  id: number;
  plate_number: string;
  model_group_id: number | null;
  model_group: { id: number; name: string | null; image_url: string | null } | null;
};

export async function getInvestorCarsForAccounting(
  investorId: string
): Promise<CarBasic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("id, plate_number, model_group_id, model_group:model_group_id(id, name, image_url)")
    .eq("investor_id", investorId)
    .eq("is_active", true)
    .order("plate_number")
    .limit(500);

  if (error) throw error;

  return ((data ?? []) as unknown as CarWithModelRowPrivate[]).map((r) => ({
    id: r.id,
    plate_number: r.plate_number,
    model_group_id: r.model_group_id,
    model_group: r.model_group
      ? { id: r.model_group.id, name: r.model_group.name ?? "", image_url: r.model_group.image_url }
      : null,
  }));
}

export async function getSheetTransactions(
  investorId: string,
  monthKey: string,
  sheetType: string,
  carId?: number
): Promise<TransactionRow[]> {
  const supabase = await createClient();

  let q = supabase
    .from("financial_transactions")
    .select("id, date, category, note, direction, amount, car_id, receipt_url")
    .eq("investor_id", investorId)
    .eq("month_key", monthKey)
    .eq("sheet_type", sheetType)
    .order("date", { ascending: false })
    .limit(2000);

  if (carId !== undefined) q = q.eq("car_id", carId);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: Number(r.id),
    date: r.date as string,
    category: (r.category as string) ?? "Other",
    note: r.note as string | null,
    direction: r.direction as "IN" | "OUT",
    amount: Number(r.amount),
    car_id: r.car_id != null ? Number(r.car_id) : null,
    receipt_url: (r.receipt_url as string | null) ?? null,
  }));
}
