import Link from "next/link";
import type { Category } from "@/types/category";

type CategoryCardProps = {
  category: Category;
};

const categoryGradients = [
  "from-emerald-100 via-teal-50 to-white",
  "from-sky-100 via-cyan-50 to-white",
  "from-violet-100 via-fuchsia-50 to-white",
  "from-amber-100 via-yellow-50 to-white",
  "from-rose-100 via-pink-50 to-white",
  "from-indigo-100 via-blue-50 to-white",
];

export function CategoryCard({ category }: CategoryCardProps) {
  const gradient =
    categoryGradients[category.sort_order % categoryGradients.length];

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <article
        className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${gradient} p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-lg font-bold text-slate-700 shadow-sm">
            {category.name.charAt(0)}
          </div>

          <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
            Explore
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">
            {category.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Browse trusted vendors and discover products and services in{" "}
            {category.name}.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <span>View category</span>
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </article>
    </Link>
  );
}