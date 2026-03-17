import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VendorDashboardSections } from "@/components/dashboard/vendor-dashboard-sections";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentVendorDashboard } from "@/services/vendor-dashboard/get-current-vendor-dashboard";
import { getCategoryOptions } from "@/services/categories/get-category-options";

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
                Manage your profile, listings, gallery, hours, reviews, and business performance with a cleaner workspace.
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

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
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

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Gallery images</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {dashboard.metrics.galleryImages}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VendorDashboardSections
              vendor={dashboard.vendor}
              categories={categories}
              subcategories={subcategories}
              listings={dashboard.listings}
              galleryImages={dashboard.galleryImages}
              openingHours={dashboard.openingHours}
              reviews={dashboard.reviews}
            />
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Account Overview
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                Quick business summary
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
