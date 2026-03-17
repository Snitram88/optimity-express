"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function vendorPasswordLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/vendors/login?error=Please%20enter%20your%20email%20and%20password");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Vendor login error:", error);

    if (error.code === "email_not_confirmed") {
      redirect("/vendors/login?error=Please%20confirm%20your%20email%20before%20logging%20in");
    }

    redirect("/vendors/login?error=Invalid%20email%20or%20password");
  }

  redirect("/vendor/dashboard");
}
