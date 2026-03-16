"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendVendorJoinLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/vendors/join?error=Please%20enter%20your%20business%20email");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:3000/vendors/apply/secure",
    },
  });

  if (error) {
    console.error("Error sending vendor join link:", error);
    redirect("/vendors/join?error=Unable%20to%20send%20secure%20link");
  }

  redirect("/vendors/join?sent=1");
}
