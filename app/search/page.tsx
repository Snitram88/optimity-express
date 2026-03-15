import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { searchMarketplace } from "@/services/search/search-marketplace";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const results = await searchMarketplace(query);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-10 sm:py-14">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Search
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Results for “{query || "all"}”
          </h1>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Vendors</h2>

            <div className="mt-6 space-y-4">
              {results.vendors.length > 0 ? (
                results.vendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    href={`/vendors/${vendor.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {vendor.business_name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {vendor.description ?? "No description available."}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">No vendors found.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Listings</h2>

            <div className="mt-6 space-y-4">
              {results.listings.length > 0 ? (
                results.listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={listing.vendor ? `/vendors/${listing.vendor.slug}` : "#"}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {listing.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {listing.description ?? "No description available."}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-emerald-600">
                      {listing.vendor?.business_name ?? "Vendor"}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">No listings found.</p>
              )}
            </div>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
