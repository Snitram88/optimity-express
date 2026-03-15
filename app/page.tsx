import Link from "next/link";
import { CategoryExplorer } from "@/components/categories/category-explorer";
import { CategoryCard } from "@/components/cards/category-card";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchBar } from "@/components/ui/search-bar";
import { getCategories } from "@/services/categories/get-categories";
import { getExplorerCategories } from "@/services/categories/get-explorer-categories";

export default async function HomePage() {
  const categories = await getCategories();
  const explorerCategories = await getExplorerCategories();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)]">
        <PageContainer className="py-16 sm:py-20">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Local Marketplace Directory
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find trusted local vendors near you in minutes
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Browse categories, discover nearby businesses, and connect
              instantly through calls, WhatsApp, and directions — without carts
              or checkout.
            </p>

            <div className="mt-8 max-w-3xl">
              <SearchBar />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#category-explorer"
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Browse Categories
              </Link>

              <Link
                href="/vendors/apply"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Join as Vendor
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <div>
                <span className="text-lg font-bold text-slate-900">100+</span>{" "}
                Local Vendors
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">8+</span>{" "}
                Active Categories
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">Fast</span>{" "}
                Call, Chat & Directions
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="category-explorer" className="py-16">
        <PageContainer>
          <div className="mb-6">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Browse
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Browse all categories
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Discover recommended listings and explore deeper subcategories
              inside each main category.
            </p>
          </div>

          {explorerCategories.length > 0 ? (
            <CategoryExplorer categories={explorerCategories} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
              No active categories available for browsing yet.
            </div>
          )}
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Categories
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Explore popular categories
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Start with a category and quickly discover vendors, products,
                and services around you.
              </p>
            </div>

            <Link
              href="/#category-explorer"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              View all categories
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
              No active categories found yet.
            </div>
          )}
        </PageContainer>
      </section>

      <section className="pb-20">
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                📍
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Get Directions Fast
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Help customers find physical stores quickly with one-tap
                directions.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                💬
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Connect Instantly
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Let customers reach vendors through WhatsApp and click-to-call
                actions.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                ✅
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Verified Listings
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Build trust with reviews, premium placement, and vendor
                verification.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
