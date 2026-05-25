export default function CarsLoading() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-pulse">
      {/* Status strip skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-paper rounded-2xl border border-line p-5 h-28" />
        ))}
      </div>

      {/* Models skeleton */}
      <div className="space-y-4">
        <div className="h-7 w-48 bg-paper-3 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-paper rounded-2xl border border-line overflow-hidden">
              <div className="h-48 bg-paper-3" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-24 bg-paper-3 rounded mx-auto" />
                <div className="h-3 w-16 bg-paper-3 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cars grid skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-paper-3 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-paper rounded-2xl border border-line p-4 h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
