import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/category";

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error.message);
    return null;
  }

  return data as Category;
}
