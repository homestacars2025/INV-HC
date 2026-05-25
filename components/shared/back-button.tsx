import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "رجوع" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="self-start inline-flex items-center gap-1.5 px-3 rounded-lg text-sm font-medium text-ink-2 hover:bg-paper-3 hover:text-ink transition-colors min-h-[44px] md:h-9 md:min-h-0"
    >
      <ChevronRight className="w-4 h-4 rtl-flip shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
