import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["admin", "investor"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function requireRole(): Promise<AllowedRole> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !ALLOWED_ROLES.includes(profile.role as AllowedRole)) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return profile.role as AllowedRole;
}

export async function requireInvestor() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: investor } = await supabase
    .from("investors")
    .select("id, profile_id, company_name, total_investment, is_active, commission_rate")
    .eq("profile_id", user.id)
    .eq("is_active", true)
    .single();

  if (!investor) redirect("/login");

  return investor;
}
