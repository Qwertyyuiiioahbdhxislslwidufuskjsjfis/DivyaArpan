"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  CreditCard,
  Home,
  Languages,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
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

function PaymentFailedPageContent() {
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

    async function loadBooking() {
      try {
        const response = await fetch(
          `/api/pandit-bookings?bookingId=${encodeURIComponent(
            bookingId!
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load your booking."
          );
        }

        setBooking(data.booking);

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
          "LOAD FAILED PAYMENT BOOKING ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    }

    void Promise.resolve().then(loadBooking);
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
              Loading your booking...
            </h1>

            <p className="mt-2 text-gray-500">
              Please wait while we prepare your
              payment information.
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
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <AlertCircle
                size={48}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-7 text-4xl font-bold">
              Payment Not Completed
            </h1>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              We couldn&apos;t load your booking
            </h2>

            <p className="mt-4 text-gray-600">
              {error ||
                "Your booking could not be found."}
            </p>

            <Link
              href="/book-my-pandit"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              <CalendarDays size={18} />
              Book My Pandit
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
    : "To be confirmed";

  const languages = assignedPandit?.languages
    ?.map((item) => item.language)
    .join(", ");

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Hero */}

      <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">
            <AlertCircle
              size={58}
              strokeWidth={2.5}
              className="text-red-600"
            />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-orange-100">
            DivyaDarpan Payment
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Payment Not Completed
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-orange-100 md:text-xl">
            Your payment could not be completed, but
            <strong> your booking details are safe.</strong>
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-8">

          {/* Main reassurance */}

          <div className="rounded-3xl border border-green-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <ShieldCheck
                  size={28}
                  className="text-green-700"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Don&apos;t worry — your booking is safe
                </h2>

                <p className="mt-2 leading-7 text-gray-600">
                  Your payment was not confirmed, so we
                  have not marked this booking as paid.
                  You can safely try the payment again
                  using the same booking.
                </p>
              </div>
            </div>
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

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                <AlertCircle size={17} />
                PAYMENT PENDING
              </div>
            </div>
          </div>

          {/* Pandit */}

          {assignedPandit && (
            <div className="rounded-3xl border border-green-200 bg-white shadow-sm">
              <div className="rounded-t-3xl bg-green-700 px-7 py-5 text-white md:px-9">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
                  Pandit Assigned
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Pandit {assignedPandit.name}
                </h2>

                <p className="mt-1 text-green-100">
                  Your Pandit remains assigned while
                  payment is pending.
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
              </div>
            </div>
          )}

          {/* Pooja Details */}

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              Your Pooja
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

          {/* Amount */}

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Amount Payable
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {formattedAmount}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                <CreditCard
                  size={28}
                  className="text-orange-600"
                />
              </div>
            </div>
          </div>

          {/* Retry */}

          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-7 text-center shadow-sm md:p-10">
            <RefreshCw
              size={36}
              className="mx-auto text-orange-600"
            />

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Ready to complete your booking?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
              Your booking is still available. You can
              return to the secure payment page and try
              again.
            </p>

            <Link
              href={`/book-my-pandit/payment?bookingId=${encodeURIComponent(
                booking.bookingId
              )}`}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              <CreditCard size={20} />
              Try Payment Again
            </Link>
          </div>

          {/* Support */}

          <div className="rounded-3xl border border-orange-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
                  <Phone
                    size={27}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                    Need Assistance?
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Contact DivyaDarpan Support
                  </h2>

                  <p className="mt-2 max-w-2xl leading-6 text-gray-600">
                    If you need help with your payment,
                    Pandit coordination, timing, location,
                    or booking, our team is here to assist
                    you.
                  </p>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl bg-orange-50 px-6 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  DivyaDarpan Support
                </p>

                <p className="mt-1 text-lg font-bold text-orange-700">
                  Support Number Coming Soon
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm leading-6 text-gray-600">
                📌 Please keep your{" "}
                <strong>Booking ID</strong> ready when
                contacting DivyaDarpan Support.
              </p>
            </div>
          </div>

          {/* Bank deduction warning */}

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <div className="flex gap-4">
              <AlertCircle
                size={25}
                className="shrink-0 text-amber-700"
              />

              <div>
                <h3 className="font-bold text-gray-900">
                  Did your bank account get debited?
                </h3>

                <p className="mt-2 leading-6 text-gray-700">
                  If money was deducted from your bank
                  account but this page shows payment
                  pending, please{" "}
                  <strong>
                    do not immediately make another
                    payment.
                  </strong>{" "}
                  Contact DivyaDarpan Support with your
                  Booking ID so our team can check the
                  payment status.
                </p>
              </div>
            </div>
          </div>

          {/* Final message */}

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm md:p-10">
            <p className="text-xl font-bold text-gray-900">
              🙏 Your pooja details are safe with
              DivyaDarpan.
            </p>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
              We hope to complete your booking with you
              soon. Thank you for choosing DivyaDarpan.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/book-my-pandit/payment?bookingId=${encodeURIComponent(
                  booking.bookingId
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                <RefreshCw size={18} />
                Try Payment Again
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3 font-semibold text-orange-700 hover:bg-orange-50"
              >
                <Home size={18} />
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#fffaf5] px-6">
          <div className="text-center">
            <div className="text-3xl">🪷</div>
            <p className="mt-3 font-semibold text-slate-700">
              Preparing payment details...
            </p>
          </div>
        </main>
      }
    >
      <PaymentFailedPageContent />
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