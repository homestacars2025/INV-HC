export default function AccountingLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero KPIs skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-paper rounded-2xl border border-line p-5 h-24" />
        <div className="bg-paper rounded-2xl border border-line p-5 h-24" />
      </div>

      {/* Section title skeleton */}
      <div className="h-5 w-24 bg-paper-3 rounded" />

      {/* Sheet cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-paper rounded-2xl border border-line p-5 h-40" />
        ))}
      </div>
    </div>
  );
}
