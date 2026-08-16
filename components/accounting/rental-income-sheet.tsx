import Link from "next/link";
import { Num, TRY } from "@/components/shared/num";
import { BackButton } from "@/components/shared/back-button";
import { computeSummary, type CarBasic, type TransactionRow } from "@/lib/queries/accounting";

type CarGroup = {
  car: CarBasic;
  // Net (IN − OUT), matching the sheet total. Negative means the car ran at a
  // loss this month — the card must show that, not just its income.
  net: number;
  count: number;
};

type ModelGroup = {
  model: { id: number; name: string };
  carCount: number;
  cars: CarGroup[];
};

function buildModelGroups(
  transactions: TransactionRow[],
  cars: CarBasic[]
): { groups: ModelGroup[]; ungroupedCars: CarGroup[] } {
  // Index transactions by car_id
  const txByCar = new Map<number, TransactionRow[]>();
  for (const tx of transactions) {
    if (tx.car_id == null) continue;
    if (!txByCar.has(tx.car_id)) txByCar.set(tx.car_id, []);
    txByCar.get(tx.car_id)!.push(tx);
  }

  // Build per-car summaries (only cars that have transactions this month)
  const carGroups: CarGroup[] = [];
  for (const car of cars) {
    const txs = txByCar.get(car.id);
    if (!txs || txs.length === 0) continue;
    const { net, count } = computeSummary(txs);
    carGroups.push({ car, net, count });
  }

  // Group by model
  const modelMap = new Map<number, ModelGroup>();
  const ungroupedCars: CarGroup[] = [];

  for (const cg of carGroups) {
    const mg = cg.car.model_group;
    if (!mg) {
      ungroupedCars.push(cg);
      continue;
    }
    if (!modelMap.has(mg.id)) {
      modelMap.set(mg.id, { model: { id: mg.id, name: mg.name }, carCount: 0, cars: [] });
    }
    const group = modelMap.get(mg.id)!;
    group.cars.push(cg);
    group.carCount++;
  }

  // Sort models by total net desc, cars within each model by net
  const groups = Array.from(modelMap.values())
    .map((g) => ({
      ...g,
      cars: g.cars.sort((a, b) => b.net - a.net),
    }))
    .sort(
      (a, b) =>
        b.cars.reduce((s, c) => s + c.net, 0) -
        a.cars.reduce((s, c) => s + c.net, 0)
    );

  return { groups, ungroupedCars };
}

function CarCard({
  cg,
  monthKey,
}: {
  cg: CarGroup;
  monthKey: string;
}) {
  return (
    <Link
      href={`/accounting?sheet=car&carId=${cg.car.id}&month=${monthKey}`}
      className="bg-paper rounded-2xl border border-line shadow-card p-4 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-lifted transition-all duration-200 group"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-bold text-ink font-numeric tracking-wide">
          {cg.car.plate_number}
        </p>
        <p className="text-xs text-ink-3">{cg.car.model_group?.name ?? "—"}</p>
        <p className="text-xs text-ink-4">
          <Num value={cg.count} /> عملية
        </p>
      </div>
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        {/* Same negative treatment as the sheet total: red + leading − */}
        <TRY
          value={Math.abs(cg.net)}
          className={`text-base font-bold ${cg.net < 0 ? "text-danger" : "text-success"}`}
          prefix={cg.net < 0 ? "−" : undefined}
        />
        <span className="text-[10px] text-ink-4 group-hover:text-brand transition-colors">
          التفاصيل ←
        </span>
      </div>
    </Link>
  );
}

interface RentalIncomeSheetProps {
  transactions: TransactionRow[];
  cars: CarBasic[];
  monthKey: string;
}

export function RentalIncomeSheet({
  transactions,
  cars,
  monthKey,
}: RentalIncomeSheetProps) {
  const { total_in, net, count } = computeSummary(transactions);
  const { groups, ungroupedCars } = buildModelGroups(transactions, cars);
  const activeCars = groups.reduce((s, g) => s + g.carCount, 0) + ungroupedCars.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-3">
        <BackButton href={`/accounting?month=${monthKey}`} />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink">
            حساب دخل إيجار السيارات
          </h1>
          <p className="text-sm text-ink-3 mt-0.5">
            <Num value={activeCars} /> سيارة · <Num value={count} /> عملية
          </p>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-paper rounded-2xl border border-line shadow-card p-4">
          <p className="text-xs text-ink-3 mb-1">إجمالي الدخل</p>
          <TRY value={total_in} className="text-xl font-bold text-success" />
        </div>
        <div className="bg-paper rounded-2xl border border-line shadow-card p-4">
          <p className="text-xs text-ink-3 mb-1">الصافي</p>
          <TRY
            value={Math.abs(net)}
            className={`text-xl font-bold ${net >= 0 ? "text-success" : "text-danger"}`}
            prefix={net < 0 ? "−" : undefined}
          />
        </div>
      </div>

      {/* Models + cars */}
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.model.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 rounded-full bg-brand" />
              <h2 className="text-sm font-semibold text-ink">
                {g.model.name}
              </h2>
              <span className="text-xs text-ink-3">
                · <Num value={g.carCount} /> سيارة
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.cars.map((cg) => (
                <CarCard key={cg.car.id} cg={cg} monthKey={monthKey} />
              ))}
            </div>
          </section>
        ))}

        {ungroupedCars.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 rounded-full bg-line" />
              <h2 className="text-sm font-semibold text-ink-3">سيارات أخرى</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ungroupedCars.map((cg) => (
                <CarCard key={cg.car.id} cg={cg} monthKey={monthKey} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
