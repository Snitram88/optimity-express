import {
  approveVendorApplication,
  markVendorApplicationNeedsUpdate,
  rejectVendorApplication,
} from "./actions";
import { getPendingApplications } from "@/services/admin/get-pending-applications";

export default async function AdminApplicationsPage() {
  const applications = await getPendingApplications();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Applications
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Pending vendor applications
        </h2>
      </div>

      {applications.length > 0 ? (
        applications.map((application) => (
          <article
            key={application.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-slate-900">
                  {application.business_name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {application.email}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {application.description ?? "No description provided."}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Contact</p>
                    <p className="mt-2">Phone: {application.phone ?? "N/A"}</p>
                    <p>WhatsApp: {application.whatsapp_number ?? "N/A"}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Location</p>
                    <p className="mt-2">{application.address_line_1}</p>
                    <p>
                      {application.city}
                      {application.region ? `, ${application.region}` : ""}
                    </p>
                    <p>{application.country}</p>
                    <p className="mt-2">
                      Lat/Lng:{" "}
                      {application.latitude !== null && application.longitude !== null
                        ? `${application.latitude}, ${application.longitude}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[220px]">
                <form action={approveVendorApplication}>
                  <input type="hidden" name="application_id" value={application.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    Approve
                  </button>
                </form>

                <form action={markVendorApplicationNeedsUpdate}>
                  <input type="hidden" name="application_id" value={application.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                  >
                    Needs Update
                  </button>
                </form>

                <form action={rejectVendorApplication}>
                  <input type="hidden" name="application_id" value={application.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No pending vendor applications.
        </div>
      )}
    </section>
  );
}
