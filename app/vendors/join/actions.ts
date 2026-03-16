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
      emailRedirectTo:
        "http://localhost:3000/auth/callback?next=/vendors/apply/secure",
    },
  });

  if (error) {
    console.error("Error sending vendor join link:", error);

    if (error.status === 429) {
      redirect(
        "/vendors/join?error=Too%20many%20emails%20sent.%20Please%20wait%20a%20few%20minutes%20before%20trying%20again."
      );
    }

    redirect("/vendors/join?error=Unable%20to%20send%20secure%20link");
  }

  redirect("/vendors/join?sent=1");
}
