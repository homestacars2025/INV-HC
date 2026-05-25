import Link from "next/link";
import { Car, ArrowLeftRight, Building2, User, ChevronLeft } from "lucide-react";
import { TRY } from "@/components/shared/num";
import { cn } from "@/lib/utils";
import { SHEET_CONFIG, type SheetKey, type SheetSummary } from "@/lib/queries/accounting";
import { MonthNav } from "./month-nav";

const SHEET_ICONS: Record<
  SheetKey,
  React.ComponentType<{ className?: string }>
> = {
  car:               Car,
  buy_sell:          ArrowLeftRight,
  company_expenses:  Building2,
  personal_expenses: User,
};

const SHEET_ORDER: SheetKey[] = ["car", "buy_sell", "company_expenses", "personal_expenses"];

function HeroKpi({ label, value }: { label: string; value: number }) {
  const isNegative = value < 0;
  return (
    <div className="bg-paper rounded-2xl border border-line shadow-card p-5 flex flex-col gap-1">
      <p className="text-xs font-medium text-ink-3">{label}</p>
      <TRY
        value={Math.abs(value)}
        className={cn(
          "text-2xl md:text-3xl font-bold",
          isNegative ? "text-danger" : "text-success"
        )}
        prefix={isNegative ? "−" : undefined}
      />
    </div>
  );
}

function SheetCard({
  sheetKey,
  summary,
  monthKey,
}: {
  sheetKey: SheetKey;
  summary: SheetSummary;
  monthKey: string;
}) {
  const config = SHEET_CONFIG[sheetKey];
  const Icon = SHEET_ICONS[sheetKey];
  const isNegative = summary.net < 0;

  return (
    <Link
      href={`/accounting?sheet=${sheetKey}&month=${monthKey}`}
      className="relative bg-paper rounded-2xl border border-line shadow-card p-5 overflow-hidden hover:-translate-y-0.5 hover:shadow-lifted transition-all duration-200 flex flex-col gap-4 group"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 140px 100px at 15% 0%, ${config.color}12, transparent 70%)`,
        }}
      />

      {/* Icon + chevron */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${config.color}1F` }}
        >
          <span style={{ color: config.color }}>
          <Icon className="w-5 h-5" />
        </span>
        </div>
        <ChevronLeft className="w-4 h-4 text-ink-4 group-hover:text-ink-2 transition-colors rtl-flip" />
      </div>

      {/* Label + Net */}
      <div>
        <p className="text-xs text-ink-3 mb-1.5">{config.label}</p>
        <TRY
          value={Math.abs(summary.net)}
          className={cn(
            "text-xl md:text-2xl font-bold",
            isNegative ? "text-danger" : "text-success"
          )}
          prefix={isNegative ? "−" : undefined}
        />
      </div>
    </Link>
  );
}

interface AccountingOverviewProps {
  summaries: Record<string, SheetSummary>;
  monthKey: string;
}

export function AccountingOverview({ summaries, monthKey }: AccountingOverviewProps) {
  // Total net across all sheets
  const totalNet = Object.values(summaries).reduce((acc, s) => acc + s.net, 0);
  const rentalNet = summaries["car"]?.net ?? 0;

  return (
    <div className="space-y-6">
      {/* Month navigator */}
      <MonthNav monthKey={monthKey} />

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeroKpi label="الصافي الإجمالي للخزينة" value={totalNet} />
        <HeroKpi label="إجمالي دخل إيجار السيارات" value={rentalNet} />
      </div>

      {/* Sheet cards */}
      <div>
        <h2 className="text-base font-semibold text-ink mb-4">الحسابات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHEET_ORDER.map((key) => {
            const summary = summaries[key] ?? { total_in: 0, total_out: 0, net: 0, count: 0 };
            return (
              <SheetCard
                key={key}
                sheetKey={key}
                summary={summary}
                monthKey={monthKey}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
