import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { VendorListingForm } from "@/components/forms/vendor-listing-form";
import { VendorListingManager } from "@/components/forms/vendor-listing-manager";
import { VendorProfileForm } from "@/components/forms/vendor-profile-form";
import { getCurrentVendorDashboard } from "@/services/vendor-dashboard/get-current-vendor-dashboard";
import { getCategoryOptions } from "@/services/categories/get-category-options";

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function VendorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendors/login?error=Please%20sign%20in%20to%20access%20your%20dashboard");
  }

  const dashboard = await getCurrentVendorDashboard();

  if (!dashboard) {
    redirect("/vendors/login?error=Vendor%20dashboard%20not%20available%20for%20this%20account");
  }

  const { categories, subcategories } = await getCategoryOptions();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-8 sm:py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Vendor Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {dashboard.vendor.business_name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage your profile, catalogue, reviews, and business performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {dashboard.vendor.is_verified && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Verified
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {dashboard.vendor.subscription_tier}
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                {dashboard.vendor.status}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total listings</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {dashboard.metrics.totalListings}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Featured listings</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {dashboard.metrics.featuredListings}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved reviews</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {dashboard.metrics.approvedReviews}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Average rating</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {dashboard.metrics.averageRating ?? "-"}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Profile
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Edit your business profile
              </h2>

              <div className="mt-6">
                <VendorProfileForm vendor={dashboard.vendor} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                New Listing
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Add a new product or service
              </h2>

              <div className="mt-6">
                <VendorListingForm
                  categories={categories}
                  subcategories={subcategories}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Manage Listings
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Edit or delete existing listings
              </h2>

              <div className="mt-6">
                <VendorListingManager listings={dashboard.listings} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Reviews
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Recent customer reviews
              </h2>

              <div className="mt-6 space-y-4">
                {dashboard.reviews.length > 0 ? (
                  dashboard.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {review.reviewer_name}
                          </p>
                          <p className="mt-1 text-amber-500">
                            {renderStars(review.rating)}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat("en-NG", {
                            dateStyle: "medium",
                          }).format(new Date(review.created_at))}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {review.review_text ?? "No written review provided."}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                    No approved reviews yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Status
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                Account overview
              </h2>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Business name</p>
                  <p className="mt-2">{dashboard.vendor.business_name}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="mt-2">{dashboard.vendor.email ?? "N/A"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Slug</p>
                  <p className="mt-2">{dashboard.vendor.slug}</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </PageContainer>
    </main>
  );
}
