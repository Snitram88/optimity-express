import { createClient } from "@/lib/supabase/server";
import type {
  ExplorerCategory,
  ExplorerListing,
  ExplorerSubcategory,
} from "@/types/category-explorer";

type RawCategory = {
  id: string;
  name: string;
  slug: string;
};

type RawSubcategory = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

type RawListing = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  vendor_id: string;
  category_id: string;
  vendors: {
    business_name: string;
    slug: string;
  } | null;
};

export async function getExplorerCategories(): Promise<ExplorerCategory[]> {
  const supabase = await createClient();

  const { data: parentCategories, error: parentError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (parentError || !parentCategories) {
    console.error("Error fetching parent categories:", parentError?.message);
    return [];
  }

  const parentIds = parentCategories.map((category) => category.id);

  const { data: subcategories, error: subError } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .in("parent_id", parentIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (subError) {
    console.error("Error fetching subcategories:", subError.message);
    return [];
  }

  const subcategoryIds = (subcategories ?? []).map((subcategory) => subcategory.id);

  const { data: listings, error: listingError } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      description,
      price_optional,
      is_featured,
      vendor_id,
      category_id,
      vendors (
        business_name,
        slug
      )
    `
    )
    .in("category_id", subcategoryIds)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .limit(100);

  if (listingError) {
    console.error("Error fetching listings:", listingError.message);
    return [];
  }

  return (parentCategories as RawCategory[]).map((parent) => {
    const childSubcategories = ((subcategories as RawSubcategory[]) ?? []).filter(
      (subcategory) => subcategory.parent_id === parent.id
    );

    const childSubcategoryIds = childSubcategories.map((subcategory) => subcategory.id);

    const recommendedListings = ((listings as RawListing[]) ?? [])
      .filter((listing) => childSubcategoryIds.includes(listing.category_id))
      .slice(0, 6)
      .map(
        (listing): ExplorerListing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price_optional: listing.price_optional,
          is_featured: listing.is_featured,
          vendor: listing.vendors
            ? {
                business_name: listing.vendors.business_name,
                slug: listing.vendors.slug,
              }
            : null,
        })
      );

    return {
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      subcategories: childSubcategories.map(
        (subcategory): ExplorerSubcategory => ({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
        })
      ),
      recommendedListings,
    };
  });
}
