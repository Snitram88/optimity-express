import { notFound } from "next/navigation";
import { VendorReviewForm } from "@/components/forms/vendor-review-form";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { getVendorBySlug } from "@/services/vendors/get-vendor-by-slug";

type VendorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

function formatPrice(price: number | null) {
  if (price === null) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatReviewDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const whatsappLink = buildWhatsAppLink(
    vendor.whatsapp_number,
    vendor.business_name
  );

  const directionsLink = vendor.location
    ? buildGoogleMapsLink(
        vendor.location.address_line_1,
        vendor.location.city,
        vendor.location.region,
        vendor.location.country
      )
    : "#";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <PageContainer className="py-8 sm:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 w-full bg-slate-200 sm:h-80 lg:h-96">
            {vendor.cover_image_url ? (
              <img
                src={vendor.cover_image_url}
                alt={vendor.business_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl text-slate-400">
                🏪
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {vendor.is_verified && (
                      <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
                        Verified
                      </span>
                    )}

                    {vendor.subscription_tier === "premium" && (
                      <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold text-slate-950">
                        Premium
                      </span>
                    )}

                    {vendor.average_rating !== null && (
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                        {vendor.average_rating} / 5 • {vendor.review_count} review
                        {vendor.review_count === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {vendor.business_name}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
                    {vendor.description ?? "No business description available yet."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={directionsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                  >
                    Get Directions
                  </a>

                  <a
                    href={vendor.phone ? `tel:${vendor.phone}` : "#"}
                    className="rounded-2xl bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                  >
                    Call Vendor
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Catalogue
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Products & Services
                  </h2>
                </div>
              </div>

              {vendor.catalogue.length > 0 ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {vendor.catalogue.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white text-4xl">
                        {item.is_featured ? "⭐" : "🛍️"}
                      </div>

                      <div className="mt-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.title}
                          </h3>

                          {item.is_featured && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {item.description ?? "No description available yet."}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-emerald-700">
                            {formatPrice(item.price_optional)}
                          </p>

                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                          >
                            Enquire
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No catalogue items available yet.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Reviews
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Customer feedback
              </h2>

              {vendor.average_rating !== null ? (
                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-3xl font-bold text-slate-900">
                      {vendor.average_rating}
                    </p>
                    <div>
                      <p className="text-amber-500">
                        {renderStars(Math.round(vendor.average_rating))}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Based on {vendor.review_count} approved review
                        {vendor.review_count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-600">
                  No approved reviews yet.
                </p>
              )}

              <div className="mt-8 space-y-5">
                {vendor.reviews.length > 0 ? (
                  vendor.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {review.reviewer_name}
                          </p>
                          <p className="mt-1 text-sm text-amber-500">
                            {renderStars(review.rating)}
                          </p>
                        </div>

                        <div className="text-right text-xs text-slate-500">
                          <p>{formatReviewDate(review.created_at)}</p>
                          {review.is_verified_interaction ? (
                            <p className="mt-1 text-emerald-600">
                              Verified interaction
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {review.review_text ?? "No written review provided."}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                    No customer reviews have been published yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Leave a review
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Share your experience
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Leave a rating and short review for this vendor. Reviews are moderated before they appear publicly.
              </p>

              <div className="mt-6">
                <VendorReviewForm vendorId={vendor.id} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                About
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                About this business
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {vendor.description ?? "No business description available yet."}
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h2>

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
                  href={vendor.phone ? `tel:${vendor.phone}` : "#"}
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
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Contact details
              </h2>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Phone
                  </p>
                  <p className="mt-2 text-slate-900">
                    {vendor.phone ?? "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 text-slate-900">
                    {vendor.email ?? "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Location
              </h2>

              {vendor.location ? (
                <div className="mt-4 text-sm leading-7 text-slate-600">
                  <p>{vendor.location.address_line_1}</p>
                  <p>
                    {vendor.location.city}
                    {vendor.location.region ? `, ${vendor.location.region}` : ""}
                  </p>
                  <p>{vendor.location.country}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No location available yet.
                </p>
              )}
            </div>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}
