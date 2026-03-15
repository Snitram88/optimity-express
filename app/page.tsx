export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            Optimity Express
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Discover trusted local vendors near you
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            A mobile-first business directory marketplace connecting customers
            with nearby physical vendors through calls, WhatsApp, and directions
            — not checkout carts.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Browse Vendors
            </button>
            <button className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Join as a Vendor
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}