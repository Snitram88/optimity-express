import Link from "next/link";
import type { CategoryListingItem } from "@/services/listings/get-listings-by-category-slug";

type ListingCardProps = {
  listing: CategoryListingItem;
};

function formatPrice(price: number | null) {
  if (price === null) return "Price on request";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-50 text-4xl">
        {listing.is_featured ? "⭐" : "🛍️"}
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            {listing.title}
          </h3>

          {listing.is_featured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
              Featured
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {listing.vendor?.business_name ?? "Vendor"}
        </p>

        {listing.category && (
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-600">
            {listing.category.name}
          </p>
        )}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {listing.description ?? "No description available yet."}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-emerald-700">
            {formatPrice(listing.price_optional)}
          </p>

          <Link
            href={listing.vendor ? `/vendors/${listing.vendor.slug}` : "#"}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          >
            View Vendor
          </Link>
        </div>
      </div>
    </article>
  );
}
