import { Car, CircleCheck, CircleSlash, Tag, Wrench, Repeat } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import type { CarStatusCounts } from "@/types/domain";

const CARD_COLORS = {
  total:       "#6EA4E7",
  working:     "#16A34A",
  parking:     "#DC2626",
  selling:     "#F59E0B",
  maintenance: "#64748B",
  replacement: "#2563EB",
} as const;

interface StatusCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

function StatusCard({ label, count, icon, color }: StatusCardProps) {
  return (
    <div className="relative bg-paper rounded-2xl border border-line p-5 overflow-hidden hover:-translate-y-1 hover:shadow-lifted transition-all duration-200 ease-out">
      {/* Soft radial glow from the top-end corner (RTL: physical top-left) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 130px 110px at 15% 0%, ${color}14, transparent 68%)`,
        }}
      />

      {/* Icon box — absolutely positioned at top-end corner */}
      <div
        className="absolute top-5 end-5 w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}1F` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      {/* Number + label — padded away from icon on end side */}
      <div className="flex flex-col pe-14">
        <p className="text-3xl sm:text-4xl font-bold text-ink leading-none pt-1">
          <CountUp value={count} />
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: color }}
          />
          <p className="text-sm text-ink-3 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface CarStatusStripProps {
  counts: CarStatusCounts;
}

export function CarStatusStrip({ counts }: CarStatusStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatusCard
        label="إجمالي سياراتك"
        count={counts.total}
        icon={<Car className="w-5 h-5" />}
        color={CARD_COLORS.total}
      />
      <StatusCard
        label="النشطة"
        count={counts.working}
        icon={<CircleCheck className="w-5 h-5" />}
        color={CARD_COLORS.working}
      />
      <StatusCard
        label="المتوقفة"
        count={counts.parking}
        icon={<CircleSlash className="w-5 h-5" />}
        color={CARD_COLORS.parking}
      />
      <StatusCard
        label="معروضة للبيع"
        count={counts.selling}
        icon={<Tag className="w-5 h-5" />}
        color={CARD_COLORS.selling}
      />
      <StatusCard
        label="في صيانة"
        count={counts.maintenance}
        icon={<Wrench className="w-5 h-5" />}
        color={CARD_COLORS.maintenance}
      />
      <StatusCard
        label="بديل"
        count={counts.replacement}
        icon={<Repeat className="w-5 h-5" />}
        color={CARD_COLORS.replacement}
      />
    </div>
  );
}
