import { createClient } from "@/lib/supabase/server";

export type VendorCatalogueItem = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
};

export type VendorReviewItem = {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  is_verified_interaction: boolean;
};

export type VendorGalleryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_featured: boolean;
};

export type VendorOpeningHour = {
  id: string;
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
};

export type VendorDetails = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  subscription_tier: string;
  is_verified: boolean;
  status: string;
  average_rating: number | null;
  review_count: number;
  location: {
    address_line_1: string;
    city: string;
    region: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  catalogue: VendorCatalogueItem[];
  reviews: VendorReviewItem[];
  galleryImages: VendorGalleryImage[];
  openingHours: VendorOpeningHour[];
};

type VendorRow = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  subscription_tier: string;
  is_verified: boolean;
  status: string;
};

type VendorLocationRow = {
  address_line_1: string;
  city: string;
  region: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

type ListingRow = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
};

type ReviewRow = {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  is_verified_interaction: boolean;
};

type GalleryRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_featured: boolean;
};

type HoursRow = {
  id: string;
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
};

export async function getVendorBySlug(
  slug: string
): Promise<VendorDetails | null> {
  const supabase = await createClient();

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select(
      `
      id,
      business_name,
      slug,
      description,
      phone,
      whatsapp_number,
      email,
      logo_url,
      cover_image_url,
      subscription_tier,
      is_verified,
      status
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (vendorError || !vendor) {
    console.error("Error fetching vendor:", vendorError);
    return null;
  }

  const { data: locations, error: locationError } = await supabase
    .from("vendor_locations")
    .select(
      `
      address_line_1,
      city,
      region,
      country,
      latitude,
      longitude
    `
    )
    .eq("vendor_id", vendor.id)
    .limit(1);

  if (locationError) {
    console.error("Error fetching vendor location:", locationError);
  }

  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select("id, title, description, price_optional, is_featured")
    .eq("vendor_id", vendor.id)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (listingsError) {
    console.error("Error fetching vendor listings:", listingsError);
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("vendor_reviews")
    .select(
      `
      id,
      reviewer_name,
      rating,
      review_text,
      created_at,
      is_verified_interaction
    `
    )
    .eq("vendor_id", vendor.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Error fetching vendor reviews:", reviewsError);
  }

  const { data: galleryImages, error: galleryError } = await supabase
    .from("vendor_images")
    .select("id, image_url, alt_text, sort_order, is_featured")
    .eq("vendor_id", vendor.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (galleryError) {
    console.error("Error fetching vendor gallery images:", galleryError);
  }

  const { data: openingHours, error: hoursError } = await supabase
    .from("vendor_opening_hours")
    .select("id, day_of_week, is_closed, open_time, close_time")
    .eq("vendor_id", vendor.id)
    .order("day_of_week", { ascending: true });

  if (hoursError) {
    console.error("Error fetching vendor opening hours:", hoursError);
  }

  const safeReviews = (reviews ?? []) as ReviewRow[];
  const reviewCount = safeReviews.length;
  const averageRating =
    reviewCount > 0
      ? Number(
          (
            safeReviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          ).toFixed(1)
        )
      : null;

  const firstLocation = ((locations ?? []) as VendorLocationRow[])[0] ?? null;
  const safeVendor = vendor as VendorRow;

  return {
    id: safeVendor.id,
    business_name: safeVendor.business_name,
    slug: safeVendor.slug,
    description: safeVendor.description,
    phone: safeVendor.phone,
    whatsapp_number: safeVendor.whatsapp_number,
    email: safeVendor.email,
    logo_url: safeVendor.logo_url,
    cover_image_url: safeVendor.cover_image_url,
    subscription_tier: safeVendor.subscription_tier,
    is_verified: safeVendor.is_verified,
    status: safeVendor.status,
    average_rating: averageRating,
    review_count: reviewCount,
    location: firstLocation
      ? {
          address_line_1: firstLocation.address_line_1,
          city: firstLocation.city,
          region: firstLocation.region,
          country: firstLocation.country,
          latitude: firstLocation.latitude,
          longitude: firstLocation.longitude,
        }
      : null,
    catalogue: ((listings ?? []) as ListingRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price_optional: item.price_optional,
      is_featured: item.is_featured,
    })),
    reviews: safeReviews.map((review) => ({
      id: review.id,
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      review_text: review.review_text,
      created_at: review.created_at,
      is_verified_interaction: review.is_verified_interaction,
    })),
    galleryImages: (galleryImages ?? []) as GalleryRow[],
    openingHours: (openingHours ?? []) as HoursRow[],
  };
}
