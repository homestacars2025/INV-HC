"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Wallet, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/cars",       label: "السيارات",  icon: Car },
  { href: "/accounting", label: "المحاسبة",  icon: Wallet },
  { href: "/reports",    label: "التقارير",  icon: FileBarChart },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-paper border-t border-line flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] py-2 transition-colors",
              isActive ? "text-brand" : "text-ink-3"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
