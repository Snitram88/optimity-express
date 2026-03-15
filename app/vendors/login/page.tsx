import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { sendVendorMagicLink } from "./actions";

type VendorLoginPageProps = {
  searchParams: Promise<{
    sent?: string;
    error?: string;
  }>;
};

export default async function VendorLoginPage({
  searchParams,
}: VendorLoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-16 sm:py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Vendor Login
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to manage your business
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Enter your email and we’ll send you a magic link to access your vendor account.
          </p>

          <form action={sendVendorMagicLink} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
                placeholder="hello@yourbusiness.com"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Send Magic Link
            </button>
          </form>

          {params.sent ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Magic link sent. Check your email.
            </div>
          ) : null}

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
