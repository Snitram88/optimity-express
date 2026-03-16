"use server";

import { createClient } from "@/lib/supabase/server";

export type VendorApplicationState = {
  success: boolean;
  message: string;
};

export async function submitVendorApplication(
  _prevState: VendorApplicationState,
  formData: FormData
): Promise<VendorApplicationState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must open this form from your secure vendor link.",
    };
  }

  const business_name = String(formData.get("business_name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp_number = String(formData.get("whatsapp_number") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const storefront_image_url = String(formData.get("storefront_image_url") ?? "").trim();
  const address_line_1 = String(formData.get("address_line_1") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const country = String(formData.get("country") ?? "Nigeria").trim();
  const latitudeValue = String(formData.get("latitude") ?? "").trim();
  const longitudeValue = String(formData.get("longitude") ?? "").trim();
  const primary_category_id = String(formData.get("primary_category_id") ?? "").trim();
  const primary_subcategory_id = String(formData.get("primary_subcategory_id") ?? "").trim();

  if (!business_name || !email || !address_line_1 || !city) {
    return {
      success: false,
      message: "Please complete all required business and address fields.",
    };
  }

  const latitude =
    latitudeValue.length > 0 && !Number.isNaN(Number(latitudeValue))
      ? Number(latitudeValue)
      : null;

  const longitude =
    longitudeValue.length > 0 && !Number.isNaN(Number(longitudeValue))
      ? Number(longitudeValue)
      : null;

  const { error } = await supabase.from("vendor_applications").insert({
    auth_user_id: user.id,
    business_name,
    description: description || null,
    phone: phone || null,
    whatsapp_number: whatsapp_number || null,
    email,
    storefront_image_url: storefront_image_url || null,
    address_line_1,
    city,
    region: region || null,
    country: country || "Nigeria",
    latitude,
    longitude,
    primary_category_id: primary_category_id || null,
    primary_subcategory_id: primary_subcategory_id || null,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting vendor application:", error);
    return {
      success: false,
      message: "We could not submit your application right now. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "Application submitted successfully. We’ll review your business details before publishing.",
  };
}
