import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Memoized per-request — a single auth.getUser() network call is shared across
// all server functions that run in the same request/render tree.
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

export async function getCurrentUser() {
  return getAuthUser();
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url, email")
    .eq("id", userId)
    .single();
  return data;
}

export async function getCurrentInvestor() {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investors")
    .select(
      "id, profile_id, company_name, total_investment, is_active, phone, whatsapp, email, commission_rate, created_at"
    )
    .eq("profile_id", user.id)
    .eq("is_active", true)
    .single();

  return investor;
}
