// Pure types and functions — no server imports.
// Safe to import from both server and client components.

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
  sheet_type?: string;
  // Public URL of the staff-uploaded receipt (transaction-receipts bucket). Read-only in this portal.
  receipt_url: string | null;
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

export type YearData = Record<string, Record<string, SheetSummary>>;

export type MonthFullData = {
  transactions: TransactionRow[];
  cars: CarBasic[];
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
