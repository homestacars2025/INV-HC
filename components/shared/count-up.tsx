"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value.toLocaleString("en-US");
      return;
    }

    const controls = animate(0, value, {
      duration: 0.6,
      ease: [0.32, 0.94, 0.34, 1],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString("en-US");
        }
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span
      ref={ref}
      className="font-numeric tabular-nums"
      aria-label={value.toString()}
    >
      {value.toLocaleString("en-US")}
    </span>
  );
}
