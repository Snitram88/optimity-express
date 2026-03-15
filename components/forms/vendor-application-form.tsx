"use client";

import { useActionState, useMemo, useState } from "react";
import { submitVendorApplication, type VendorApplicationState } from "@/app/vendors/apply/actions";
import type {
  ApplicationCategoryOption,
  ApplicationSubcategoryOption,
} from "@/services/categories/get-category-options";

type VendorApplicationFormProps = {
  categories: ApplicationCategoryOption[];
  subcategories: ApplicationSubcategoryOption[];
};

const initialState: VendorApplicationState = {
  success: false,
  message: "",
};

export function VendorApplicationForm({
  categories,
  subcategories,
}: VendorApplicationFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [state, formAction, isPending] = useActionState(
    submitVendorApplication,
    initialState
  );

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter(
      (subcategory) => subcategory.parent_id === selectedCategoryId
    );
  }, [selectedCategoryId, subcategories]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Business details</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business name *
            </label>
            <input
              name="business_name"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="TechFix Lagos"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="Tell customers what your business offers..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              name="phone"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="+234..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              WhatsApp number
            </label>
            <input
              name="whatsapp_number"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="+234..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="hello@yourbusiness.com"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Category selection</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Main category
            </label>
            <select
              name="primary_category_id"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subcategory
            </label>
            <select
              name="primary_subcategory_id"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              disabled={!selectedCategoryId}
            >
              <option value="">Select a subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Storefront & location</h2>
        <p className="mt-2 text-sm text-slate-600">
          Add your exact mapped location so customers can get directions without missing their way.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Storefront / office image URL
            </label>
            <input
              name="storefront_image_url"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Address line 1 *
            </label>
            <input
              name="address_line_1"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="12 Allen Avenue"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              City *
            </label>
            <input
              name="city"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="Lagos"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Region / State
            </label>
            <input
              name="region"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="Lagos"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Country
            </label>
            <input
              name="country"
              defaultValue="Nigeria"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
              For precise directions, open Google Maps, drop a pin on your exact shop location,
              then paste the latitude and longitude below.
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Latitude
            </label>
            <input
              name="latitude"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="6.6018"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Longitude
            </label>
            <input
              name="longitude"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              placeholder="3.3515"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Submit for review
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We’ll review your information before publishing your business.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        {state.message ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
              state.success
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            {state.message}
          </div>
        ) : null}
      </section>
    </form>
  );
}
