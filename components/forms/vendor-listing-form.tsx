"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createVendorListing,
  type VendorDashboardFormState,
} from "@/app/vendor/dashboard/actions";

type CategoryOption = {
  id: string;
  name: string;
};

type SubcategoryOption = {
  id: string;
  name: string;
  parent_id: string | null;
};

type VendorListingFormProps = {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
};

const initialState: VendorDashboardFormState = {
  success: false,
  message: "",
};

export function VendorListingForm({
  categories,
  subcategories,
}: VendorListingFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [state, formAction, isPending] = useActionState(
    createVendorListing,
    initialState
  );

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter(
      (subcategory) => subcategory.parent_id === selectedCategoryId
    );
  }, [selectedCategoryId, subcategories]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Listing title
        </label>
        <input
          name="title"
          required
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          placeholder="Phone Screen Repair"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          placeholder="Describe the service or product..."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Main category
          </label>
          <select
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          >
            <option value="">Select main category</option>
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
            name="category_id"
            required
            disabled={!selectedCategoryId}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            defaultValue=""
          >
            <option value="">Select subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price (optional)
          </label>
          <input
            name="price_optional"
            type="number"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            placeholder="15000"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="is_featured"
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>Mark as featured</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Listing"}
      </button>

      {state.message ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.success
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
