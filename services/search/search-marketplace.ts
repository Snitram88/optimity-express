import { createClient } from "@/lib/supabase/server";

export type SearchResultVendor = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
};

export type SearchResultListing = {
  id: string;
  title: string;
  description: string | null;
  vendor: {
    business_name: string;
    slug: string;
  } | null;
};

export async function searchMarketplace(query: string) {
  const supabase = await createClient();
  const safeQuery = query.trim();

  if (!safeQuery) {
    return {
      vendors: [] as SearchResultVendor[],
      listings: [] as SearchResultListing[],
    };
  }

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, business_name, slug, description")
    .eq("status", "active")
    .or(`business_name.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`)
    .limit(12);

  const { data: listings } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      description,
      vendors (
        business_name,
        slug
      )
    `
    )
    .eq("status", "active")
    .or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`)
    .limit(12);

  return {
    vendors: (vendors ?? []) as SearchResultVendor[],
    listings: ((listings ?? []) as Array<{
      id: string;
      title: string;
      description: string | null;
      vendors: {
        business_name: string;
        slug: string;
      } | null;
    }>).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      vendor: item.vendors
        ? {
            business_name: item.vendors.business_name,
            slug: item.vendors.slug,
          }
        : null,
    })),
  };
}
