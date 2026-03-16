"use client";

import { useActionState } from "react";
import {
  addVendorGalleryImage,
  type VendorDashboardFormState,
} from "@/app/vendor/dashboard/actions";

type VendorGalleryFormProps = {
  images: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_featured: boolean;
  }>;
};

const initialState: VendorDashboardFormState = {
  success: false,
  message: "",
};

export function VendorGalleryForm({ images }: VendorGalleryFormProps) {
  const [state, formAction, isPending] = useActionState(
    addVendorGalleryImage,
    initialState
  );

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Image URL
          </label>
          <input
            name="image_url"
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Alt text
          </label>
          <input
            name="alt_text"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            placeholder="Storefront image"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sort order
            </label>
            <input
              name="sort_order"
              type="number"
              defaultValue="0"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Mark as featured image</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? "Adding..." : "Add Gallery Image"}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.length > 0 ? (
          images.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
            >
              <div className="aspect-[4/3] bg-slate-200">
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? "Vendor gallery image"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">
                  {image.alt_text ?? "No alt text"}
                </p>
                <p className="mt-2">Sort order: {image.sort_order}</p>
                <p className="mt-1">
                  {image.is_featured ? "Featured image" : "Standard image"}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600 sm:col-span-2 xl:col-span-3">
            No gallery images added yet.
          </div>
        )}
      </div>
    </div>
  );
}
