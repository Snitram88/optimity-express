import { createClient } from "@/lib/supabase/server";

export type VendorCatalogueItem = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
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
  location: {
    address_line_1: string;
    city: string;
    region: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  catalogue: VendorCatalogueItem[];
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
  vendor_locations: Array<{
    address_line_1: string;
    city: string;
    region: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
  }> | null;
};

type ListingRow = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
};

export async function getVendorBySlug(
  slug: string
): Promise<VendorDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
      status,
      vendor_locations (
        address_line_1,
        city,
        region,
        country,
        latitude,
        longitude
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !data) {
    console.error("Error fetching vendor:", error?.message);
    return null;
  }

  const vendor = data as VendorRow;

  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select("id, title, description, price_optional, is_featured")
    .eq("vendor_id", vendor.id)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (listingsError) {
    console.error("Error fetching vendor listings:", listingsError.message);
  }

  const firstLocation = vendor.vendor_locations?.[0] ?? null;

  return {
    id: vendor.id,
    business_name: vendor.business_name,
    slug: vendor.slug,
    description: vendor.description,
    phone: vendor.phone,
    whatsapp_number: vendor.whatsapp_number,
    email: vendor.email,
    logo_url: vendor.logo_url,
    cover_image_url: vendor.cover_image_url,
    subscription_tier: vendor.subscription_tier,
    is_verified: vendor.is_verified,
    status: vendor.status,
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
    catalogue: ((listings as ListingRow[]) ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price_optional: item.price_optional,
      is_featured: item.is_featured,
    })),
  };
}
