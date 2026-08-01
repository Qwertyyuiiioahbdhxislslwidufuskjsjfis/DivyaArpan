"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-amber-700 pt-32 pb-36">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-yellow-300/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left Content */}
        <div>

          <span className="inline-flex rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
            🙏 India's Trusted Spiritual Platform
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
            Temple Poojas,
            <span className="block text-amber-300">
              Verified Pandits
            </span>
            All At One Place.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-orange-100">
            Book authentic temple poojas, experienced pandits,
            homas, donations and spiritual services from verified
            temples across India.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/book-my-pandit"
              className="flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-orange-700 transition hover:scale-105"
            >
              Book My Pandit
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/temples"
              className="rounded-xl border border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-700"
            >
              Explore Temples
            </Link>

          </div>

          {/* Stats */}

          <div className="mt-14 grid grid-cols-3 gap-5">

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold text-white">
                500+
              </h3>

              <p className="mt-2 text-orange-100">
                Temples
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold text-white">
                1000+
              </h3>

              <p className="mt-2 text-orange-100">
                Verified Pandits
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold text-white">
                24x7
              </h3>

              <p className="mt-2 text-orange-100">
                Booking
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="relative">

          <div className="overflow-hidden rounded-3xl shadow-2xl">

            <Image
              src="/images/hero/hero-temple.jpg"
              alt="Temple"
              width={700}
              height={700}
              priority
              className="h-[600px] w-full object-cover"
            />

          </div>

          {/* Floating Card */}

          <div className="absolute -bottom-10 -left-8 rounded-3xl bg-white p-6 shadow-2xl">

            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600" />
                <span className="font-semibold">
                  Verified Pandits
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="text-orange-600" />
                <span className="font-semibold">
                  Instant Booking
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Star className="text-yellow-500" />
                <span className="font-semibold">
                  Trusted by Devotees
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}