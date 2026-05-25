"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface MobileUserButtonProps {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
}

export function MobileUserButton({ fullName, email, avatarUrl }: MobileUserButtonProps) {
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
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center justify-center w-11 h-11 rounded-full cursor-pointer"
          aria-label="حساب المستخدم"
        >
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-brand-soft text-brand text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
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
  );
}
