"use client";

import { useActionState } from "react";
import {
  submitVendorReview,
  type VendorReviewState,
} from "@/app/vendors/[slug]/actions";

type VendorReviewFormProps = {
  vendorId: string;
};

const initialState: VendorReviewState = {
  success: false,
  message: "",
};

export function VendorReviewForm({ vendorId }: VendorReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitVendorReview,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="vendor_id" value={vendorId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your name
          </label>
          <input
            name="reviewer_name"
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your email
          </label>
          <input
            type="email"
            name="reviewer_email"
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Rating
        </label>
        <select
          name="rating"
          required
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Select a rating
          </option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very Good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Review
        </label>
        <textarea
          name="review_text"
          rows={5}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          placeholder="Tell others about your experience with this vendor..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit Review"}
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

      <p className="text-xs leading-6 text-slate-500">
        Reviews are moderated before they appear publicly.
      </p>
    </form>
  );
}
