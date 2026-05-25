"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { arabicMonthName } from "@/lib/format/date";

function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthNav({ monthKey }: { monthKey: string }) {
  const router = useRouter();

  return (
    <div className="bg-paper border border-line rounded-2xl max-w-sm mx-auto w-full flex items-center justify-between px-2 py-1">
      {/*
        RTL layout: first DOM child sits on the physical RIGHT.
        Right = previous (older month), matching RTL "back in time" convention.
      */}
      <button
        onClick={() => router.push(`/accounting?month=${shiftMonth(monthKey, -1)}`)}
        className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-3 hover:bg-paper-3 hover:text-ink transition-colors"
        aria-label="الشهر السابق"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <p className="text-base font-bold text-ink">{arabicMonthName(monthKey)}</p>

      {/* Last DOM child sits on the physical LEFT → next (newer month). */}
      <button
        onClick={() => router.push(`/accounting?month=${shiftMonth(monthKey, +1)}`)}
        className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-3 hover:bg-paper-3 hover:text-ink transition-colors"
        aria-label="الشهر التالي"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
