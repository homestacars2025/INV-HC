export function formatArabicDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

export function formatArabicShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

export function arabicMonthName(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("ar", {
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

export function monthKeyFromDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

export function getIstanbulMonthKey(): string {
  return monthKeyFromDate(new Date());
}

export function monthBounds(monthKey: string): { firstDay: string; lastDay: string } {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    firstDay: firstDay.toISOString().slice(0, 10),
    lastDay: lastDay.toISOString().slice(0, 10),
  };
}
