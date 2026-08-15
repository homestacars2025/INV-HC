"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ExternalLink, FileText, Receipt, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LABEL = "عرض الإيصال";

// Receipts are public files in the `transaction-receipts` bucket. PDFs cannot be
// rendered in the lightbox, so they open directly in a new tab instead.
function isPdf(url: string): boolean {
  const path = url.split("?")[0].split("#")[0];
  return path.toLowerCase().endsWith(".pdf");
}

const triggerClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-brand hover:bg-brand-soft transition-colors min-h-[44px] px-3 md:min-h-0 md:h-8 md:px-2.5";

function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={LABEL}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 p-4"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 self-stretch justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>فتح في تبويب جديد</span>
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Receipt image */}
      <div
        className="relative w-full max-w-3xl flex-1 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={url}
          alt={LABEL}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain"
          unoptimized
        />
      </div>
    </div>,
    document.body
  );
}

interface ReceiptViewerProps {
  url: string;
  /** `icon` renders a compact icon-only trigger for the desktop table. */
  variant?: "label" | "icon";
  className?: string;
}

export function ReceiptViewer({ url, variant = "label", className }: ReceiptViewerProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (isPdf(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={LABEL}
        title={LABEL}
        className={cn(triggerClass, variant === "icon" && "px-0 w-11 md:w-8", className)}
      >
        <FileText className="w-4 h-4 shrink-0" />
        {variant === "label" && <span>{LABEL}</span>}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={LABEL}
        title={LABEL}
        className={cn(triggerClass, variant === "icon" && "px-0 w-11 md:w-8", className)}
      >
        <Receipt className="w-4 h-4 shrink-0" />
        {variant === "label" && <span>{LABEL}</span>}
      </button>
      {open && <Lightbox url={url} onClose={close} />}
    </>
  );
}
