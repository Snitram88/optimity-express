import { notFound } from "next/navigation";
import { CategoryFilterSidebar } from "@/components/filters/category-filter-sidebar";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { ListingCard } from "@/components/listings/listing-card";
import { getListingsByCategorySlug } from "@/services/listings/get-listings-by-category-slug";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getListingsByCategorySlug(slug);

  if (!data || !data.category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-8 sm:py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Category
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {data.category.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Browse products and services from vendors in {data.category.name}.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder={`Search in ${data.category.name}...`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400"
              />

              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none">
                <option>Sort: Featured</option>
                <option>Sort: Newest</option>
                <option>Sort: Price Low to High</option>
                <option>Sort: Price High to Low</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <CategoryFilterSidebar subcategories={data.subcategories} />
          </div>

          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                {data.listings.length} listing{data.listings.length === 1 ? "" : "s"} found
              </p>
            </div>

            {data.listings.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
                No listings found in this category yet.
              </div>
            )}
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
