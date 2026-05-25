import { Num, TRY } from "@/components/shared/num";
import { BackButton } from "@/components/shared/back-button";
import { TransactionList } from "./transaction-list";
import { computeSummary, type CarBasic, type TransactionRow } from "@/lib/queries/accounting";

interface CarDetailProps {
  transactions: TransactionRow[];
  car: CarBasic | null;
  monthKey: string;
}

export function CarDetail({ transactions, car, monthKey }: CarDetailProps) {
  const { total_in, count } = computeSummary(transactions);
  const plateName = car?.plate_number ?? "—";
  const modelName = car?.model_group?.name ?? "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-3">
        <BackButton href={`/accounting?sheet=car&month=${monthKey}`} />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink font-numeric">
            {plateName}
          </h1>
          {modelName && <p className="text-sm text-ink-3 mt-0.5">{modelName}</p>}
          <p className="text-xs text-ink-4 mt-0.5">
            <Num value={count} /> عملية هذا الشهر
          </p>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-paper rounded-2xl border border-line shadow-card p-4">
          <p className="text-xs text-ink-3 mb-1">إجمالي الدخل</p>
          <TRY value={total_in} className="text-xl font-bold text-success" />
        </div>
        <div className="bg-paper rounded-2xl border border-line shadow-card p-4">
          <p className="text-xs text-ink-3 mb-1">عدد العمليات</p>
          <p className="text-xl font-bold text-ink">
            <Num value={count} />
          </p>
        </div>
      </div>

      {/* Transactions */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
