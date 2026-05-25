import { TRY } from "@/components/shared/num";
import { BackButton } from "@/components/shared/back-button";
import { cn } from "@/lib/utils";
import { TransactionList } from "./transaction-list";
import { SHEET_CONFIG, computeSummary, type SheetKey, type TransactionRow } from "@/lib/queries/accounting";

function KpiTile({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="bg-paper rounded-2xl border border-line shadow-card p-4 flex flex-col gap-1">
      <p className="text-xs text-ink-3">{label}</p>
      <TRY
        value={Math.abs(value)}
        className={cn(
          "text-xl font-bold",
          variant === "positive" && "text-success",
          variant === "negative" && "text-danger",
          variant === "neutral" && (value < 0 ? "text-danger" : "text-success")
        )}
        prefix={variant === "neutral" && value < 0 ? "−" : undefined}
      />
    </div>
  );
}

interface SimpleSheetProps {
  transactions: TransactionRow[];
  sheetType: string;
  monthKey: string;
}

export function SimpleSheet({ transactions, sheetType, monthKey }: SimpleSheetProps) {
  const config = SHEET_CONFIG[sheetType as SheetKey] ?? {
    label: sheetType,
    color: "#64748B",
  };
  const summary = computeSummary(transactions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-3">
        <BackButton href={`/accounting?month=${monthKey}`} />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink">{config.label}</h1>
          <p className="text-sm text-ink-3 mt-0.5">{summary.count} عملية</p>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-3 gap-3">
        <KpiTile label="إجمالي الدخل" value={summary.total_in} variant="positive" />
        <KpiTile label="إجمالي الخروج" value={summary.total_out} variant="negative" />
        <KpiTile label="الصافي" value={summary.net} variant="neutral" />
      </div>

      {/* Transactions */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
