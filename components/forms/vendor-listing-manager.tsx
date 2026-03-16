"use client";

import { useActionState } from "react";
import {
  deleteVendorListing,
  type VendorDashboardFormState,
  updateVendorListing,
} from "@/app/vendor/dashboard/actions";

type VendorListingManagerProps = {
  listings: Array<{
    id: string;
    title: string;
    description: string | null;
    price_optional: number | null;
    is_featured: boolean;
    status: string;
  }>;
};

const initialState: VendorDashboardFormState = {
  success: false,
  message: "",
};

export function VendorListingManager({
  listings,
}: VendorListingManagerProps) {
  return (
    <div className="space-y-5">
      {listings.length > 0 ? (
        listings.map((listing) => (
          <VendorListingEditor key={listing.id} listing={listing} />
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No listings created yet.
        </div>
      )}
    </div>
  );
}

function VendorListingEditor({
  listing,
}: {
  listing: {
    id: string;
    title: string;
    description: string | null;
    price_optional: number | null;
    is_featured: boolean;
    status: string;
  };
}) {
  const [updateState, updateAction, isUpdating] = useActionState(
    updateVendorListing,
    initialState
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteVendorListing,
    initialState
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="listing_id" value={listing.id} />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            name="title"
            defaultValue={listing.title}
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={listing.description ?? ""}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              name="price_optional"
              type="number"
              defaultValue={listing.price_optional ?? ""}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={listing.is_featured}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Featured listing</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {updateState.message ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              updateState.success
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            {updateState.message}
          </div>
        ) : null}
      </form>

      <form action={deleteAction} className="mt-4">
        <input type="hidden" name="listing_id" value={listing.id} />
        <button
          type="submit"
          disabled={isDeleting}
          className="rounded-2xl border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete Listing"}
        </button>

        {deleteState.message ? (
          <div
            className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
              deleteState.success
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            {deleteState.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
