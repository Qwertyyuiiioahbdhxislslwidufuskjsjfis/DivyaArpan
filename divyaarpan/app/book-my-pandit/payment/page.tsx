"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Languages,
  Loader2,
  LockKeyhole,
  MapPin,
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
};

export default function PanditPaymentPage() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] =
    useState<PanditBooking | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is missing.");
      setLoading(false);
      return;
    }

    async function fetchBooking() {
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
            data.error || "Unable to load booking."
          );
        }

        setBooking(data.booking);
      } catch (err) {
        console.error("LOAD BOOKING ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-orange-600"
          />

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Loading your booking...
          </h1>

          <p className="mt-2 text-gray-500">
            Please wait while we prepare your payment.
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Unable to Load Booking
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "Booking could not be found."}
          </p>

          <Link
            href="/book-my-pandit"
            className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Start New Booking
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(
    `${booking.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/book-my-pandit"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/25"
          >
            <ArrowLeft size={18} />
            Book My Pandit
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            DivyaArpan Secure Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Complete Your Payment
          </h1>

          <p className="mt-4 text-orange-100">
            Booking ID:{" "}
            <span className="font-bold text-white">
              {booking.bookingId}
            </span>
          </p>
        </div>
      </section>

      {/* Progress */}

      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-7">
          <div className="flex items-center">
            <ProgressComplete label="Service" />

            <div className="mx-3 h-1 flex-1 bg-green-600" />

            <ProgressComplete label="Details" />

            <div className="mx-3 h-1 flex-1 bg-green-600" />

            <ProgressComplete label="Review" />

            <div className="mx-3 h-1 flex-1 bg-orange-600" />

            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white">
                <CreditCard size={20} />
              </div>

              <span className="mt-2 text-xs font-semibold text-orange-700">
                Payment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_390px]">
          {/* Booking Information */}

          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
              <p className="font-semibold text-orange-600">
                Your Booking
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
                  icon={<MapPin size={20} />}
                  label="City"
                  value={booking.city}
                />

                <InfoCard
                  icon={<CalendarDays size={20} />}
                  label="Pooja Date"
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
                  label="Pooja Address"
                  value={booking.address}
                />
              </div>
            </div>

            {booking.sankalp && (
              <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
                <p className="font-semibold text-orange-600">
                  Sankalp
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Prayer Intention
                </h2>

                <p className="mt-5 rounded-2xl bg-orange-50 p-5 leading-7 text-gray-700">
                  {booking.sankalp}
                </p>
              </div>
            )}

            <div className="flex gap-4 rounded-3xl border border-green-100 bg-green-50 p-6">
              <ShieldCheck
                size={28}
                className="shrink-0 text-green-700"
              />

              <div>
                <h3 className="font-bold text-gray-900">
                  Secure DivyaArpan Booking
                </h3>

                <p className="mt-2 leading-6 text-gray-600">
                  Your booking has already been registered.
                  Payment confirmation will be linked to your
                  unique booking ID.
                </p>
              </div>
            </div>
          </div>


            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="font-semibold text-orange-600">
                Choose Payment Method
              </p>

              <div className="mt-6 space-y-3">
                {["UPI","Credit / Debit Card","Net Banking","Wallet"].map((method)=>(
                  <label key={method} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-orange-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod===method}
                      onChange={()=>setPaymentMethod(method)}
                    />
                    <span className="font-medium text-gray-800">{method}</span>
                  </label>
                ))}
              </div>
            </div>


          {/* Payment Summary */}

          <aside>
            <div className="sticky top-28 rounded-3xl bg-white p-7 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Payment Summary
              </p>

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {booking.service}
              </h2>

              <div className="mt-6 space-y-4 border-y border-gray-100 py-6">
                <SummaryRow
                  label="Booking ID"
                  value={booking.bookingId}
                />

                <SummaryRow
                  label="Booking Status"
                  value={booking.status}
                />

                <SummaryRow
                  label="Payment Status"
                  value={booking.paymentStatus}
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-gray-600">
                  Amount Payable
                </span>

                <span className="text-right text-lg font-bold text-gray-900">
                  {booking.amount
                    ? `₹${(booking.amount / 100).toLocaleString(
                        "en-IN"
                      )}`
                    : "To be confirmed"}
                </span>
              </div>

              {!booking.amount && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-800">
                    The service price has not yet been confirmed.
                    Online payment will become available after the
                    final amount is assigned.
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={!booking.amount}
                className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-4 text-lg font-semibold text-gray-500"
              >
                <LockKeyhole size={19} />
                Pay Securely
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={15} />
                Secure payment powered by trusted gateway
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
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white">
        <CheckCircle2 size={21} />
      </div>

      <span className="mt-2 text-xs font-semibold text-green-700">
        {label}
      </span>
    </div>
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
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {value}
        </p>
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
      <span className="text-gray-500">
        {label}
      </span>

      <span className="max-w-[210px] break-words text-right font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}