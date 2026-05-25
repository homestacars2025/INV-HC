"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Wallet, FileBarChart, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/cars", label: "السيارات", icon: Car },
  { href: "/accounting", label: "المحاسبة", icon: Wallet },
  { href: "/reports", label: "التقارير", icon: FileBarChart },
] as const;

interface SidebarProps {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export function Sidebar({ fullName, email, avatarUrl, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = (fullName ?? email)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-paper border-e border-line flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink leading-none">هوميستا</p>
            <p className="text-[10px] text-ink-4 mt-0.5">بوابة المستثمرين</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-soft text-brand"
                  : "text-ink-2 hover:bg-paper-3 hover:text-ink"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-line">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-paper-3 transition-colors text-start cursor-pointer">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-brand-soft text-brand text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink truncate">
                  {fullName ?? email}
                </p>
                <p className="text-[10px] text-ink-4 truncate">
                  {role === "admin" ? "مشرف" : "مستثمر"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-danger focus:text-danger gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
