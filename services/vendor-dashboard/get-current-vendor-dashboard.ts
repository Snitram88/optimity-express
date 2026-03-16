import { createClient } from "@/lib/supabase/server";

export type DashboardListing = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  status: string;
  created_at: string;
};

export type DashboardReview = {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};

export type VendorDashboardData = {
  vendor: {
    id: string;
    business_name: string;
    slug: string;
    description: string | null;
    phone: string | null;
    whatsapp_number: string | null;
    email: string | null;
    cover_image_url: string | null;
    subscription_tier: string;
    is_verified: boolean;
    status: string;
  };
  listings: DashboardListing[];
  reviews: DashboardReview[];
  metrics: {
    totalListings: number;
    featuredListings: number;
    approvedReviews: number;
    averageRating: number | null;
  };
};

export async function getCurrentVendorDashboard(): Promise<VendorDashboardData | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select(`
      id,
      business_name,
      slug,
      description,
      phone,
      whatsapp_number,
      email,
      cover_image_url,
      subscription_tier,
      is_verified,
      status
    `)
    .eq("user_id", user.id)
    .single();

  if (vendorError || !vendor) {
    console.error("Error fetching vendor dashboard vendor:", vendorError);
    return null;
  }

  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      description,
      price_optional,
      is_featured,
      status,
      created_at
    `)
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (listingsError) {
    console.error("Error fetching vendor dashboard listings:", listingsError);
    return null;
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("vendor_reviews")
    .select(`
      id,
      reviewer_name,
      rating,
      review_text,
      created_at
    `)
    .eq("vendor_id", vendor.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Error fetching vendor dashboard reviews:", reviewsError);
    return null;
  }

  const safeListings = (listings ?? []) as DashboardListing[];
  const safeReviews = (reviews ?? []) as DashboardReview[];

  const averageRating =
    safeReviews.length > 0
      ? Number(
          (
            safeReviews.reduce((sum, review) => sum + review.rating, 0) /
            safeReviews.length
          ).toFixed(1)
        )
      : null;

  return {
    vendor: vendor as VendorDashboardData["vendor"],
    listings: safeListings,
    reviews: safeReviews,
    metrics: {
      totalListings: safeListings.length,
      featuredListings: safeListings.filter((item) => item.is_featured).length,
      approvedReviews: safeReviews.length,
      averageRating,
    },
  };
}
