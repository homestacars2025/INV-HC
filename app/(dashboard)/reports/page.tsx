import { Construction } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-paper-3 flex items-center justify-center mx-auto">
          <Construction className="w-8 h-8 text-ink-4" />
        </div>
        <h2 className="text-xl font-semibold text-ink">هذه الصفحة قيد التطوير</h2>
        <p className="text-sm text-ink-4">سنوافيك بها قريباً</p>
      </div>
    </div>
  );
}
