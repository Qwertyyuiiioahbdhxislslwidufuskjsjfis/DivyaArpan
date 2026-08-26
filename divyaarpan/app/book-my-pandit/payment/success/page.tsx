"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Languages,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type PanditBooking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  address: string;
  language: string;
  date: string;
  time: string;
  sankalp: string | null;
  devoteeName: string;
  mobile: string;
  email: string | null;
  status: string;
  paymentStatus: string;
  amount: number | null;
  panditId: number | null;
  panditName: string | null;
};

type AssignedPanditLanguage = {
  id: number;
  panditId: number;
  language: string;
  createdAt: string;
};

type AssignedPanditService = {
  id: number;
  panditId: number;
  serviceName: string;
  basePrice: number | null;
  durationMinutes: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AssignedPandit = {
  id: number;
  panditCode: string;
  name: string;
  rating: number;
  experienceYears: number;
  verificationStatus: string;
  isOnline: boolean;
  languages: AssignedPanditLanguage[];
  services: AssignedPanditService[];
};

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] =
    useState<PanditBooking | null>(null);

  const [assignedPandit, setAssignedPandit] =
    useState<AssignedPandit | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      queueMicrotask(() => {
        setError("Booking ID is missing.");
        setLoading(false);
      });
      return;
    }

    async function loadConfirmation() {
      try {
        const bookingResponse = await fetch(
          `/api/pandit-bookings?bookingId=${encodeURIComponent(
            bookingId!
          )}`,
          {
            cache: "no-store",
          }
        );

        const bookingData =
          await bookingResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData.error ||
              "Unable to load your booking."
          );
        }

        setBooking(bookingData.booking);

        const assignedResponse = await fetch(
          `/api/pandit-bookings/${encodeURIComponent(
            bookingId!
          )}/assigned`,
          {
            cache: "no-store",
          }
        );

        const assignedData =
          await assignedResponse.json();

        if (
          assignedResponse.ok &&
          assignedData.assigned
        ) {
          setAssignedPandit(
            assignedData.pandit
          );
        }
      } catch (err) {
        console.error(
          "LOAD CONFIRMATION ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load booking confirmation."
        );
      } finally {
        setLoading(false);
      }
    }

    void Promise.resolve().then(loadConfirmation);
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <Loader2
              size={42}
              className="mx-auto animate-spin text-orange-600"
            />

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Confirming your booking...
            </h1>

            <p className="mt-2 text-gray-500">
              Please wait while we prepare your
              confirmation.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-orange-50">
        <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <h1 className="text-4xl font-bold">
              Booking Confirmation
            </h1>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              We couldn&apos;t load your confirmation
            </h2>

            <p className="mt-4 text-gray-600">
              {error ||
                "Your booking could not be found."}
            </p>

            <Link
              href="/book-my-pandit"
              className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Book My Pandit
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (booking.paymentStatus !== "PAID" || booking.status !== "CONFIRMED") {
    return (
      <main className="min-h-screen bg-orange-50">
        <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <h1 className="text-4xl font-bold">Payment Confirmation</h1>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment is not confirmed yet
            </h2>
            <p className="mt-4 text-gray-600">
              Your Pandit booking is still being processed. Please return to payment and try again if needed.
            </p>
            <Link
              href={`/book-my-pandit/payment?bookingId=${encodeURIComponent(booking.bookingId)}`}
              className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Return to Payment
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const formattedDate = new Date(
    `${booking.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedAmount = booking.amount
    ? `₹${(booking.amount / 100).toLocaleString(
        "en-IN"
      )}`
    : "Paid";

  const languages = assignedPandit?.languages
    ?.map((item) => item.language)
    .join(", ");

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Success Hero */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 text-white">
  {/* Subtle background decoration */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[45px] border-white/10" />

    <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full border-[55px] border-white/10" />

    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-6xl px-6 py-16 text-center md:py-20">

    {/* Premium Success Icon */}
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-green-500">
        <CheckCircle2
          size={38}
          strokeWidth={2.5}
          className="text-green-600"
        />
      </div>
    </div>

    {/* Eyebrow */}
    <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-orange-100 md:text-sm">
      DivyaArpan Booking Confirmed
    </p>

    {/* Main Heading */}
    <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
      Your Pooja Is Confirmed
    </h1>

    {/* Description */}
    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-orange-50 md:text-lg md:leading-8">
      Your payment has been received successfully.
      Your pooja has been arranged with DivyaArpan,
      and your assigned Pandit is ready to serve you.
    </p>

    {/* Success Badge */}
    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm">
      <CheckCircle2 size={18} />
      Payment Successful
    </div>

    {/* Booking ID */}
    {booking && (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/15 bg-black/10 px-6 py-4 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-100">
          Your Booking ID
        </p>

        <p className="mt-2 break-all text-base font-bold tracking-wide text-white md:text-lg">
          {booking.bookingId}
        </p>
      </div>
    )}

  </div>
</section>

      {/* Main Content */}

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-8">

          {/* Emotional reassurance */}

          <div className="rounded-3xl border border-orange-200 bg-white p-7 text-center shadow-sm md:p-9">
            <p className="text-2xl font-bold text-gray-900">
              🙏 Your Sankalp is in safe hands.
            </p>

            <p className="mx-auto mt-3 max-w-3xl leading-7 text-gray-600">
              DivyaArpan has successfully confirmed
              your booking and assigned a verified
              Pandit for your pooja. Please keep your
              Booking ID safely for any future
              assistance.
            </p>
          </div>

          {/* Booking ID */}

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Your Booking ID
                </p>

                <p className="mt-2 break-all text-2xl font-bold tracking-wide text-gray-900">
                  {booking.bookingId}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                <CheckCircle2 size={17} />
                CONFIRMED
              </div>
            </div>
          </div>

          {/* Pandit */}

          {assignedPandit && (
            <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-7 py-5 text-white md:px-9">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
                  Your Pandit
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Pandit {assignedPandit.name}
                </h2>

                <p className="mt-1 text-green-100">
                  Your pooja has been assigned to this
                  verified Pandit.
                </p>
              </div>

              <div className="p-7 md:p-9">
                <div className="grid gap-5 md:grid-cols-2">
                  <InfoCard
                    icon={<UserRound size={20} />}
                    label="Experience"
                    value={`${assignedPandit.experienceYears} Years`}
                  />

                  <InfoCard
                    icon={<ShieldCheck size={20} />}
                    label="Verification"
                    value={
                      assignedPandit.verificationStatus
                    }
                  />

                  <InfoCard
                    icon={<Languages size={20} />}
                    label="Languages"
                    value={
                      languages || booking.language
                    }
                  />

                  <InfoCard
                    icon={<UserRound size={20} />}
                    label="Pandit ID"
                    value={
                      assignedPandit.panditCode
                    }
                  />
                </div>

                <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-6">
                  <div className="flex gap-4">
                    <ShieldCheck
                      size={27}
                      className="shrink-0 text-green-700"
                    />

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Verified by DivyaArpan
                      </h3>

                      <p className="mt-2 leading-6 text-gray-600">
                        Your Pandit has been verified
                        through the DivyaArpan platform
                        and assigned according to your
                        booking requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pooja Details */}

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Pooja Details
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {booking.service}
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <InfoCard
                icon={<UserRound size={20} />}
                label="Devotee"
                value={booking.devoteeName}
              />

              <InfoCard
                icon={<CalendarDays size={20} />}
                label="Date"
                value={formattedDate}
              />

              <InfoCard
                icon={<Clock3 size={20} />}
                label="Time"
                value={booking.time}
              />

              <InfoCard
                icon={<Languages size={20} />}
                label="Language"
                value={booking.language}
              />

              <InfoCard
                icon={<MapPin size={20} />}
                label="City"
                value={booking.city}
              />

              <InfoCard
                icon={<MapPin size={20} />}
                label="Pooja Address"
                value={booking.address}
              />
            </div>
          </div>

          {/* Payment */}

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Payment
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Payment Received Successfully
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-100 px-5 py-3 font-bold text-green-700">
                <CheckCircle2 size={19} />
                PAID
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-2xl bg-orange-50 p-5">
              <span className="font-medium text-gray-600">
                Amount Paid
              </span>

              <span className="text-2xl font-bold text-gray-900">
                {formattedAmount}
              </span>
            </div>
          </div>

          {/* Contact Support */}

          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white">
                  <Phone size={27} />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                    Need Help?
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Contact DivyaArpan Support
                  </h2>

                  <p className="mt-2 max-w-2xl leading-6 text-gray-600">
                    For Pandit coordination, timing
                    changes, location assistance, or any
                    booking-related help, our DivyaArpan
                    team is here for you.
                  </p>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl bg-white px-6 py-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  DivyaArpan Support
                </p>

                <p className="mt-1 text-lg font-bold text-orange-700">
                  Support Number Coming Soon
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-orange-200 bg-white p-5">
              <p className="text-sm leading-6 text-gray-600">
                🔒 For your privacy and security, the
                Pandit&apos;s personal contact number is not
                shared directly. Please contact DivyaArpan
                Support and keep your Booking ID ready.
                Our team will coordinate with the Pandit
                whenever required.
              </p>
            </div>
          </div>

          {/* Sankalp */}

          {booking.sankalp && (
            <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Your Sankalp
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Prayer Intention
              </h2>

              <p className="mt-5 rounded-2xl bg-orange-50 p-6 leading-7 text-gray-700">
                {booking.sankalp}
              </p>
            </div>
          )}

          {/* Final reassurance */}

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm md:p-10">
            <p className="text-2xl font-bold text-gray-900">
              Thank you for trusting DivyaArpan. 🙏
            </p>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
              We are honoured to be a part of your sacred
              occasion. Your booking has been successfully
              recorded with DivyaArpan.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                <Home size={18} />
                Go to Home
              </Link>

              <Link
                href="/book-my-pandit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
              >
                <CalendarDays size={18} />
                Book Another Pooja
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fffaf5] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg font-semibold text-gray-700">
              Loading payment confirmation...
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessPageContent />
    </Suspense>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="mt-1 shrink-0 text-orange-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}