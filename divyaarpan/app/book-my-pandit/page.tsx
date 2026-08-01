"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Heart,
  Home,
  Languages,
  MapPin,
  Sparkles,
  Star,
  Church,
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "Ganesh Pooja",
    description:
      "Seek Lord Ganesha's blessings for success, prosperity and removal of obstacles.",
    icon: Sparkles,
    suitableFor: "New beginnings & prosperity",
    duration: "45–60 Minutes",
  },
  {
    id: 2,
    title: "Griha Pravesh",
    description:
      "Traditional house warming ceremony for positivity and an auspicious beginning.",
    icon: Home,
    suitableFor: "New home & house warming",
    duration: "60–90 Minutes",
  },
  {
    id: 3,
    title: "Satyanarayan Pooja",
    description:
      "Sacred family pooja performed for happiness, prosperity and well-being.",
    icon: Heart,
    suitableFor: "Family happiness & gratitude",
    duration: "90–120 Minutes",
  },
  {
    id: 4,
    title: "Rudrabhishek",
    description:
      "Sacred Abhishek dedicated to Lord Shiva for peace and spiritual blessings.",
    icon: Flame,
    suitableFor: "Peace & spiritual devotion",
    duration: "60–90 Minutes",
  },
  {
    id: 5,
    title: "Navgrah Pooja",
    description:
      "Traditional Navgrah rituals performed for harmony and positive energy.",
    icon: Star,
    suitableFor: "Harmony & positive energy",
    duration: "90–120 Minutes",
  },
  {
    id: 6,
    title: "Wedding Ceremony",
    description:
      "Traditional Hindu wedding rituals performed according to customary practices.",
    icon: Church,
    suitableFor: "Hindu wedding ceremonies",
    duration: "As per ceremony",
  },
];

export default function BookMyPanditPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
                <Sparkles size={16} />
                DivyaArpan Pandit Services
              </div>

              <h1 className="mt-7 text-5xl font-extrabold leading-tight text-white md:text-6xl">
                Book a Pandit for
                <span className="block text-amber-300">
                  Your Sacred Ceremony
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-orange-100">
                Choose your pooja, location, preferred language and
                schedule. DivyaArpan will help coordinate a suitable
                pandit for your ceremony.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  <MapPin size={16} className="text-amber-300" />
                  Location Based
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  <Languages size={16} className="text-amber-300" />
                  Preferred Language
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  <CalendarDays
                    size={16}
                    className="text-amber-300"
                  />
                  Choose Date & Time
                </div>
              </div>
            </div>

            {/* Right Information Card */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-md md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                Simple Booking
              </p>

              <h2 className="mt-3 text-2xl font-bold text-white">
                How it works
              </h2>

              <div className="mt-7 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-orange-700">
                    1
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Select Ceremony
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-orange-100">
                      Choose the pooja or ceremony you require.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-orange-700">
                    2
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Enter Details
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-orange-100">
                      Provide location, language, date and Sankalp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-orange-700">
                    3
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Review & Confirm
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-orange-100">
                      Review your request before continuing.
                    </p>
                  </div>
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
            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-md shadow-orange-200">
                1
              </div>

              <span className="mt-2 text-xs font-bold text-orange-700">
                Service
              </span>
            </div>

            <div className="mx-3 h-1 flex-1 rounded-full bg-orange-100" />

            <div className="flex flex-col items-center opacity-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                2
              </div>

              <span className="mt-2 text-xs font-semibold text-slate-600">
                Details
              </span>
            </div>

            <div className="mx-3 h-1 flex-1 rounded-full bg-orange-100" />

            <div className="flex flex-col items-center opacity-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                3
              </div>

              <span className="mt-2 text-xs font-semibold text-slate-600">
                Review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICE SELECTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Step 1 · Select Service
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            What ceremony do you need a Pandit for?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Select your pooja or ceremony. You will choose your
            location, language, date and preferred time in the next
            step.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            const bookingUrl =
              `/book-my-pandit/booking?service=${encodeURIComponent(
                service.title
              )}`;

            return (
              <article
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
              >
                {/* Card Top */}
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                      <Icon size={29} />
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
                      Pandit Service
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900 transition group-hover:text-orange-700">
                    {service.title}
                  </h3>

                  <p className="mt-3 min-h-[84px] leading-7 text-slate-600">
                    {service.description}
                  </p>

                  {/* Details */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-orange-600"
                      />

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Suitable For
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {service.suitableFor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                      <CalendarDays
                        size={17}
                        className="shrink-0 text-orange-600"
                      />

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Approx. Duration
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {service.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select */}
                <div className="mt-auto border-t border-orange-100 p-6">
                  <Link
                    href={bookingUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-bold text-white transition hover:bg-orange-700"
                  >
                    Select {service.title}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          HELP
      ====================================================== */}

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl border border-orange-100 bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                Need Another Ceremony?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Can't find the pooja you need?
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                DivyaArpan will continue adding more ceremonies and
                pandit services as the service network expands.
              </p>
            </div>

            <Link
              href="/contact"
              className="shrink-0 rounded-xl border border-orange-600 px-6 py-3.5 text-center font-bold text-orange-700 transition hover:bg-orange-50"
            >
              Contact DivyaArpan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}