import { createClient } from "@/lib/supabase/server";

export type ApplicationCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type ApplicationSubcategoryOption = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

export async function getCategoryOptions() {
  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching parent categories:", categoriesError);
    return { categories: [], subcategories: [] };
  }

  const parentIds = (categories ?? []).map((item) => item.id);

  const { data: subcategories, error: subcategoriesError } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .in("parent_id", parentIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (subcategoriesError) {
    console.error("Error fetching subcategories:", subcategoriesError);
    return {
      categories: categories ?? [],
      subcategories: [],
    };
  }

  return {
    categories: (categories ?? []) as ApplicationCategoryOption[],
    subcategories: (subcategories ?? []) as ApplicationSubcategoryOption[],
  };
}
