import { Car } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getCurrentInvestor } from "@/lib/queries/auth";
import { getMyCars, getCarStatuses } from "@/lib/queries/cars";
import type { CarStatusCounts } from "@/types/domain";
import { CarStatusStrip } from "@/components/investor/car-status-strip";
import { CarCard } from "@/components/investor/car-card";
import { ModelCard } from "@/components/investor/model-card";
import { EmptyState } from "@/components/shared/empty-state";
import { redirect } from "next/navigation";

export default async function CarsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "investor"].includes(profile.role)) {
    redirect("/login");
  }

  // getAuthUser() result is memoized — getCurrentInvestor() reuses it, no extra network call
  const investor = await getCurrentInvestor();
  if (!investor) redirect("/login");

  const [cars, statusByCarId] = await Promise.all([
    getMyCars(investor.id),
    getCarStatuses(investor.id),
  ]);

  // Counts are derived from is_active=true cars only — guards against car_availability
  // potentially including sold/archived cars whose is_active status the view doesn't expose.
  const counts: CarStatusCounts = { total: 0, working: 0, parking: 0, maintenance: 0, selling: 0, replacement: 0 };
  for (const car of cars) {
    counts.total++;
    switch (statusByCarId.get(car.id) ?? "parking") {
      case "working":     counts.working++;     break;
      case "parking":     counts.parking++;     break;
      case "maintenance": counts.maintenance++; break;
      case "selling":     counts.selling++;     break;
      case "replacement": counts.replacement++; break;
    }
  }

  // Derive models overview from the same cars array — no extra query
  const modelMap = new Map<
    number,
    { id: number; name: string; image_url: string | null; count: number }
  >();
  for (const car of cars) {
    if (!car.model_group_id || !car.model_group) continue;
    const existing = modelMap.get(car.model_group_id);
    if (existing) {
      existing.count++;
    } else {
      modelMap.set(car.model_group_id, {
        id: car.model_group.id,
        name: car.model_group.name,
        image_url: car.model_group.image_url,
        count: 1,
      });
    }
  }
  const models = Array.from(modelMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Operational status strip */}
      <CarStatusStrip counts={counts} />

      {/* Models overview */}
      {models.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-ink">
              نظرة عامة على الموديلات
            </h2>
            <p className="text-sm text-ink-3 mt-0.5">
              موديلات سياراتك في الأسطول
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>
      )}

      {/* Individual cars */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">سياراتي</h2>
          <p className="text-sm text-ink-4 mt-0.5">
            {cars.length === 0
              ? "لا توجد سيارات مسجلة"
              : `إدارة ${cars.length} سيارة`}
          </p>
        </div>

        {cars.length === 0 ? (
          <div className="bg-paper rounded-2xl border border-line shadow-card">
            <EmptyState
              icon={Car}
              title="لا توجد سيارات مسجلة باسمك حالياً"
              description="تواصل مع الإدارة لإضافة سياراتك إلى البوابة"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                availabilityStatus={statusByCarId.get(car.id) ?? "parking"}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
