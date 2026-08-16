import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getCurrentInvestor } from "@/lib/queries/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth + role enforcement — third layer, after the login action and the middleware.
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "investor") {
    // Local scope: drop the session for this portal only. A global sign-out would
    // revoke the same user's session in the admin app, which shares this project.
    await supabase.auth.signOut({ scope: "local" });
    redirect("/login");
  }

  // An investor role without an active investor record has nothing to show.
  const investor = await getCurrentInvestor();
  if (!investor) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/login");
  }

  const userInfo = {
    fullName: profile.full_name,
    email: profile.email ?? user.email ?? "",
    avatarUrl: profile.avatar_url,
  };

  return (
    <div className="flex min-h-screen bg-paper-2">
      {/* Sidebar — right side in RTL, hidden on mobile */}
      <Sidebar
        fullName={userInfo.fullName}
        email={userInfo.email}
        avatarUrl={userInfo.avatarUrl}
        role={profile.role}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="السيارات" user={userInfo} />
        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom tab bar — mobile only */}
      <BottomNav />
    </div>
  );
}
