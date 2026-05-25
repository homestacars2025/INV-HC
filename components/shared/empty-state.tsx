import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-paper-3 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-ink-4" />
        </div>
      )}
      <p className="text-base font-medium text-ink-2">{title}</p>
      {description && (
        <p className="text-sm text-ink-4 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
