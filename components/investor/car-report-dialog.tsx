"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { TRY } from "@/components/shared/num";
import { EmptyState } from "@/components/shared/empty-state";
import { formatArabicShortDate, arabicMonthName } from "@/lib/format/date";
import { cn } from "@/lib/utils";
import { FileX, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { CarWithMonthly, CarMonthlyReport } from "@/types/domain";

const SUPABASE_STORAGE =
  process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/";

interface CarReportDialogProps {
  open: boolean;
  onClose: () => void;
  car: CarWithMonthly;
  monthKey: string;
  investorId: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    active: { label: "نشط", class: "bg-success/10 text-success border-success/20" },
    completed: { label: "مكتمل", class: "bg-brand-soft text-brand border-brand/20" },
    cancelled: { label: "ملغي", class: "bg-danger-soft text-danger border-danger/20" },
    pending: { label: "معلّق", class: "bg-warning/10 text-warning border-warning/20" },
  };
  const s = map[status] ?? { label: status, class: "bg-paper-3 text-ink-3 border-line" };
  return (
    <span className={cn("inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border", s.class)}>
      {s.label}
    </span>
  );
}

export function CarReportDialog({
  open,
  onClose,
  car,
  monthKey,
  investorId,
}: CarReportDialogProps) {
  const [report, setReport] = useState<CarMonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setReport(null);

    fetch(`/api/car-report?carId=${car.id}&month=${monthKey}&investorId=${investorId}`)
      .then((r) => r.json())
      .then((data: CarMonthlyReport) => setReport(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, car.id, monthKey, investorId]);

  const imageUrl = car.primary_photo
    ? `${SUPABASE_STORAGE}${car.primary_photo}`
    : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-line shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-paper-3 shrink-0">
              {imageUrl ? (
                <Image src={imageUrl} alt={car.plate_number} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
              )}
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-ink font-numeric">
                {car.plate_number}
              </SheetTitle>
              <p className="text-xs text-ink-3 mt-0.5">
                {car.model_group?.name} · {arabicMonthName(monthKey)}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <ReportSkeleton />
          ) : report ? (
            <ReportContent report={report} />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ReportContent({ report }: { report: CarMonthlyReport }) {
  return (
    <div className="p-6 space-y-6">
      {/* Mini KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "الإيرادات", value: report.kpi.in, color: "text-success" },
          { label: "المصاريف", value: report.kpi.out, color: "text-danger" },
          { label: "الصافي", value: report.kpi.net, color: report.kpi.net >= 0 ? "text-success" : "text-danger" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-paper-2 rounded-xl border border-line p-3 text-center">
            <p className="text-[10px] text-ink-4 mb-1">{label}</p>
            <p className={cn("text-sm font-bold", color)}>
              <TRY value={value} />
            </p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <section>
        <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3">
          الحركات المالية
        </h3>
        {report.transactions.length === 0 ? (
          <EmptyState icon={FileX} title="لا توجد حركات مالية هذا الشهر" />
        ) : (
          <div className="rounded-xl border border-line overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-2 border-b border-line">
                <tr>
                  <th className="text-start px-3 py-2.5 text-xs font-medium text-ink-4">التاريخ</th>
                  <th className="text-start px-3 py-2.5 text-xs font-medium text-ink-4">الفئة</th>
                  <th className="text-start px-3 py-2.5 text-xs font-medium text-ink-4 hidden sm:table-cell">الوصف</th>
                  <th className="text-center px-3 py-2.5 text-xs font-medium text-ink-4">الاتجاه</th>
                  <th className="text-end px-3 py-2.5 text-xs font-medium text-ink-4">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {report.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper-2 transition-colors">
                    <td className="px-3 py-2.5 text-xs text-ink-3 font-numeric whitespace-nowrap">
                      {formatArabicShortDate(tx.date)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-ink-2">{tx.category}</td>
                    <td className="px-3 py-2.5 text-xs text-ink-3 hidden sm:table-cell max-w-[120px] truncate">
                      {tx.note ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {tx.direction === "IN" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                          <ArrowDownLeft className="w-3 h-3" />
                          وارد
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-danger bg-danger-soft px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="w-3 h-3" />
                          صادر
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-end">
                      <span className={cn("text-xs font-semibold font-numeric", tx.direction === "IN" ? "text-success" : "text-danger")}>
                        <TRY value={tx.amount} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Bookings */}
      <section>
        <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3">
          الحجوزات
        </h3>
        {report.bookings.length === 0 ? (
          <EmptyState icon={FileX} title="لا توجد حجوزات هذا الشهر" />
        ) : (
          <div className="space-y-2">
            {report.bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between bg-paper-2 rounded-xl border border-line px-4 py-3"
              >
                <div>
                  {b.booking_number && (
                    <p className="text-xs font-semibold text-ink font-numeric">
                      #{b.booking_number}
                    </p>
                  )}
                  <p className="text-[11px] text-ink-4 font-numeric mt-0.5">
                    {formatArabicShortDate(b.start_date)} ← {formatArabicShortDate(b.end_date)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
      </div>
    </div>
  );
}
