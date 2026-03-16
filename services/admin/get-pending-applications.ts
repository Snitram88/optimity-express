import { createClient } from "@/lib/supabase/server";

export type PendingVendorApplication = {
  id: string;
  auth_user_id: string | null;
  business_name: string;
  description: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string;
  storefront_image_url: string | null;
  address_line_1: string;
  city: string;
  region: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  primary_category_id: string | null;
  primary_subcategory_id: string | null;
  status: string;
  created_at: string;
};

export async function getPendingApplications(): Promise<PendingVendorApplication[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vendor_applications")
    .select(`
      id,
      auth_user_id,
      business_name,
      description,
      phone,
      whatsapp_number,
      email,
      storefront_image_url,
      address_line_1,
      city,
      region,
      country,
      latitude,
      longitude,
      primary_category_id,
      primary_subcategory_id,
      status,
      created_at
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching pending applications:", error);
    return [];
  }

  return (data ?? []) as PendingVendorApplication[];
}
