import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Supabase Test</h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            This page checks whether the Supabase server client is configured.
          </p>

          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-white">
            {JSON.stringify(
              {
                hasSession: !!data.session,
                error: error?.message ?? null,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </main>
  );
}