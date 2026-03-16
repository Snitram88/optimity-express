import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/layout/page-container";
import { SearchBar } from "@/components/ui/search-bar";
import { logoutUser } from "@/app/auth/logout/actions";

export async function SiteHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <PageContainer>
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white shadow-sm">
                OE
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  Optimity Express
                </p>
                <p className="text-xs text-slate-500">
                  Discover trusted local vendors
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/#category-explorer"
              className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
            >
              Browse
            </Link>

            {!user ? (
              <>
                <Link
                  href="/vendors/login"
                  className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:inline-flex"
                >
                  Vendor Login
                </Link>

                <Link
                  href="/vendors/join"
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  Join as Vendor
                </Link>
              </>
            ) : (
              <>
                <span className="hidden text-sm text-slate-500 md:inline">
                  {user.email}
                </span>

                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="pb-3 lg:hidden">
          <SearchBar />
        </div>
      </PageContainer>
    </header>
  );
}
