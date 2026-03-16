import { createClient } from "@/lib/supabase/server";

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

export async function getVendorMediaAndHours(vendorId: string) {
  const supabase = await createClient();

  const { data: images, error: imagesError } = await supabase
    .from("vendor_images")
    .select("id, image_url, alt_text, sort_order, is_featured")
    .eq("vendor_id", vendorId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (imagesError) {
    console.error("Error fetching vendor gallery images:", imagesError);
  }

  const { data: hours, error: hoursError } = await supabase
    .from("vendor_opening_hours")
    .select("id, day_of_week, is_closed, open_time, close_time")
    .eq("vendor_id", vendorId)
    .order("day_of_week", { ascending: true });

  if (hoursError) {
    console.error("Error fetching vendor opening hours:", hoursError);
  }

  return {
    images: (images ?? []) as VendorGalleryImage[],
    hours: (hours ?? []) as VendorOpeningHour[],
  };
}
