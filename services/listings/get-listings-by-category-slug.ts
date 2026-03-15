import { createClient } from "@/lib/supabase/server";

export type CategoryListingItem = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  vendor: {
    id: string;
    business_name: string;
    slug: string;
    phone: string | null;
    whatsapp_number: string | null;
    is_verified: boolean;
    subscription_tier: string;
    location: {
      address_line_1: string;
      city: string;
      region: string | null;
      country: string;
      latitude: number | null;
      longitude: number | null;
    } | null;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type CategoryPageData = {
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  listings: CategoryListingItem[];
};

type ParentCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type SubcategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type VendorRow = {
  id: string;
  business_name: string;
  slug: string;
  phone: string | null;
  whatsapp_number: string | null;
  is_verified: boolean;
  subscription_tier: string;
};

type VendorLocationRow = {
  vendor_id: string;
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
  vendor_id: string;
  category_id: string;
};

export async function getListingsByCategorySlug(
  slug: string
): Promise<CategoryPageData | null> {
  const supabase = await createClient();

  const { data: parentCategory, error: parentError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .is("parent_id", null)
    .single();

  if (parentError || !parentCategory) {
    console.error("Error fetching category:", parentError);
    return null;
  }

  const { data: subcategories, error: subError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("parent_id", parentCategory.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (subError) {
    console.error("Error fetching subcategories:", subError);
    return null;
  }

  const safeSubcategories = (subcategories ?? []) as SubcategoryRow[];
  const subcategoryIds = safeSubcategories.map((subcategory) => subcategory.id);

  if (subcategoryIds.length === 0) {
    return {
      category: parentCategory as ParentCategoryRow,
      subcategories: [],
      listings: [],
    };
  }

  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      description,
      price_optional,
      is_featured,
      vendor_id,
      category_id
    `
    )
    .in("category_id", subcategoryIds)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return null;
  }

  const safeListings = (listings ?? []) as ListingRow[];
  const vendorIds = [...new Set(safeListings.map((listing) => listing.vendor_id))];

  const { data: vendors, error: vendorsError } = await supabase
    .from("vendors")
    .select(
      `
      id,
      business_name,
      slug,
      phone,
      whatsapp_number,
      is_verified,
      subscription_tier
    `
    )
    .in("id", vendorIds);

  if (vendorsError) {
    console.error("Error fetching vendors:", vendorsError);
    return null;
  }

  const { data: vendorLocations, error: vendorLocationsError } = await supabase
    .from("vendor_locations")
    .select(
      `
      vendor_id,
      address_line_1,
      city,
      region,
      country,
      latitude,
      longitude
    `
    )
    .in("vendor_id", vendorIds);

  if (vendorLocationsError) {
    console.error("Error fetching vendor locations:", vendorLocationsError);
    return null;
  }

  const vendorMap = new Map<string, VendorRow>();
  ((vendors ?? []) as VendorRow[]).forEach((vendor) => {
    vendorMap.set(vendor.id, vendor);
  });

  const vendorLocationMap = new Map<string, VendorLocationRow>();
  ((vendorLocations ?? []) as VendorLocationRow[]).forEach((location) => {
    if (!vendorLocationMap.has(location.vendor_id)) {
      vendorLocationMap.set(location.vendor_id, location);
    }
  });

  const subcategoryMap = new Map<string, SubcategoryRow>();
  safeSubcategories.forEach((subcategory) => {
    subcategoryMap.set(subcategory.id, subcategory);
  });

  return {
    category: parentCategory as ParentCategoryRow,
    subcategories: safeSubcategories,
    listings: safeListings.map((listing) => {
      const vendor = vendorMap.get(listing.vendor_id) ?? null;
      const location = vendor ? vendorLocationMap.get(vendor.id) ?? null : null;
      const listingCategory = subcategoryMap.get(listing.category_id) ?? null;

      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price_optional: listing.price_optional,
        is_featured: listing.is_featured,
        vendor: vendor
          ? {
              id: vendor.id,
              business_name: vendor.business_name,
              slug: vendor.slug,
              phone: vendor.phone,
              whatsapp_number: vendor.whatsapp_number,
              is_verified: vendor.is_verified,
              subscription_tier: vendor.subscription_tier,
              location: location
                ? {
                    address_line_1: location.address_line_1,
                    city: location.city,
                    region: location.region,
                    country: location.country,
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }
                : null,
            }
          : null,
        category: listingCategory
          ? {
              id: listingCategory.id,
              name: listingCategory.name,
              slug: listingCategory.slug,
            }
          : null,
      };
    }),
  };
}
