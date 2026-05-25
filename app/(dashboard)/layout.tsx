import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  const ALLOWED = ["admin", "investor"];
  if (!profile || !ALLOWED.includes(profile.role)) {
    await supabase.auth.signOut();
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
