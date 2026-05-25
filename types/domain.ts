export interface CarWithMonthly {
  id: number;
  plate_number: string;
  vehicle_id: string | null;
  is_active: boolean;
  model_group_id: number | null;
  is_currently_booked: boolean;
  model_group: {
    id: number;
    name: string;
    image_url: string | null;
  } | null;
  primary_photo: string | null;
}

export interface CarStatusCounts {
  total: number;
  working: number;
  parking: number;
  maintenance: number;
  selling: number;
  replacement: number;
}

export interface MonthlyKpi {
  totalIn: number;
  totalOut: number;
  net: number;
  activeCarsCount: number;
  activeBookingsCount: number;
}

export interface CarTransaction {
  id: number;
  date: string;
  category: string;
  note: string | null;
  direction: "IN" | "OUT";
  amount: number;
}

export interface CarBookingSlim {
  id: number;
  booking_number: string | null;
  start_date: string;
  end_date: string;
  status: string;
  is_currently_active: boolean;
}

export interface CarMonthlyReport {
  transactions: CarTransaction[];
  bookings: CarBookingSlim[];
  kpi: {
    in: number;
    out: number;
    net: number;
  };
}

export type AllowedRole = "admin" | "investor";
