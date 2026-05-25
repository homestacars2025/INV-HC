import { createClient } from "@/lib/supabase/server";
import type { CarWithMonthly, MonthlyKpi } from "@/types/domain";

type CarWithModelRow = {
  id: number;
  plate_number: string;
  vehicle_id: string | null;
  is_active: boolean;
  model_group_id: number | null;
  model_group: {
    id: number;
    name: string | null;
    image_url: string | null;
  } | null;
};

type BookingCarRow = { car_id: number };

export async function getMyCars(
  investorId: string
): Promise<CarWithMonthly[]> {
  const supabase = await createClient();

  const { data: carsRaw, error } = await supabase
    .from("cars")
    .select(`
      id,
      plate_number,
      vehicle_id,
      is_active,
      model_group_id,
      model_group:model_group_id (
        id,
        name,
        image_url
      )
    `)
    .eq("investor_id", investorId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;
  const cars = (carsRaw ?? []) as CarWithModelRow[];
  if (cars.length === 0) return [];

  const carIds = cars.map((c) => c.id);

  const { data: activeBookingsData } = await supabase
    .from("bookings")
    .select("car_id")
    .in("car_id", carIds)
    .eq("is_currently_active", true)
    .limit(500);

  const activeCarsSet = new Set(
    ((activeBookingsData ?? []) as BookingCarRow[]).map((b) => b.car_id)
  );

  return cars.map((car) => ({
    id: car.id,
    plate_number: car.plate_number,
    vehicle_id: car.vehicle_id,
    is_active: car.is_active,
    model_group_id: car.model_group_id,
    model_group: car.model_group
      ? {
          id: car.model_group.id,
          name: car.model_group.name ?? "",
          image_url: car.model_group.image_url,
        }
      : null,
    primary_photo: null,
    is_currently_booked: activeCarsSet.has(car.id),
  }));
}

export async function getCarStatuses(investorId: string): Promise<Map<number, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_availability")
    .select("id, status")
    .eq("investor_id", investorId)
    .limit(1000);

  if (error) throw error;
  const statusByCarId = new Map<number, string>();
  for (const row of (data ?? []) as { id: number; status: string }[]) {
    statusByCarId.set(row.id, row.status);
  }
  return statusByCarId;
}

export async function getInvestorMonthlyKpis(
  investorId: string,
  monthKey: string
): Promise<MonthlyKpi> {
  const supabase = await createClient();

  const [txResult, carsResult] = await Promise.all([
    supabase
      .from("financial_transactions")
      .select("direction, amount")
      .eq("investor_id", investorId)
      .eq("month_key", monthKey)
      .limit(10000),
    supabase
      .from("cars")
      .select("id")
      .eq("investor_id", investorId)
      .eq("is_active", true)
      .limit(200),
  ]);

  let totalIn = 0;
  let totalOut = 0;
  for (const tx of txResult.data ?? []) {
    if (tx.direction === "IN") totalIn += Number(tx.amount);
    else totalOut += Number(tx.amount);
  }

  const carIds = (carsResult.data ?? []).map((c) => c.id);
  const activeCarsCount = carIds.length;

  let activeBookingsCount = 0;
  if (carIds.length > 0) {
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("car_id", carIds)
      .eq("is_currently_active", true);
    activeBookingsCount = count ?? 0;
  }

  return {
    totalIn,
    totalOut,
    net: totalIn - totalOut,
    activeCarsCount,
    activeBookingsCount,
  };
}
