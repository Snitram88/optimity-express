"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveVendorReview(formData: FormData) {
  const supabase = await createClient();
  const reviewId = String(formData.get("review_id") ?? "").trim();

  if (!reviewId) return;

  await supabase
    .from("vendor_reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);

  revalidatePath("/admin/reviews");
}

export async function rejectVendorReview(formData: FormData) {
  const supabase = await createClient();
  const reviewId = String(formData.get("review_id") ?? "").trim();

  if (!reviewId) return;

  await supabase
    .from("vendor_reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);

  revalidatePath("/admin/reviews");
}
