"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ExplorerCategory } from "@/types/category-explorer";

type CategoryExplorerProps = {
  categories: ExplorerCategory[];
};

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return null;
    return categories.find((category) => category.id === activeCategoryId) ?? null;
  }, [activeCategoryId, categories]);

  const marketplaceRecommendations = useMemo(() => {
    return categories.flatMap((category) => category.recommendedListings).slice(0, 6);
  }, [categories]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid md:grid-cols-12">
        <aside className="border-b border-slate-200 bg-slate-50 md:col-span-4 md:border-b-0 md:border-r">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              All Categories
            </h3>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {categories.map((category) => {
              const isActive = activeCategory?.id === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-emerald-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-base">→</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="md:col-span-8">
          {!activeCategory ? (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Recommended
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Featured marketplace picks
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Explore featured listings from across the marketplace before choosing a category.
                </p>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
                {marketplaceRecommendations.length > 0 ? (
                  marketplaceRecommendations.map((listing) => (
                    <Link
                      key={listing.id}
                      href={listing.vendor ? `/vendors/${listing.vendor.slug}` : "#"}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white text-3xl">
                        📦
                      </div>

                      <h4 className="mt-4 text-sm font-semibold text-slate-900">
                        {listing.title}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        {listing.vendor?.business_name ?? "Vendor"}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-sm text-slate-500">
                    No featured marketplace listings yet.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-slate-200 px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {activeCategory.name}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Recommended in {activeCategory.name}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Explore featured listings and subcategories in {activeCategory.name}.
                </p>
              </div>

              <div className="px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCategory.recommendedListings.length > 0 ? (
                    activeCategory.recommendedListings.map((listing) => (
                      <Link
                        key={listing.id}
                        href={listing.vendor ? `/vendors/${listing.vendor.slug}` : "#"}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white text-3xl">
                          🛍️
                        </div>

                        <h4 className="mt-4 text-sm font-semibold text-slate-900">
                          {listing.title}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {listing.vendor?.business_name ?? "Vendor"}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-slate-500">
                      No recommended listings in this category yet.
                    </p>
                  )}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCategory.subcategories.map((subcategory) => (
                    <div key={subcategory.id}>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {subcategory.name}
                      </h4>

                      <div className="mt-3 space-y-3 text-sm">
                        <Link
                          href={`/categories/${activeCategory.slug}`}
                          className="block text-slate-700 transition hover:text-emerald-600"
                        >
                          Browse {subcategory.name}
                        </Link>
                        <Link
                          href={`/categories/${activeCategory.slug}`}
                          className="block text-slate-700 transition hover:text-emerald-600"
                        >
                          Top vendors in {subcategory.name}
                        </Link>
                        <Link
                          href={`/categories/${activeCategory.slug}`}
                          className="block text-slate-700 transition hover:text-emerald-600"
                        >
                          Explore listings
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
