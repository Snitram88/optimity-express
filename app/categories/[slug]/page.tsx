import { getCategoryBySlug } from "@/services/categories/get-category-by-slug";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            Category
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            {category.name}
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Vendors and products listed under {category.name}.
          </p>
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          Vendor listings will appear here soon.
        </div>
      </section>
    </main>
  );
}
