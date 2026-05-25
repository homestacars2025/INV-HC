import { createClient } from "@/lib/supabase/server";
import { monthBounds } from "@/lib/format/date";
import type { CarMonthlyReport } from "@/types/domain";

export async function getCarMonthlyReport(
  carId: number,
  investorId: string,
  monthKey: string
): Promise<CarMonthlyReport> {
  const supabase = await createClient();
  const { firstDay, lastDay } = monthBounds(monthKey);

  const [txResult, bookingsResult] = await Promise.all([
    supabase
      .from("financial_transactions")
      .select("id, date, category, note, direction, amount")
      .eq("investor_id", investorId)
      .eq("car_id", carId)
      .eq("month_key", monthKey)
      .order("date", { ascending: false })
      .limit(500),

    // No customer data — booking-level fields only
    supabase
      .from("bookings")
      .select("id, booking_number, start_date, end_date, status, is_currently_active")
      .eq("car_id", carId)
      .lte("start_date", lastDay)
      .gte("end_date", firstDay)
      .order("start_date", { ascending: false })
      .limit(100),
  ]);

  const transactions = (txResult.data ?? []).map((tx) => ({
    id: tx.id,
    date: tx.date,
    category: tx.category ?? "أخرى",
    note: tx.note,
    direction: tx.direction as "IN" | "OUT",
    amount: Number(tx.amount),
  }));

  let totalIn = 0;
  let totalOut = 0;
  for (const tx of transactions) {
    if (tx.direction === "IN") totalIn += tx.amount;
    else totalOut += tx.amount;
  }

  const bookings = (bookingsResult.data ?? []).map((b) => ({
    id: b.id,
    booking_number: b.booking_number,
    start_date: b.start_date,
    end_date: b.end_date,
    status: b.status as string,
    is_currently_active: b.is_currently_active,
  }));

  return {
    transactions,
    bookings,
    kpi: { in: totalIn, out: totalOut, net: totalIn - totalOut },
  };
}
