import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { VendorApplicationForm } from "@/components/forms/vendor-application-form";
import { getCategoryOptions } from "@/services/categories/get-category-options";

export default async function VendorApplyPage() {
  const { categories, subcategories } = await getCategoryOptions();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-10 sm:py-14">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Join as Vendor
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Apply to list your business on Optimity Express
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Submit your business details, mapped location, and category information so customers
            can discover your shop, view your catalogue, and get directions accurately.
          </p>
        </section>

        <div className="mt-8">
          <VendorApplicationForm
            categories={categories}
            subcategories={subcategories}
          />
        </div>
      </PageContainer>
    </main>
  );
}
