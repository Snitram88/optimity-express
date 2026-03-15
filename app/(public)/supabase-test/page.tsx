import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Supabase Test</h1>

        <pre className="mt-6 rounded-xl bg-slate-900 p-4 text-sm text-white">
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
    </main>
  );
}