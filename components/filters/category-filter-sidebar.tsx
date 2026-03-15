type FilterSubcategory = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterSidebarProps = {
  subcategories: FilterSubcategory[];
};

export function CategoryFilterSidebar({
  subcategories,
}: CategoryFilterSidebarProps) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <p className="mt-1 text-sm text-slate-500">
          Narrow down your search
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Subcategories
        </h3>

        <div className="mt-4 space-y-3">
          {subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <label
                key={subcategory.id}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>{subcategory.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-500">No subcategories yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Vendor Type
        </h3>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <span>Verified vendors</span>
          </label>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <span>Premium vendors</span>
          </label>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Availability
        </h3>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            <span>Open now</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
