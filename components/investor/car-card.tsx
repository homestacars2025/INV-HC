import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarWithMonthly } from "@/types/domain";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  working:     { label: "نشطة",   className: "bg-success/10 text-success border-success/20" },
  parking:     { label: "متوقفة", className: "bg-paper-3 text-ink-3 border-line" },
  maintenance: { label: "صيانة",  className: "bg-warning/10 text-warning border-warning/20" },
  selling:     { label: "للبيع",  className: "bg-[#ecfeff] text-[#0891b2] border-[#a5f3fc]" },
  replacement: { label: "بديل",   className: "bg-[#f5f3ff] text-[#8b5cf6] border-[#ddd6fe]" },
};

interface CarCardProps {
  car: CarWithMonthly;
  availabilityStatus: string;
}

export function CarCard({ car, availabilityStatus }: CarCardProps) {
  const badge = STATUS_CONFIG[availabilityStatus] ?? STATUS_CONFIG.parking;

  return (
    <div className="rounded-2xl bg-paper border border-line shadow-card p-5 hover:shadow-lifted transition-all duration-200 flex flex-col gap-1">
      <div className="flex justify-end mb-1">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border",
            badge.className
          )}
        >
          <CircleDot className="w-2.5 h-2.5" />
          {badge.label}
        </span>
      </div>

      <p className="text-lg font-bold text-ink font-numeric tracking-wide">
        {car.plate_number}
      </p>

      <p className="text-sm text-ink-3">
        {car.model_group?.name ?? "—"}
      </p>
    </div>
  );
}
