import { cn } from "@/lib/utils";

interface NumProps {
  value: number;
  format?: Intl.NumberFormatOptions;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Num({ value, format, className, prefix, suffix }: NumProps) {
  const formatted = new Intl.NumberFormat("en-US", format).format(value);
  return (
    <span className={cn("font-numeric", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function TRY({
  value,
  className,
  prefix,
}: {
  value: number;
  className?: string;
  prefix?: string;
}) {
  return (
    <Num
      value={value}
      format={{ style: "currency", currency: "TRY", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      className={className}
      prefix={prefix}
    />
  );
}
