"use client";

import { useState } from "react";
import { VendorGalleryForm } from "@/components/forms/vendor-gallery-form";
import { VendorHoursForm } from "@/components/forms/vendor-hours-form";
import { VendorListingForm } from "@/components/forms/vendor-listing-form";
import { VendorListingManager } from "@/components/forms/vendor-listing-manager";
import { VendorProfileForm } from "@/components/forms/vendor-profile-form";

type VendorDashboardSectionsProps = {
  vendor: {
    business_name: string;
    description: string | null;
    phone: string | null;
    whatsapp_number: string | null;
    email: string | null;
    cover_image_url: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
  }>;
  listings: Array<{
    id: string;
    title: string;
    description: string | null;
    price_optional: number | null;
    is_featured: boolean;
    status: string;
  }>;
  galleryImages: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_featured: boolean;
  }>;
  openingHours: Array<{
    id: string;
    day_of_week: number;
    is_closed: boolean;
    open_time: string | null;
    close_time: string | null;
  }>;
  reviews: Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    created_at: string;
  }>;
};

type SectionKey =
  | "profile"
  | "new-listing"
  | "manage-listings"
  | "gallery"
  | "hours"
  | "reviews";

const sectionConfig: Array<{
  key: SectionKey;
  label: string;
  color: string;
}> = [
  {
    key: "profile",
    label: "Profile",
    color: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    key: "new-listing",
    label: "New Listing",
    color: "bg-sky-500 hover:bg-sky-600 text-white",
  },
  {
    key: "manage-listings",
    label: "Manage Listings",
    color: "bg-violet-500 hover:bg-violet-600 text-white",
  },
  {
    key: "gallery",
    label: "Gallery",
    color: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  {
    key: "hours",
    label: "Opening Hours",
    color: "bg-rose-500 hover:bg-rose-600 text-white",
  },
  {
    key: "reviews",
    label: "Reviews",
    color: "bg-slate-700 hover:bg-slate-800 text-white",
  },
];

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function VendorDashboardSections({
  vendor,
  categories,
  subcategories,
  listings,
  galleryImages,
  openingHours,
  reviews,
}: VendorDashboardSectionsProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("profile");

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Dashboard Sections
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Manage your business with one section at a time
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {sectionConfig.map((section) => {
            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition ${section.color} ${
                  isActive ? "ring-4 ring-slate-200" : ""
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeSection === "profile" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Profile
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Edit your business profile
          </h2>

          <div className="mt-6">
            <VendorProfileForm vendor={vendor} />
          </div>
        </section>
      )}

      {activeSection === "new-listing" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            New Listing
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Add a new product or service
          </h2>

          <div className="mt-6">
            <VendorListingForm
              categories={categories}
              subcategories={subcategories}
            />
          </div>
        </section>
      )}

      {activeSection === "manage-listings" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
            Manage Listings
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Edit or delete existing listings
          </h2>

          <div className="mt-6">
            <VendorListingManager listings={listings} />
          </div>
        </section>
      )}

      {activeSection === "gallery" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            Gallery
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Manage your vendor gallery
          </h2>

          <div className="mt-6">
            <VendorGalleryForm images={galleryImages} />
          </div>
        </section>
      )}

      {activeSection === "hours" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
            Opening Hours
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Set your business schedule
          </h2>

          <div className="mt-6">
            <VendorHoursForm hours={openingHours} />
          </div>
        </section>
      )}

      {activeSection === "reviews" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
            Reviews
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Recent customer reviews
          </h2>

          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.reviewer_name}
                      </p>
                      <p className="mt-1 text-amber-500">
                        {renderStars(review.rating)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                      }).format(new Date(review.created_at))}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {review.review_text ?? "No written review provided."}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                No approved reviews yet.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
