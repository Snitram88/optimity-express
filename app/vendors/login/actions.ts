"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendVendorMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/vendors/login?error=Please%20enter%20your%20email");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:3000/",
    },
  });

  if (error) {
    console.error("Error sending magic link:", error);
    redirect("/vendors/login?error=Unable%20to%20send%20magic%20link");
  }

  redirect("/vendors/login?sent=1");
}
