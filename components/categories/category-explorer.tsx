"use client";

import { useState } from "react";
import type { Category } from "@/types/category";

type CategoryExplorerProps = {
  categories: Category[];
};

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  const [active, setActive] = useState<Category | null>(categories[0] ?? null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-12">
        
        {/* LEFT CATEGORY LIST */}
        <div className="col-span-4 border-r border-slate-200 bg-slate-50">
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onMouseEnter={() => setActive(cat)}
                  onClick={() => setActive(cat)}
                  className={`w-full px-5 py-4 text-left text-sm font-medium transition ${
                    active?.id === cat.id
                      ? "bg-white text-emerald-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SUBCATEGORY AREA */}
        <div className="col-span-8 p-6">
          {active ? (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                {active.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {/* Placeholder groups until we add real subcategories */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">
                    Popular Vendors
                  </h4>
                  <p className="text-sm text-slate-600">Local stores</p>
                  <p className="text-sm text-slate-600">Trusted services</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">
                    Services
                  </h4>
                  <p className="text-sm text-slate-600">Repair</p>
                  <p className="text-sm text-slate-600">Installation</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">
                    Products
                  </h4>
                  <p className="text-sm text-slate-600">Accessories</p>
                  <p className="text-sm text-slate-600">Parts</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Select a category to explore.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}