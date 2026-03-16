import { approveVendorReview, rejectVendorReview } from "./actions";
import { getPendingReviews } from "@/services/admin/get-pending-reviews";

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function AdminReviewsPage() {
  const reviews = await getPendingReviews();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Reviews
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Pending customer reviews
        </h2>
      </div>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {review.reviewer_name}
                  </h3>
                  <span className="text-amber-500">
                    {renderStars(review.rating)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {review.reviewer_email}
                </p>

                <p className="mt-2 text-sm text-emerald-600">
                  Vendor: {review.vendor?.business_name ?? "Unknown vendor"}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {review.review_text ?? "No written review provided."}
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[220px]">
                <form action={approveVendorReview}>
                  <input type="hidden" name="review_id" value={review.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    Approve
                  </button>
                </form>

                <form action={rejectVendorReview}>
                  <input type="hidden" name="review_id" value={review.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No pending reviews.
        </div>
      )}
    </section>
  );
}
