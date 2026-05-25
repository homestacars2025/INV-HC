import { cn } from "@/lib/utils";
import { TRY } from "@/components/shared/num";
import { formatArabicShortDate } from "@/lib/format/date";
import type { TransactionRow } from "@/lib/queries/accounting";

function DirectionBadge({ direction }: { direction: "IN" | "OUT" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        direction === "IN"
          ? "bg-success/10 text-success border-success/20"
          : "bg-danger/10 text-danger border-danger/20"
      )}
    >
      {direction === "IN" ? "دخل" : "خروج"}
    </span>
  );
}

function TxAmount({ direction, amount }: { direction: "IN" | "OUT"; amount: number }) {
  return (
    <TRY
      value={amount}
      className={cn(
        "text-sm font-semibold",
        direction === "IN" ? "text-success" : "text-danger"
      )}
    />
  );
}

interface TransactionListProps {
  transactions: TransactionRow[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-center py-12 text-sm text-ink-3">
        لا توجد عمليات في هذا الشهر
      </p>
    );
  }

  return (
    <>
      {/* Mobile — stacked cards */}
      <div className="md:hidden space-y-2">
        {transactions.map((tx) => {
          const primary = tx.note || tx.category;
          const secondary = tx.note && tx.category !== "Other" ? tx.category : null;
          return (
            <div
              key={tx.id}
              className="bg-paper rounded-xl border border-line p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xs text-ink-3">{formatArabicShortDate(tx.date)}</p>
                  <p className="text-sm text-ink font-medium leading-snug">{primary}</p>
                  {secondary && (
                    <p className="text-xs text-ink-4">{secondary}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <DirectionBadge direction={tx.direction} />
                  <TxAmount direction={tx.direction} amount={tx.amount} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop — table */}
      <div className="hidden md:block rounded-2xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-paper-2 border-b border-line">
              <th className="text-start ps-5 py-3 text-xs font-semibold text-ink-3 w-36">التاريخ</th>
              <th className="text-start ps-4 py-3 text-xs font-semibold text-ink-3">التوضيح</th>
              <th className="text-center py-3 text-xs font-semibold text-ink-3 w-24">النوع</th>
              <th className="text-end pe-5 py-3 text-xs font-semibold text-ink-3 w-36">القيمة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {transactions.map((tx) => {
              const primary = tx.note || tx.category;
              const secondary = tx.note && tx.category !== "Other" ? tx.category : null;
              return (
                <tr key={tx.id} className="bg-paper hover:bg-paper-2 transition-colors">
                  <td className="ps-5 py-3.5 text-xs text-ink-3">
                    {formatArabicShortDate(tx.date)}
                  </td>
                  <td className="ps-4 py-3.5">
                    <p className="text-sm text-ink">{primary}</p>
                    {secondary && (
                      <p className="text-xs text-ink-4 mt-0.5">{secondary}</p>
                    )}
                  </td>
                  <td className="py-3.5 text-center">
                    <DirectionBadge direction={tx.direction} />
                  </td>
                  <td className="pe-5 py-3.5 text-end">
                    <TxAmount direction={tx.direction} amount={tx.amount} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
