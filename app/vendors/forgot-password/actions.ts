"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/vendors/forgot-password?error=Please%20enter%20your%20email");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/",
  });

  if (error) {
    console.error("Password reset error:", error);
    redirect("/vendors/forgot-password?error=Unable%20to%20send%20reset%20email");
  }

  redirect("/vendors/forgot-password?sent=1");
}
