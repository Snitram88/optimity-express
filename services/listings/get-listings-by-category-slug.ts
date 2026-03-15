import { createClient } from "@/lib/supabase/server";

export type CategoryListingItem = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  vendor: {
    business_name: string;
    slug: string;
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

type ListingRow = {
  id: string;
  title: string;
  description: string | null;
  price_optional: number | null;
  is_featured: boolean;
  vendors: {
    business_name: string;
    slug: string;
  } | null;
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
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

  const subcategoryIds = ((subcategories ?? []) as SubcategoryRow[]).map(
    (subcategory) => subcategory.id
  );

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
      vendors (
        business_name,
        slug
      ),
      categories (
        id,
        name,
        slug
      )
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

  return {
    category: parentCategory as ParentCategoryRow,
    subcategories: (subcategories ?? []) as SubcategoryRow[],
    listings: ((listings ?? []) as ListingRow[]).map((listing) => ({
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
      category: listing.categories
        ? {
            id: listing.categories.id,
            name: listing.categories.name,
            slug: listing.categories.slug,
          }
        : null,
    })),
  };
}
