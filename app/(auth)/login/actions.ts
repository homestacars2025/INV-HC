"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NOT_INVESTOR_MESSAGE } from "./messages";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "حدث خطأ أثناء تسجيل الدخول" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "investor") {
    // Local scope: drop the session for this portal only. A global sign-out would
    // revoke the same user's session in the admin app, which shares this project.
    await supabase.auth.signOut({ scope: "local" });
    return { error: NOT_INVESTOR_MESSAGE };
  }

  revalidatePath("/", "layout");
  redirect("/cars");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
