import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const ALLOWED_ROLES = ["admin", "investor"];
const PROTECTED_PREFIX = ["/cars", "/accounting", "/reports"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIX.some((p) => path.startsWith(p));
  const isLogin = path === "/login";

  if (!isProtected && !isLogin) return supabaseResponse;

  if (isLogin && user) {
    return NextResponse.redirect(new URL("/cars", request.url));
  }

  if (isProtected) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const cookieStore = request.cookies;
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !ALLOWED_ROLES.includes(profile.role)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
