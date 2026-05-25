import { createClient } from "@/lib/supabase/server";

export const SHEET_CONFIG = {
  car:               { label: "حساب دخل إيجار السيارات", color: "#6EA4E7" },
  buy_sell:          { label: "حساب مبيعات السيارات",    color: "#F59E0B" },
  company_expenses:  { label: "مصاريف الشركة",           color: "#64748B" },
  personal_expenses: { label: "مصاريف شخصية",           color: "#DC2626" },
} as const;

export type SheetKey = keyof typeof SHEET_CONFIG;

export type TransactionRow = {
  id: number;
  date: string;
  category: string;
  note: string | null;
  direction: "IN" | "OUT";
  amount: number;
  car_id: number | null;
};

export type CarBasic = {
  id: number;
  plate_number: string;
  model_group_id: number | null;
  model_group: { id: number; name: string; image_url: string | null } | null;
};

export type SheetSummary = {
  total_in: number;
  total_out: number;
  net: number;
  count: number;
};

export function computeSummary(
  rows: Pick<TransactionRow, "direction" | "amount">[]
): SheetSummary {
  let total_in = 0;
  let total_out = 0;
  for (const r of rows) {
    if (r.direction === "IN") total_in += r.amount;
    else total_out += r.amount;
  }
  return { total_in, total_out, net: total_in - total_out, count: rows.length };
}

// Level 1 — all sheets aggregated for the overview
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

  const bySheet: Record<string, { direction: "IN" | "OUT"; amount: number }[]> = {};
  for (const r of data ?? []) {
    const st = (r.sheet_type as string) ?? "other";
    if (!bySheet[st]) bySheet[st] = [];
    bySheet[st].push({
      direction: r.direction as "IN" | "OUT",
      amount: Number(r.amount),
    });
  }

  const result: Record<string, SheetSummary> = {};
  for (const [st, rows] of Object.entries(bySheet)) {
    result[st] = computeSummary(rows);
  }
  return result;
}

// Level 2 (simple sheets) and Level 3 (car detail)
export async function getSheetTransactions(
  investorId: string,
  monthKey: string,
  sheetType: string,
  carId?: number
): Promise<TransactionRow[]> {
  const supabase = await createClient();

  let q = supabase
    .from("financial_transactions")
    .select("id, date, category, note, direction, amount, car_id")
    .eq("investor_id", investorId)
    .eq("month_key", monthKey)
    .eq("sheet_type", sheetType)
    .order("date", { ascending: false })
    .limit(2000);

  if (carId !== undefined) {
    q = q.eq("car_id", carId);
  }

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
  }));
}

// Active cars with model info — for rental income grouping
type CarWithModelRow = {
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

  return ((data ?? []) as unknown as CarWithModelRow[]).map((r) => ({
    id: r.id,
    plate_number: r.plate_number,
    model_group_id: r.model_group_id,
    model_group: r.model_group
      ? {
          id: r.model_group.id,
          name: r.model_group.name ?? "",
          image_url: r.model_group.image_url,
        }
      : null,
  }));
}
