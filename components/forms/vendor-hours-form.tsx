"use client";

import { useActionState } from "react";
import {
  saveVendorOpeningHours,
  type VendorDashboardFormState,
} from "@/app/vendor/dashboard/actions";

type VendorHoursFormProps = {
  hours: Array<{
    id: string;
    day_of_week: number;
    is_closed: boolean;
    open_time: string | null;
    close_time: string | null;
  }>;
};

const initialState: VendorDashboardFormState = {
  success: false,
  message: "",
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function VendorHoursForm({ hours }: VendorHoursFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveVendorOpeningHours,
    initialState
  );

  const hoursMap = new Map(hours.map((item) => [item.day_of_week, item]));

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-4">
        {days.map((dayName, dayIndex) => {
          const row = hoursMap.get(dayIndex);

          return (
            <div
              key={dayIndex}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[160px_1fr_1fr_140px]"
            >
              <div className="flex items-center font-medium text-slate-900">
                {dayName}
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Open
                </label>
                <input
                  type="time"
                  name={`open_time_${dayIndex}`}
                  defaultValue={row?.open_time ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Close
                </label>
                <input
                  type="time"
                  name={`close_time_${dayIndex}`}
                  defaultValue={row?.close_time ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name={`is_closed_${dayIndex}`}
                    defaultChecked={row?.is_closed ?? false}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span>Closed</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Opening Hours"}
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
