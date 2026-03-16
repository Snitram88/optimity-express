import { createClient } from "@/lib/supabase/server";

export type PendingVendorReview = {
  id: string;
  vendor_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
  vendor: {
    business_name: string;
    slug: string;
  } | null;
};

type RawReview = {
  id: string;
  vendor_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
  vendors: {
    business_name: string;
    slug: string;
  } | null;
};

export async function getPendingReviews(): Promise<PendingVendorReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vendor_reviews")
    .select(`
      id,
      vendor_id,
      reviewer_name,
      reviewer_email,
      rating,
      review_text,
      status,
      created_at,
      vendors (
        business_name,
        slug
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching pending reviews:", error);
    return [];
  }

  return ((data ?? []) as RawReview[]).map((review) => ({
    id: review.id,
    vendor_id: review.vendor_id,
    reviewer_name: review.reviewer_name,
    reviewer_email: review.reviewer_email,
    rating: review.rating,
    review_text: review.review_text,
    status: review.status,
    created_at: review.created_at,
    vendor: review.vendors
      ? {
          business_name: review.vendors.business_name,
          slug: review.vendors.slug,
        }
      : null,
  }));
}
