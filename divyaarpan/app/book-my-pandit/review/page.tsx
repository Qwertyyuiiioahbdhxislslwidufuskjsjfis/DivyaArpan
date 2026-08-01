"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Languages,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  HeartHandshake,
} from "lucide-react";

export default function PanditBookingReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const service = searchParams.get("service") || "Pooja";
const city = searchParams.get("city") || "";
const language = searchParams.get("language") || "";
const date = searchParams.get("date") || "";
const time = searchParams.get("time") || "";
const sankalp = searchParams.get("sankalp") || "";

const devoteeName = searchParams.get("devoteeName") || "";
const mobile = searchParams.get("mobile") || "";
const alternateMobile =
  searchParams.get("alternateMobile") || "";
const whatsAppNumber =
  searchParams.get("whatsAppNumber") || "";
const email = searchParams.get("email") || "";

const houseNo = searchParams.get("houseNo") || "";
const buildingName =
  searchParams.get("buildingName") || "";
const area = searchParams.get("area") || "";
const landmark = searchParams.get("landmark") || "";
const pinCode = searchParams.get("pinCode") || "";
const address = searchParams.get("address") || "";

const panditPreference =
  searchParams.get("panditPreference") ||
  "Any Verified Pandit";

const samagriRequired =
  searchParams.get("samagriRequired") === "true";

const purpose = searchParams.get("purpose") || "";

