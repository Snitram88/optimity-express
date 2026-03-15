"use client";

import type { CategoryListingItem } from "@/services/listings/get-listings-by-category-slug";

type VendorQuickViewModalProps = {
  listing: CategoryListingItem | null;
  onClose: () => void;
};

function formatPrice(price: number | null) {
  if (price === null) return "Price on request";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildWhatsAppLink(phone: string | null, vendorName: string) {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const message = encodeURIComponent(
    `Hello ${vendorName}, I found your business on Optimity Express and I would like to make an enquiry.`
  );
  return `https://wa.me/${cleanPhone.replace("+", "")}?text=${message}`;
}

function buildGoogleMapsLink(
  addressLine1: string,
  city: string,
  region: string | null,
  country: string
) {
  const query = encodeURIComponent(
    [addressLine1, city, region, country].filter(Boolean).join(", ")
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function VendorQuickViewModal({
  listing,
  onClose,
}: VendorQuickViewModalProps) {
  if (!listing) return null;

  const vendor = listing.vendor;
  const location = vendor?.location ?? null;

  const directionsLink = location
    ? buildGoogleMapsLink(
        location.address_line_1,
        location.city,
        location.region,
        location.country
      )
    : "#";

  const whatsappLink = buildWhatsAppLink(
    vendor?.whatsapp_number ?? vendor?.phone ?? null,
    vendor?.business_name ?? "Vendor"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Quick View
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {listing.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {vendor?.business_name ?? "Vendor"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="grid gap-8 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <section>
            <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-slate-50 text-5xl">
              {listing.is_featured ? "⭐" : "🛍️"}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                {vendor?.is_verified && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Verified
                  </span>
                )}

                {vendor?.subscription_tier === "premium" && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Premium
                  </span>
                )}

                {listing.category && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {listing.category.name}
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {listing.description ?? "No description available yet."}
              </p>

              <p className="mt-5 text-lg font-semibold text-emerald-700">
                {formatPrice(listing.price_optional)}
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={directionsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Get Directions
                </a>

                <a
                  href={vendor?.phone ? `tel:${vendor.phone}` : "#"}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Call Vendor
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  WhatsApp
                </a>

                <a
                  href={vendor ? `/vendors/${vendor.slug}` : "#"}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  View Full Shop
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Vendor details
              </h3>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Business
                  </p>
                  <p className="mt-2 text-slate-900">
                    {vendor?.business_name ?? "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Location
                  </p>
                  {location ? (
                    <div className="mt-2 text-slate-900">
                      <p>{location.address_line_1}</p>
                      <p>
                        {location.city}
                        {location.region ? `, ${location.region}` : ""}
                      </p>
                      <p>{location.country}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-slate-900">Not available</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
