"use client";

import { create } from "zustand";

function getIstanbulMonthKey(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

interface MonthStore {
  monthKey: string;
  setMonthKey: (key: string) => void;
}

export const useMonthStore = create<MonthStore>((set) => ({
  monthKey: getIstanbulMonthKey(),
  setMonthKey: (key) => set({ monthKey: key }),
}));