const additionalRequirements =
  searchParams.get("additionalRequirements") || "";

  const bookingParams = new URLSearchParams({
  service,
  city,
  language,
  date,
  time,
  sankalp,

  devoteeName,
  mobile,
  alternateMobile,
  whatsAppNumber,
  email,

  houseNo,
  buildingName,
  area,
  landmark,
  pinCode,
  address,

  panditPreference,
  samagriRequired: String(samagriRequired),
  purpose,
  additionalRequirements,
});

  const bookingUrl =
    `/book-my-pandit/booking?${bookingParams.toString()}`;

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not selected";

  async function handleContinueToPayment() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/pandit-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  service,
  city,
  language,
  date,
  time,
  sankalp,

  devoteeName,
  mobile,
  alternateMobile,
  whatsAppNumber,
  email,

  houseNo,
  buildingName,
  area,
  landmark,
  pinCode,
  address,

  panditPreference,
  samagriRequired,
  purpose,
  additionalRequirements,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create your booking."
        );
      }

      const bookingId = data.booking?.bookingId;

      if (!bookingId) {
        throw new Error(
          "Booking was created but no booking ID was returned."
        );
      }

      router.push(
        `/book-my-pandit/payment?bookingId=${encodeURIComponent(
          bookingId
        )}`
      );
    } catch (err) {
      console.error("BOOKING SUBMISSION ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your booking."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">

          <Link
            href={bookingUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Edit Booking
          </Link>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_auto]">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
                <Sparkles size={16} />
                Book My Pandit
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Review Your
                <span className="text-amber-300">
                  {" "}Booking
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-100">
                Please check your ceremony, schedule and devotee
                information before continuing to payment.
              </p>

            </div>

            {/* Selected Service */}

            <div className="min-w-[280px] rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Selected Ceremony
              </p>

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-700">
                  <HeartHandshake size={24} />
                </div>

                <div>

                  <p className="text-xl font-bold text-white">
                    {service}
                  </p>

                  <p className="mt-1 text-sm text-orange-100">
                    Ready for review
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <section className="border-b border-orange-100 bg-white">

        <div className="mx-auto max-w-5xl px-6 py-7">

          <div className="flex items-center">

            <ProgressComplete label="Service" />

            <div className="mx-3 h-1 flex-1 rounded-full bg-green-600" />

            <ProgressComplete label="Details" />

            <div className="mx-3 h-1 flex-1 rounded-full bg-orange-600" />

            <div className="flex flex-col items-center">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-md shadow-orange-200">
                3
              </div>

              <span className="mt-2 text-xs font-bold text-orange-700">
                Review
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-4 pt-14">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
          Step 3 · Final Review
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          Check your booking details
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Make sure the information below is correct before we
          create your booking and continue to payment.
        </p>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="pb-24 pt-8">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}

          <div className="space-y-8">

            {/* POOJA DETAILS */}

            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

              <div className="flex items-center justify-between gap-5 border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-orange-600">
                    Ceremony
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {service}
                  </h2>

                </div>

                <Link
                  href={bookingUrl}
                  className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
                >
                  Edit
                </Link>

              </div>

              <div className="p-7 md:p-9">

                <div className="grid gap-5 md:grid-cols-2">

                  <DetailCard
                    icon={<MapPin size={20} />}
                    label="City"
                    value={city || "Not provided"}
                  />

                  <DetailCard
                    icon={<Languages size={20} />}
                    label="Preferred Language"
                    value={language || "Not provided"}
                  />

                  <DetailCard
                    icon={<CalendarDays size={20} />}
                    label="Pooja Date"
                    value={formattedDate}
                  />

                  <DetailCard
                    icon={<Clock3 size={20} />}
                    label="Preferred Time"
                    value={time || "Not provided"}
                  />

                </div>

              </div>

            </div>

            {/* SANKALP */}

            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

              <div className="border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <Sparkles size={23} />
                  </div>

                  <div>

                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-orange-600">
                      Sankalp
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Prayer Intention
                    </h2>

                  </div>

                </div>

              </div>

              <div className="p-7 md:p-9">

                {sankalp ? (

                  <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">

                    <p className="leading-8 text-slate-700">
                      {sankalp}
                    </p>

                  </div>

                ) : (

                  <div className="rounded-2xl bg-slate-50 p-6">

                    <p className="text-slate-500">
                      No special Sankalp or prayer intention has
                      been added.
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* DEVOTEE */}

            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

              <div className="flex items-center justify-between gap-5 border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-orange-600">
                    Devotee
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Contact & Pooja Details
                  </h2>

                </div>

                <Link
                  href={bookingUrl}
                  className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
                >
                  Edit
                </Link>

              </div>

              <div className="p-7 md:p-9">

                <div className="grid gap-7 md:grid-cols-2">

                  <ReviewItem
  label="Devotee Name"
  value={devoteeName}
/>

<ReviewItem
  label="Mobile Number"
  value={mobile}
/>

<ReviewItem
  label="WhatsApp Number"
  value={whatsAppNumber || "Not provided"}
/>

<ReviewItem
  label="Alternate Mobile"
  value={alternateMobile || "Not provided"}
/>

<ReviewItem
  label="Email"
  value={email || "Not provided"}
/>

<ReviewItem
  label="House / Flat No."
  value={houseNo || "Not provided"}
/>

<ReviewItem
  label="Building / Society"
  value={buildingName || "Not provided"}
/>

<ReviewItem
  label="Area / Locality"
  value={area || "Not provided"}
/>

<ReviewItem
  label="Landmark"
  value={landmark || "Not provided"}
/>

<ReviewItem
  label="PIN Code"
  value={pinCode || "Not provided"}
/>

<ReviewItem
  label="Complete Address"
  value={address || "Not provided"}
/>

                </div>

              </div>

            </div>
            {/* CEREMONY PREFERENCES */}

<div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

  <div className="border-b border-orange-100 bg-orange-50/70 px-7 py-6 md:px-9">

    <h2 className="text-2xl font-bold text-slate-900">
      Ceremony Preferences
    </h2>

    <p className="mt-2 text-sm text-slate-600">
      Additional preferences selected during booking.
    </p>

  </div>

  <div className="p-7 md:p-9">

    <div className="grid gap-7 md:grid-cols-2">

      <ReviewItem
        label="Preferred Pandit"
        value={panditPreference}
      />

      <ReviewItem
        label="Pooja Samagri"
        value={
          samagriRequired
            ? "Required from DivyaArpan"
            : "Already Available"
        }
      />

      <ReviewItem
        label="Purpose of Pooja"
        value={purpose || "Not provided"}
      />

      <ReviewItem
        label="Additional Requirements"
        value={
          additionalRequirements || "Not provided"
        }
      />

    </div>

  </div>

</div>

            {/* ASSURANCE */}

            <div className="flex gap-4 rounded-3xl border border-green-100 bg-green-50 p-6 md:p-7">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <ShieldCheck size={24} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  DivyaArpan Booking Coordination
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Your pandit request will be coordinated according
                  to the selected ceremony, location, preferred
                  language, schedule and service availability.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              SUMMARY
          ================================================== */}

          <aside>

            <div className="sticky top-28 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

              <div className="bg-gradient-to-r from-orange-700 to-orange-600 p-6 text-white">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {service}
                </h2>

                <p className="mt-2 text-sm text-orange-100">
                  Pandit service request
                </p>

              </div>

              <div className="p-6">

                <div className="space-y-5">

                  <SummaryRow
                    label="Devotee"
                    value={devoteeName || "—"}
                  />

                  <SummaryRow
                    label="City"
                    value={city || "—"}
                  />

                  <SummaryRow
                    label="Date"
                    value={formattedDate}
                  />

                  <SummaryRow
                    label="Time"
                    value={time || "—"}
                  />

                  <SummaryRow
                    label="Language"
                    value={language || "—"}
                  />

                </div>

                <div className="my-6 border-t border-slate-100" />

                {/* AMOUNT */}

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">

  <h3 className="text-lg font-bold text-slate-900">
    Estimated Charges
  </h3>

  <div className="mt-5 space-y-3">

    <SummaryRow
      label="Pandit Dakshina"
      value="₹2,100"
    />

    <SummaryRow
      label="Travel Charges"
      value="₹300"
    />

    <SummaryRow
      label="Samagri"
      value={
        samagriRequired ? "₹800" : "₹0"
      }
    />

    <SummaryRow
      label="Platform Fee"
      value="₹100"
    />

    <SummaryRow
      label="GST"
      value="₹126"
    />

  </div>

  <div className="my-5 border-t border-orange-200" />

  <div className="flex items-center justify-between">

    <span className="text-lg font-bold">
      Estimated Total
    </span>

    <span className="text-2xl font-extrabold text-orange-700">
      ₹3,426
    </span>

  </div>

  <p className="mt-4 text-xs leading-5 text-slate-500">
    This is an estimated amount. The final amount may vary depending on
    the selected pooja, location, and service requirements.
  </p>

</div>

                {/* ERROR */}

                {error && (

                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">
                      {error}
                    </p>

                  </div>

                )}

                {/* PAYMENT */}

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={isSubmitting}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 text-lg font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
                >

                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Creating Booking...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight size={20} />
                    </>
                  )}

                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">

                  <ShieldCheck size={15} />

                  Secure booking with DivyaArpan

                </div>

                <Link
                  href={bookingUrl}
                  className="mt-4 block text-center text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  ← Edit booking details
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

function ProgressComplete({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
        <CheckCircle2 size={22} />
      </div>

      <span className="mt-2 text-xs font-bold text-green-700">
        {label}
      </span>

    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-orange-100 bg-[#fffaf5] p-5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
        {icon}
      </div>

      <div>

        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-bold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-start gap-2 font-bold text-slate-900">

        <UserRound
          size={17}
          className="mt-0.5 shrink-0 text-orange-600"
        />

        <span>
          {value || "Not provided"}
        </span>

      </div>

    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="max-w-[190px] text-right font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}