"use server";

import { createClient } from "@/lib/supabase/server";

export type VendorReviewState = {
  success: boolean;
  message: string;
};

export async function submitVendorReview(
  _prevState: VendorReviewState,
  formData: FormData
): Promise<VendorReviewState> {
  const supabase = await createClient();

  const vendor_id = String(formData.get("vendor_id") ?? "").trim();
  const reviewer_name = String(formData.get("reviewer_name") ?? "").trim();
  const reviewer_email = String(formData.get("reviewer_email") ?? "").trim();
  const ratingValue = String(formData.get("rating") ?? "").trim();
  const review_text = String(formData.get("review_text") ?? "").trim();

  if (!vendor_id || !reviewer_name || !reviewer_email || !ratingValue) {
    return {
      success: false,
      message: "Please complete your name, email, and rating.",
    };
  }

  const rating = Number(ratingValue);

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Please choose a valid rating between 1 and 5.",
    };
  }

  const { error } = await supabase.from("vendor_reviews").insert({
    vendor_id,
    reviewer_name,
    reviewer_email,
    rating,
    review_text: review_text || null,
    status: "pending",
    is_verified_interaction: false,
  });

  if (error) {
    console.error("Error submitting vendor review:", error);
    return {
      success: false,
      message: "We could not submit your review right now. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "Thanks for your review. It has been submitted and is awaiting moderation.",
  };
}
