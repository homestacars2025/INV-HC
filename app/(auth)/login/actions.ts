"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["admin", "investor"] as const;

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

  if (!profile || !ALLOWED_ROLES.includes(profile.role as (typeof ALLOWED_ROLES)[number])) {
    await supabase.auth.signOut();
    return { error: "ليس لديك صلاحية الوصول إلى هذه البوابة" };
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
