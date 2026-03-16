import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { registerVendorAccount } from "./actions";

type VendorJoinPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function VendorJoinPage({
  searchParams,
}: VendorJoinPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Join as Vendor
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Create your vendor account
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Create your vendor login with email and password, then complete your
            business application for review.
          </p>

          <form action={registerVendorAccount} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Business email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
                placeholder="hello@yourbusiness.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm_password"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Create Vendor Account
            </button>
          </form>

          {params.error ? (
            <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {params.error}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </main>
  );
}
