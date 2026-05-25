import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCarMonthlyReport } from "@/lib/queries/reports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const carId = searchParams.get("carId");
  const month = searchParams.get("month");

  if (!carId || !month) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: investor } = await supabase
    .from("investors")
    .select("id")
    .eq("profile_id", user.id)
    .eq("is_active", true)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify the car belongs to this investor and is still active (not sold/archived)
  const { data: car } = await supabase
    .from("cars")
    .select("id")
    .eq("id", Number(carId))
    .eq("investor_id", investor.id)
    .eq("is_active", true)
    .single();

  if (!car) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const report = await getCarMonthlyReport(Number(carId), investor.id, month);
  return NextResponse.json(report);
}
