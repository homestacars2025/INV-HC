"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-5xl">⚠️</p>
        <h2 className="text-xl font-semibold text-ink">حدث خطأ غير متوقع</h2>
        <p className="text-ink-3 text-sm">{error.message}</p>
        <Button onClick={reset} className="bg-brand hover:bg-brand-hover text-white">
          حاول مجدداً
        </Button>
      </div>
    </div>
  );
}
