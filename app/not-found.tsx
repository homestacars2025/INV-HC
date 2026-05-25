import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl font-numeric font-bold text-line-strong">404</p>
        <h2 className="text-xl font-semibold text-ink">الصفحة غير موجودة</h2>
        <p className="text-ink-3 text-sm">تعذّر العثور على الصفحة المطلوبة</p>
        <Link
          href="/cars"
          className={cn(buttonVariants({ variant: "default" }), "bg-brand hover:bg-brand-hover text-white")}
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
