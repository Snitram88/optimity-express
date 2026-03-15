import { CategoryCard } from "@/components/cards/category-card";
import { getCategories } from "@/services/categories/get-categories";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-16">
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

        <section className="mt-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Popular Categories
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore active top-level categories from the marketplace.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              No active categories found yet.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
