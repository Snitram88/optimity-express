import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Link
        href="/admin/applications"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Vendor Applications
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Review vendor submissions
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Approve, reject, or request updates for pending vendor applications.
        </p>
      </Link>

      <Link
        href="/admin/reviews"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Reviews
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Moderate customer reviews
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Approve or reject pending vendor reviews before they appear publicly.
        </p>
      </Link>
    </section>
  );
}
