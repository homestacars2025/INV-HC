import { TrendingUp, TrendingDown, Minus, Car } from "lucide-react";
import { TRY, Num } from "@/components/shared/num";
import { cn } from "@/lib/utils";
import type { MonthlyKpi } from "@/types/domain";

interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "danger" | "neutral";
  isCurrency?: boolean;
  isCount?: boolean;
}

function KpiCard({ label, value, icon, variant = "default", isCurrency, isCount }: KpiCardProps) {
  const colorMap = {
    default: "text-ink",
    success: "text-success",
    danger: "text-danger",
    neutral: "text-ink",
  };

  return (
    <div className="relative bg-paper rounded-2xl shadow-card border border-line p-5 overflow-hidden">
      <div className="absolute end-4 top-4 p-2 rounded-xl bg-paper-3 text-ink-3">
        {icon}
      </div>
      <p className="text-xs text-ink-4 font-medium mb-3">{label}</p>
      <p className={cn("text-2xl font-bold tracking-tight", colorMap[variant])}>
        {isCurrency && <TRY value={value} />}
        {isCount && <Num value={value} />}
        {!isCurrency && !isCount && <TRY value={value} />}
      </p>
    </div>
  );
}

interface MonthlyKpiStripProps {
  kpi: MonthlyKpi;
}

export function MonthlyKpiStrip({ kpi }: MonthlyKpiStripProps) {
  const netVariant =
    kpi.net > 0 ? "success" : kpi.net < 0 ? "danger" : "neutral";
  const NetIcon =
    kpi.net > 0 ? TrendingUp : kpi.net < 0 ? TrendingDown : Minus;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="إجمالي الإيرادات"
        value={kpi.totalIn}
        icon={<TrendingUp className="w-4 h-4" />}
        variant="success"
        isCurrency
      />
      <KpiCard
        label="إجمالي المصاريف"
        value={kpi.totalOut}
        icon={<TrendingDown className="w-4 h-4" />}
        variant="danger"
        isCurrency
      />
      <KpiCard
        label="صافي الشهر"
        value={kpi.net}
        icon={<NetIcon className="w-4 h-4" />}
        variant={netVariant}
        isCurrency
      />
      <KpiCard
        label="السيارات النشطة"
        value={kpi.activeBookingsCount}
        icon={<Car className="w-4 h-4" />}
        isCount
      />
    </div>
  );
}
