import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getCurrentInvestor } from "@/lib/queries/auth";
import {
  getAccountingOverviewData,
  getSheetTransactions,
  getInvestorCarsForAccounting,
} from "@/lib/queries/accounting";
import { getIstanbulMonthKey } from "@/lib/format/date";
import { AccountingOverview } from "@/components/accounting/overview";
import { SimpleSheet } from "@/components/accounting/simple-sheet";
import { RentalIncomeSheet } from "@/components/accounting/rental-income-sheet";
import { CarDetail } from "@/components/accounting/car-detail";

type SearchParams = Promise<{ month?: string; sheet?: string; carId?: string }>;

export default async function AccountingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "investor"].includes(profile.role)) redirect("/login");

  const investor = await getCurrentInvestor();
  if (!investor) redirect("/login");

  const { month, sheet, carId: carIdStr } = await searchParams;
  const monthKey = month ?? getIstanbulMonthKey();
  const carId = carIdStr ? Number(carIdStr) : undefined;

  // Level 3 — single car rental detail
  if (sheet === "car" && carId !== undefined) {
    const [transactions, cars] = await Promise.all([
      getSheetTransactions(investor.id, monthKey, "car", carId),
      getInvestorCarsForAccounting(investor.id),
    ]);
    const car = cars.find((c) => c.id === carId) ?? null;
    return <CarDetail transactions={transactions} car={car} monthKey={monthKey} />;
  }

  // Level 2B — rental income grouped by car/model
  if (sheet === "car") {
    const [transactions, cars] = await Promise.all([
      getSheetTransactions(investor.id, monthKey, "car"),
      getInvestorCarsForAccounting(investor.id),
    ]);
    return (
      <RentalIncomeSheet transactions={transactions} cars={cars} monthKey={monthKey} />
    );
  }

  // Level 2A — simple flat sheet
  if (sheet) {
    const transactions = await getSheetTransactions(investor.id, monthKey, sheet);
    return (
      <SimpleSheet transactions={transactions} sheetType={sheet} monthKey={monthKey} />
    );
  }

  // Level 1 — overview
  const summaries = await getAccountingOverviewData(investor.id, monthKey);
  return <AccountingOverview summaries={summaries} monthKey={monthKey} />;
}
