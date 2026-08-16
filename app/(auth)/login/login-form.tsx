"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "./actions";
import { NOT_INVESTOR_ERROR, NOT_INVESTOR_MESSAGE } from "./messages";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type FormValues = z.infer<typeof schema>;

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3">
      <p className="text-sm text-danger">{message}</p>
    </div>
  );
}

// The middleware signs out an authenticated non-investor and sends them here with
// ?error=not_investor. Reading it needs useSearchParams, so it sits behind its own
// Suspense boundary — the rest of the form still prerenders statically.
function RejectionNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== NOT_INVESTOR_ERROR) return null;
  return <ErrorAlert message={NOT_INVESTOR_MESSAGE} />;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: FormValues) {
    setServerError(null);
    setSubmitted(true);
    const fd = new FormData();
    fd.set("email", values.email);
    fd.set("password", values.password);

    startTransition(async () => {
      const result = await signIn(fd);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-ink-2">
          البريد الإلكتروني
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="investor@homesta.com"
          dir="ltr"
          className={cn(
            "h-10 rounded-lg border-line bg-paper-2 placeholder:text-ink-4 font-numeric",
            errors.email && "border-danger focus-visible:ring-danger"
          )}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-danger">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-ink-2">
          كلمة المرور
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={cn(
              "h-10 rounded-lg border-line bg-paper-2 pe-10",
              errors.password && "border-danger focus-visible:ring-danger"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink-2 transition-colors"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger">{errors.password.message}</p>
        )}
      </div>

      {/* Rejection from the middleware, until the user makes their own attempt */}
      {serverError ? (
        <ErrorAlert message={serverError} />
      ) : (
        !submitted && (
          <Suspense fallback={null}>
            <RejectionNotice />
          </Suspense>
        )
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-brand hover:bg-brand-hover text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ms-2" />
            جارٍ تسجيل الدخول...
          </>
        ) : (
          "تسجيل الدخول"
        )}
      </Button>
    </form>
  );
}
