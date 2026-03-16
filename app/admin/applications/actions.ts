"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function generateUniqueVendorSlug(baseName: string) {
  const supabase = await createClient();
  const baseSlug = slugify(baseName) || "vendor";
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("vendors")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}

export async function approveVendorApplication(formData: FormData) {
  const supabase = await createClient();

  const applicationId = String(formData.get("application_id") ?? "").trim();

  if (!applicationId) return;

  const { data: application, error: applicationError } = await supabase
    .from("vendor_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (applicationError || !application) {
    console.error("Error fetching application:", applicationError);
    return;
  }

  const emailCheck = application.email
    ? await supabase
        .from("vendors")
        .select("id")
        .ilike("email", application.email)
        .maybeSingle()
    : { data: null };

  const phoneCheck = application.phone
    ? await supabase
        .from("vendors")
        .select("id")
        .eq("phone", application.phone)
        .maybeSingle()
    : { data: null };

  if (emailCheck.data || phoneCheck.data) {
    await supabase
      .from("vendor_applications")
      .update({ status: "needs_update" })
      .eq("id", applicationId);

    revalidatePath("/admin/applications");
    return;
  }

  const slug = await generateUniqueVendorSlug(application.business_name);

  const { data: createdVendor, error: vendorError } = await supabase
    .from("vendors")
    .insert({
      user_id: application.auth_user_id,
      business_name: application.business_name,
      slug,
      description: application.description,
      phone: application.phone,
      whatsapp_number: application.whatsapp_number,
      email: application.email,
      cover_image_url: application.storefront_image_url,
      subscription_tier: "free",
      is_verified: false,
      status: "active",
    })
    .select("id")
    .single();

  if (vendorError || !createdVendor) {
    console.error("Error creating vendor:", vendorError);
    return;
  }

  const { error: locationError } = await supabase
    .from("vendor_locations")
    .insert({
      vendor_id: createdVendor.id,
      address_line_1: application.address_line_1,
      city: application.city,
      region: application.region,
      country: application.country,
      latitude: application.latitude,
      longitude: application.longitude,
    });

  if (locationError) {
    console.error("Error creating vendor location:", locationError);
    return;
  }

  await supabase
    .from("vendor_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  revalidatePath("/admin/applications");
}

export async function rejectVendorApplication(formData: FormData) {
  const supabase = await createClient();
  const applicationId = String(formData.get("application_id") ?? "").trim();

  if (!applicationId) return;

  await supabase
    .from("vendor_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);

  revalidatePath("/admin/applications");
}

export async function markVendorApplicationNeedsUpdate(formData: FormData) {
  const supabase = await createClient();
  const applicationId = String(formData.get("application_id") ?? "").trim();

  if (!applicationId) return;

  await supabase
    .from("vendor_applications")
    .update({ status: "needs_update" })
    .eq("id", applicationId);

  revalidatePath("/admin/applications");
}
