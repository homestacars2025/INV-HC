import { Suspense } from "react";
import { MonthPicker } from "./month-picker";
import { MobileUserButton } from "./mobile-user-button";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  title: string;
  user: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function Header({ title, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-sm border-b border-line">
      <div className="flex items-center justify-between px-4 lg:px-8 h-14">
        <h1 className="text-base font-semibold text-ink">{title}</h1>
        <div className="flex items-center gap-2">
          <Suspense fallback={<Skeleton className="h-11 w-36 rounded-lg" />}>
            <MonthPicker />
          </Suspense>
          <MobileUserButton
            fullName={user.fullName}
            email={user.email}
            avatarUrl={user.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
