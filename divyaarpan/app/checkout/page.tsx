"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TempleBooking = {
  bookingId: string;
  temple: string;
  pooja: string;
  date: string;
  time: string;
  duration: string;
  devotees: number;
  price: string;
  name: string;
  mobile: string;
  email: string | null;
  sankalp: string | null;
};

export default function Checkout() {
  const [booking, setBooking] = useState<TempleBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      const bookingId = new URLSearchParams(window.location.search)
        .get("bookingId");

      if (!bookingId) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load booking details.");
        }
        setBooking(data.booking);
      } catch (error) {
        console.error("Failed to load booking:", error);
        setError(error instanceof Error ? error.message : "Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff9f3] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
            🪷
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#f45112]">
            DivyaDarpan
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#10264b]">
            Loading Your Booking
          </h1>

          <p className="mt-2 text-slate-500">
            Please wait while we prepare your Pooja details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#fff9f3] flex items-center justify-center px-6">
        <div className="text-center" role="alert">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">!</div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#f45112]">DivyaDarpan</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#10264b]">Booking could not be loaded</h1>
          <p className="mt-2 text-slate-500">{error || "This booking is unavailable."}</p>
          <Link href="/temples" className="mt-6 inline-flex rounded-xl bg-[#f45112] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d9430b]">Back to Temples</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff9f3]">
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f45112]">
            DivyaDarpan
          </p>

          <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl shadow-sm">
            🪷
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[#10264b] md:text-5xl">
            Complete Your Pooja Booking
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#10264b] md:text-lg">
            Aap bhakti kijiye. Baaki hum sambhalenge. 🙏
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Please review your Pooja details before proceeding to secure payment.
          </p>

        </div>


        {/* BOOKING JOURNEY */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-orange-100 bg-white px-5 py-5 shadow-sm md:px-8">

          <div className="grid grid-cols-3 text-center">

            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f45112] text-sm font-bold text-white">
                ✓
              </div>

              <p className="mt-2 text-xs font-semibold text-[#f45112] md:text-sm">
                Pooja Details
              </p>
            </div>


            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f45112] text-sm font-bold text-white">
                ✓
              </div>

              <p className="mt-2 text-xs font-semibold text-[#f45112] md:text-sm">
                Review
              </p>
            </div>


            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-500">
                3
              </div>

              <p className="mt-2 text-xs font-medium text-slate-500 md:text-sm">
                Secure Payment
              </p>
            </div>

          </div>

        </div>


        {/* MAIN DETAILS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* POOJA DETAILS */}
          <div className="rounded-3xl border border-orange-100 bg-white shadow-[0_15px_45px_rgba(80,40,10,0.07)]">

            <div className="border-b border-orange-100 px-6 py-6 md:px-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                  🛕
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                    Your Booking
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                    Pooja Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your selected Pooja and booking information.
                  </p>
                </div>

              </div>

            </div>


            <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">

              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Temple
                </p>

                <p className="mt-2 font-semibold leading-6 text-[#10264b]">
                  {booking.temple}
                </p>
              </div>


              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pooja
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.pooja}
                </p>
              </div>


              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Date
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.date}
                </p>
              </div>


              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Time
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.time}
                </p>
              </div>


              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Duration
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.duration}
                </p>
              </div>


              <div className="rounded-2xl bg-[#fff9f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Devotees
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.devotees}
                </p>
              </div>


              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 md:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                  Pooja Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-[#f45112]">
                  {booking.price}
                </p>

              </div>

            </div>

          </div>


          {/* DEVOTEE DETAILS */}
          <div className="rounded-3xl border border-orange-100 bg-white shadow-[0_15px_45px_rgba(80,40,10,0.07)]">

            <div className="border-b border-orange-100 px-6 py-6 md:px-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                  🙏
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                    Devotee
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                    Your Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Details provided for your Pooja arrangement.
                  </p>
                </div>

              </div>

            </div>


            <div className="space-y-4 p-6 md:p-8">

              <div className="rounded-2xl border border-slate-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-2 font-semibold text-[#10264b]">
                  {booking.name}
                </p>
              </div>


              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Mobile
                  </p>

                  <p className="mt-2 font-semibold text-[#10264b]">
                    {booking.mobile}
                  </p>
                </div>


                <div className="rounded-2xl border border-slate-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-2 break-all font-semibold text-[#10264b]">
                    {booking.email}
                  </p>
                </div>

              </div>


              <div className="rounded-2xl border border-orange-100 bg-[#fff9f3] p-5">

                <div className="flex items-center gap-3">

                  <span className="text-xl">🌸</span>

                  <div>
                    <p className="font-bold text-[#10264b]">
                      Sankalp / Prayer
                    </p>

                    <p className="text-xs text-slate-500">
                      Your personal prayer for the Pooja
                    </p>
                  </div>

                </div>


                <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">
                  {booking.sankalp || "No Sankalp Added"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* PAYMENT */}
        <div className="mt-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_15px_45px_rgba(80,40,10,0.07)] md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                🔒
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                  Final Step
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#10264b]">
                  Secure Payment
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Your Pooja booking is ready. You will be securely redirected
                  to Razorpay to complete your payment.
                </p>

              </div>

            </div>


            <div className="shrink-0">

              <Link
                href={`/payment?bookingId=${booking.bookingId}`}
                className="block rounded-xl bg-[#f45112] px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d9430b]"
              >
                Continue to Secure Payment →
              </Link>

            </div>

          </div>


          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">

            <span>🔐 Secure payment</span>
            <span>🧾 Booking ID: {booking.bookingId}</span>
            <span>🙏 DivyaDarpan</span>

          </div>

        </div>


        {/* FOOTER NOTE */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Your details are used only to arrange and confirm your Pooja booking.
        </p>

      </section>
    </main>
  );
}
