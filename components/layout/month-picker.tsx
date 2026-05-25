"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMonthStore } from "@/lib/store/month-store";
import { arabicMonthName, getIstanbulMonthKey } from "@/lib/format/date";
import { cn } from "@/lib/utils";

function getRecentMonths(currentKey: string, count = 12): string[] {
  const [year, month] = currentKey.split("-").map(Number);
  const months: string[] = [];
  for (let i = 0; i < count; i++) {
    let m = month - i;
    let y = year;
    while (m <= 0) { m += 12; y -= 1; }
    months.push(`${y}-${String(m).padStart(2, "0")}`);
  }
  return months;
}

function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function MonthPicker() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { monthKey, setMonthKey } = useMonthStore();

  useEffect(() => {
    const urlMonth = searchParams.get("month");
    const current = urlMonth ?? getIstanbulMonthKey();
    setMonthKey(current);
    if (!urlMonth) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", current);
      router.replace(`${pathname}?${params.toString()}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectMonth(key: string) {
    setMonthKey(key);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", key);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  // Accounting has its own centered MonthNav — hide the header picker there
  if (pathname.startsWith("/accounting")) return null;

  const recentMonths = getRecentMonths(getIstanbulMonthKey(), 12);
  const canGoNext = monthKey < getIstanbulMonthKey();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex items-center gap-2 text-sm text-ink border border-line bg-paper hover:bg-paper-3 font-normal h-11 px-4 rounded-lg transition-colors cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-ink-3" />
        <span className="font-medium">{arabicMonthName(monthKey)}</span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        {/* Prev / Next */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <button
            onClick={() => selectMonth(shiftMonth(monthKey, -1))}
            className="flex items-center justify-center w-11 h-11 rounded-md hover:bg-paper-3 transition-colors"
            aria-label="الشهر السابق"
          >
            <ChevronRight className="w-4 h-4 text-ink-3 rtl-flip" />
          </button>
          <span className="text-sm font-medium text-ink">
            {arabicMonthName(monthKey)}
          </span>
          <button
            onClick={() => canGoNext && selectMonth(shiftMonth(monthKey, 1))}
            disabled={!canGoNext}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-md transition-colors",
              canGoNext ? "hover:bg-paper-3" : "opacity-30 cursor-not-allowed"
            )}
            aria-label="الشهر التالي"
          >
            <ChevronLeft className="w-4 h-4 text-ink-3 rtl-flip" />
          </button>
        </div>

        {/* Month list */}
        <div className="py-2 max-h-64 overflow-y-auto">
          {recentMonths.map((key) => (
            <button
              key={key}
              onClick={() => selectMonth(key)}
              className={cn(
                "w-full text-start px-4 min-h-[44px] flex items-center text-sm transition-colors",
                key === monthKey
                  ? "bg-brand-soft text-brand font-semibold"
                  : "text-ink-2 hover:bg-paper-3"
              )}
            >
              {arabicMonthName(key)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
