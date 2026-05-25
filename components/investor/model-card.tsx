import Image from "next/image";
import { Car } from "lucide-react";
import { Num } from "@/components/shared/num";

interface ModelCardProps {
  model: {
    id: number;
    name: string;
    image_url: string | null;
    count: number;
  };
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="group rounded-2xl bg-paper border border-line shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-lifted transition-all duration-200 ease-out flex flex-col">
      {/* Image stage — dominant, ~75% of card */}
      <div className="relative h-48 md:h-56 lg:h-60 overflow-hidden bg-gradient-to-b from-paper to-paper-2">
        {model.image_url ? (
          <>
            {/* Scaling wrapper — zooms the car on hover, floor shadow stays put */}
            <div className="absolute inset-0 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]">
              <div className="relative w-full h-full px-5 py-4">
                <Image
                  src={model.image_url}
                  alt={model.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>

            {/* Floor shadow — subtle ellipse at bottom center for realism */}
            <div
              className="absolute bottom-0 inset-x-0 h-5 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 65% 100% at 50% 100%, rgb(0 0 0 / 0.09), transparent)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-20 h-20 text-ink-4" />
          </div>
        )}
      </div>

      {/* Info bar — compact, centered */}
      <div className="pt-4 pb-5 flex flex-col items-center gap-1">
        <p className="text-base font-semibold text-ink text-center">{model.name}</p>
        <p className="text-sm text-ink-3 text-center mt-1">
          <Num value={model.count} /> سيارة
        </p>
        <div className="h-0.5 w-10 rounded-full bg-brand mt-2" />
      </div>
    </div>
  );
}
