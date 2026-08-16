import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { NOT_INVESTOR_ERROR } from "@/app/(auth)/login/messages";

const PROTECTED_PREFIX = ["/cars", "/accounting", "/reports"];

// Read-only: this client never writes cookies, so a no-op setAll is correct here.
async function getRole(request: NextRequest, userId: string) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role ?? null;
}

// Signs the session out and writes the cleared auth cookies onto the response we
// actually return. A client with a no-op setAll cannot clear them, which left a
// signed-in non-investor looping /login → /cars → /login.
async function signOutOnto(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  await supabase.auth.signOut();
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIX.some((p) => path.startsWith(p));
  const isLogin = path === "/login";

  if (!isProtected && !isLogin) return supabaseResponse;

  if (!user) {
    if (isProtected) return NextResponse.redirect(new URL("/login", request.url));
    return supabaseResponse;
  }

  // Signed in — the role decides everything below, including whether the user is
  // allowed to be bounced off /login into the portal.
  const role = await getRole(request, user.id);

  if (role !== "investor") {
    // Already back on /login carrying the rejection: serve the page instead of
    // redirecting to the same URL again. Either way the cookies are cleared on the
    // response, so the next request arrives signed out and no loop is possible.
    const alreadyRejected =
      isLogin && request.nextUrl.searchParams.get("error") === NOT_INVESTOR_ERROR;

    let response: NextResponse;
    if (alreadyRejected) {
      response = supabaseResponse;
    } else {
      const target = new URL("/login", request.url);
      target.searchParams.set("error", NOT_INVESTOR_ERROR);
      response = NextResponse.redirect(target);
    }

    await signOutOnto(request, response);
    return response;
  }

  if (isLogin) return NextResponse.redirect(new URL("/cars", request.url));

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
