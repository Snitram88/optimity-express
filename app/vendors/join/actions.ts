"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerVendorAccount(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirm_password") ?? "").trim();

  if (!email || !password || !confirmPassword) {
    redirect("/vendors/join?error=Please%20complete%20all%20fields");
  }

  if (password.length < 6) {
    redirect("/vendors/join?error=Password%20must%20be%20at%20least%206%20characters");
  }

  if (password !== confirmPassword) {
    redirect("/vendors/join?error=Passwords%20do%20not%20match");
  }

  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("Vendor signup error:", signUpError);
    redirect("/vendors/join?error=Unable%20to%20create%20vendor%20account");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("Vendor auto-login error:", signInError);
    redirect("/vendors/login?error=Account%20created.%20Please%20log%20in.");
  }

  redirect("/vendors/apply");
}
