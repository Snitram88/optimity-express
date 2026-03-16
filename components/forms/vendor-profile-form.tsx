"use client";

import { useActionState } from "react";
import {
  updateVendorProfile,
  type VendorDashboardFormState,
} from "@/app/vendor/dashboard/actions";

type VendorProfileFormProps = {
  vendor: {
    business_name: string;
    description: string | null;
    phone: string | null;
    whatsapp_number: string | null;
    email: string | null;
    cover_image_url: string | null;
  };
};

const initialState: VendorDashboardFormState = {
  success: false,
  message: "",
};

export function VendorProfileForm({ vendor }: VendorProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateVendorProfile,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Business name
          </label>
          <input
            name="business_name"
            defaultValue={vendor.business_name}
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={vendor.description ?? ""}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={vendor.phone ?? ""}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            WhatsApp
          </label>
          <input
            name="whatsapp_number"
            defaultValue={vendor.whatsapp_number ?? ""}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={vendor.email ?? ""}
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cover image URL
          </label>
          <input
            name="cover_image_url"
            defaultValue={vendor.cover_image_url ?? ""}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Profile"}
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
