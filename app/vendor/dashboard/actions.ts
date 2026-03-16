"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type VendorDashboardFormState = {
  success: boolean;
  message: string;
};

export async function updateVendorProfile(
  _prevState: VendorDashboardFormState,
  formData: FormData
): Promise<VendorDashboardFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to update your profile.",
    };
  }

  const business_name = String(formData.get("business_name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp_number = String(formData.get("whatsapp_number") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const cover_image_url = String(formData.get("cover_image_url") ?? "").trim();

  if (!business_name || !email) {
    return {
      success: false,
      message: "Business name and email are required.",
    };
  }

  const { error } = await supabase
    .from("vendors")
    .update({
      business_name,
      description: description || null,
      phone: phone || null,
      whatsapp_number: whatsapp_number || null,
      email,
      cover_image_url: cover_image_url || null,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating vendor profile:", error);
    return {
      success: false,
      message: "Could not update your profile right now.",
    };
  }

  revalidatePath("/vendor/dashboard");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

export async function createVendorListing(
  _prevState: VendorDashboardFormState,
  formData: FormData
): Promise<VendorDashboardFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to create a listing.",
    };
  }

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (vendorError || !vendor) {
    return {
      success: false,
      message: "Vendor account not found.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceValue = String(formData.get("price_optional") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "").trim();
  const is_featured = String(formData.get("is_featured") ?? "") === "on";

  if (!title || !category_id) {
    return {
      success: false,
      message: "Listing title and subcategory are required.",
    };
  }

  const price_optional =
    priceValue.length > 0 && !Number.isNaN(Number(priceValue))
      ? Number(priceValue)
      : null;

  const { error } = await supabase.from("listings").insert({
    vendor_id: vendor.id,
    category_id,
    title,
    description: description || null,
    price_optional,
    status: "active",
    is_featured,
  });

  if (error) {
    console.error("Error creating vendor listing:", error);
    return {
      success: false,
      message: "Could not create listing right now.",
    };
  }

  revalidatePath("/vendor/dashboard");

  return {
    success: true,
    message: "Listing created successfully.",
  };
}
