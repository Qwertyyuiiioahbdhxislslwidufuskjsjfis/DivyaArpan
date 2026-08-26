"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type TempleBooking = {
  bookingId: string;
  temple: string;
  pooja: string;
  date: string;
  time: string;
  duration: string;
  poojaMode: string;
  devotees: number;
  price: string;
  name: string;
  mobile: string;
  email: string | null;
  sankalp: string | null;
  paymentStatus: string;
  status: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<TempleBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const loadBooking = async () => {
      try {
        const response = await fetch(
          `/api/bookings/${encodeURIComponent(bookingId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data.success) {
          setBooking(data.booking);
        }
      } catch (error) {
        console.error("SUCCESS PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    void Promise.resolve().then(loadBooking);
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff9f3] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <span className="text-2xl">✦</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#10264b]">
            Preparing Your Confirmation
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we load your Pooja details.
          </p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#fff9f3] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
            !
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#10264b]">
            Booking Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We could not find this booking. Please return to DivyaArpan and
            try again.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#f45112] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d9430b]"
          >
            Back to DivyaArpan
          </Link>
        </div>
      </main>
    );
  }

  const isPaid =
    booking.paymentStatus === "PAID";

  return (
    <main className="min-h-screen bg-[#fff9f3] px-5 py-10 md:px-8 md:py-14 print:bg-white">
      <section className="mx-auto max-w-5xl">

        {/* BRAND */}
        <div className="text-center">
          <p className="font-serif text-3xl font-bold text-[#f45112]">
            DivyaArpan
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-[#10264b]">
            Divine Services Platform
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        <div className="mx-auto mt-8 max-w-3xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl shadow-sm">
            ✓
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#f45112]">
            {isPaid ? "Payment Confirmed" : "Booking Received"}
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[#10264b] md:text-5xl">
            {isPaid ? "Your Pooja payment is confirmed" : "Your Pooja booking is received"}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            {isPaid
              ? "Thank you for choosing DivyaArpan. Your payment is confirmed and we will take care of the arrangements."
              : "Thank you for choosing DivyaArpan. Your booking is recorded, but payment is still pending."}
          </p>

        </div>

        {/* BOOKING ID */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-orange-100 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Booking ID
              </p>

              <p className="mt-1 text-xl font-bold tracking-wide text-[#10264b]">
                {booking.bookingId}
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                isPaid
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {isPaid ? "Payment Successful" : "Booking Received"}
            </div>

          </div>
        </div>

        {/* MAIN DETAILS */}
        <div className="mt-7 grid gap-6 lg:grid-cols-2">

          {/* POOJA DETAILS */}
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_15px_45px_rgba(80,40,10,0.06)] md:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                🛕
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f45112]">
                  Your Pooja
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                  Pooja Details
                </h2>
              </div>

            </div>

            <div className="mt-7 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Temple
                </p>
                <p className="mt-1 font-semibold text-[#10264b]">
                  {booking.temple}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pooja
                </p>
                <p className="mt-1 font-semibold text-[#10264b]">
                  {booking.pooja}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>
                  <p className="mt-1 font-semibold text-[#10264b]">
                    {booking.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Time
                  </p>
                  <p className="mt-1 font-semibold text-[#10264b]">
                    {booking.time}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Duration
                  </p>
                  <p className="mt-1 font-semibold text-[#10264b]">
                    {booking.duration}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pooja Arrangement
                  </p>

                  <div className="mt-2 rounded-2xl bg-[#fff9f3] p-4">
                    <p className="font-semibold text-[#10264b]">
                      {booking.poojaMode === "ON_BEHALF"
                        ? "🙏 Ghar Se Pooja — Arranged on Your Behalf"
                        : booking.poojaMode === "AT_HOME"
                          ? "🏠 Ghar Mein Pooja — Pandit at Home"
                          : "🛕 Mandir Mein Pooja — Devotee Present"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {booking.poojaMode === "ON_BEHALF"
                        ? "DivyaArpan will coordinate the Pooja, required Samagri and trusted Pandit arrangements for you."
                        : booking.poojaMode === "AT_HOME"
                          ? "A trusted Pandit will conduct the Pooja at your home with the required arrangements."
                          : "You will be present at the temple. DivyaArpan will coordinate the required Pooja arrangements."}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Devotees
                  </p>
                  <p className="mt-1 font-semibold text-[#10264b]">
                    {booking.devotees}
                  </p>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pooja Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-[#f45112]">
                  ₹{String(booking.price).replace(/^₹/, "")}
                </p>

              </div>

            </div>
          </div>

          {/* DEVOTEE DETAILS */}
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_15px_45px_rgba(80,40,10,0.06)] md:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                ♡
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f45112]">
                  Devotee
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                  Your Details
                </h2>
              </div>

            </div>

            <div className="mt-7 space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Name
                </p>
                <p className="mt-1 font-semibold text-[#10264b]">
                  {booking.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Mobile
                </p>
                <p className="mt-1 font-semibold text-[#10264b]">
                  {booking.mobile}
                </p>
              </div>

              {booking.email && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-all font-semibold text-[#10264b]">
                    {booking.email}
                  </p>
                </div>
              )}

              {booking.sankalp && (
                <div className="border-t border-slate-100 pt-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sankalp / Prayer
                  </p>

                  <div className="mt-2 rounded-2xl bg-[#fff9f3] p-4 text-sm leading-6 text-[#10264b]">
                    {booking.sankalp}
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* DIVYAARPAN MESSAGE */}
        <div className="mt-7 rounded-3xl border border-orange-100 bg-white p-7 text-center shadow-sm md:p-8">

          <p className="text-lg font-bold text-[#10264b]">
            Aap bhakti kijiye. Baaki hum sambhalenge.
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            DivyaArpan will coordinate the required Pooja arrangements,
            Samagri and trusted Pandit coordination for your selected Pooja.
          </p>

        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row print:hidden">

          <button
            onClick={() => window.print()}
            className="flex-1 rounded-xl border border-orange-200 bg-white px-6 py-3.5 text-sm font-bold text-[#10264b] transition hover:bg-orange-50"
          >
            Print / Save Receipt
          </button>

          <Link
            href="/"
            className="flex-1 rounded-xl bg-[#f45112] px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d9430b]"
          >
            Back to DivyaArpan
          </Link>

        </div>

        {/* FOOTER */}
        <div className="mt-8 border-t border-orange-100 pt-5 text-center">

          <p className="text-xs text-slate-400">
            Please keep your Booking ID for future reference.
          </p>

          <p className="mt-2 text-xs font-semibold text-[#f45112]">
            DivyaArpan · Divine Services Platform
          </p>

        </div>

      </section>
    </main>
  );
}


export default function Success() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff9f3] flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-[#10264b]">
              Preparing Your Confirmation
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Please wait...
            </p>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
