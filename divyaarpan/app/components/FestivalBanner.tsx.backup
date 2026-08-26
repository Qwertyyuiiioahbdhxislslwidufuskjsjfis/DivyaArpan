"use client";

import Link from "next/link";
import { CalendarDays, Sparkles, ArrowRight } from "lucide-react";

export default function FestivalBanner() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 p-10 lg:p-14 shadow-2xl">

          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} />
                Festival Special
              </span>

              <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
                Ganesh Chaturthi
                <span className="block text-yellow-100">
                  Bookings are Open
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg text-orange-50 leading-8">
                Reserve your Ganesh Pooja, Ganesh Sthapana, Ganesh Visarjan,
                Atharvashirsha Path and Home Pooja with verified pandits.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/booking?festival=ganesh-chaturthi"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-orange-700 transition hover:scale-105"
                >
                  Book Ganesh Pooja
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/book-my-pandit"
                  className="rounded-xl border border-white px-6 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-700"
                >
                  Book Pandit
                </Link>

              </div>
            </div>

            {/* Right */}
            <div className="flex justify-center lg:justify-end">

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl p-8 border border-white/20 w-full max-w-md">

                <div className="flex items-center gap-3 text-white">
                  <CalendarDays />
                  <span className="font-semibold">
                    Festival Countdown
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-3">

                  {[
                    ["12", "Days"],
                    ["08", "Hours"],
                    ["24", "Minutes"],
                    ["51", "Seconds"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-white/20 py-5 text-center"
                    >
                      <div className="text-3xl font-bold text-white">
                        {value}
                      </div>

                      <div className="mt-2 text-xs uppercase tracking-wide text-orange-100">
                        {label}
                      </div>
                    </div>
                  ))}

                </div>

                <div className="mt-8 rounded-2xl bg-white/10 p-5">

                  <p className="text-sm text-orange-100">
                    ⭐ Limited festival slots are available. Reserve your
                    preferred date early to avoid last-minute bookings.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}