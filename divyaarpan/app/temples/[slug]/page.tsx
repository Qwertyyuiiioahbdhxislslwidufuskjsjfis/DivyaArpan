import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import TempleGallery from "../../components/TempleGallery";
import TempleMap from "../../components/TempleMap";
import TemplePoojas from "../../components/TemplePoojas";

type Temple = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  mapUrl: string;
  featuredImage: string;

  facilities: {
    facility: string;
  }[];

  galleries: {
    imageUrl: string;
  }[];

  poojas: {
    name: string;
    price: string;
    duration: string;
  }[];
};

async function getTemple(slug: string): Promise<Temple> {
  const res = await fetch(
    `http://localhost:3000/api/temples/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Temple not found");
  }

  return res.json();
}

export default async function TemplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const temple = await getTemple(slug);

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      {/* =====================================================
          TEMPLE HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-800">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10">

          {/* Back */}
          <Link
            href="/temples"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Explore Temples
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">

            {/* Left Information */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
                <Sparkles size={15} />
                Sacred Temple
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                {temple.name}
              </h1>

              <div className="mt-5 flex items-start gap-2 text-lg text-orange-100">
                <MapPin
                  size={21}
                  className="mt-1 shrink-0 text-amber-300"
                />

                <span>
                  {temple.city}, {temple.state}
                </span>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-8 text-orange-100/90">
                {temple.description}
              </p>

              {/* Quick Information */}
              <div className="mt-8 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <Clock3
                    size={17}
                    className="text-amber-300"
                  />

                  {temple.openingTime} – {temple.closingTime}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  🙏
                  {temple.poojas.length}{" "}
                  {temple.poojas.length === 1
                    ? "Pooja"
                    : "Poojas"}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <ShieldCheck
                    size={17}
                    className="text-green-300"
                  />
                  DivyaArpan Listing
                </div>

              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">

              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur">

                <img
                  src={temple.featuredImage}
                  alt={temple.name}
                  className="h-[420px] w-full rounded-2xl object-cover"
                />

              </div>

              {/* Floating location card */}
              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-xl sm:left-auto sm:right-6 sm:w-80">

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <MapPin
                      size={21}
                      className="text-orange-700"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Temple Location
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                      {temple.address}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK DETAILS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-20">

        <div className="grid gap-6 md:grid-cols-3">

          {/* Timings */}
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
              <Clock3
                size={23}
                className="text-orange-700"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Temple Timings
            </h2>

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
                <span className="text-sm text-slate-600">
                  Opens
                </span>

                <span className="font-bold text-slate-900">
                  {temple.openingTime}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
                <span className="text-sm text-slate-600">
                  Closes
                </span>

                <span className="font-bold text-slate-900">
                  {temple.closingTime}
                </span>
              </div>

            </div>
          </div>

          {/* Location */}
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
              <MapPin
                size={23}
                className="text-orange-700"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Location
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {temple.address}
            </p>

            <p className="mt-3 font-semibold text-orange-700">
              {temple.city}, {temple.state}
            </p>

          </div>

          {/* Facilities */}
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-xl">
              🛕
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Temple Facilities
            </h2>

            {temple.facilities.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">

                {temple.facilities.map((facility) => (
                  <span
                    key={facility.facility}
                    className="rounded-full bg-orange-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {facility.facility}
                  </span>
                ))}

              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Facility information will be updated soon.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          POOJAS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8">

          <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Devotional Services
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Poojas at {temple.name}
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Explore available poojas and select the devotional
            service you would like to book.
          </p>

        </div>

        <TemplePoojas
          poojas={temple.poojas}
          templeName={temple.name}
        />

      </section>

      {/* =====================================================
          GALLERY
      ====================================================== */}

      {temple.galleries.length > 0 && (
        <section className="border-y border-orange-100 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="mb-8">

              <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                Temple Gallery
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Experience the Temple
              </h2>

              <p className="mt-3 text-slate-600">
                Explore glimpses of {temple.name}.
              </p>

            </div>

            <TempleGallery
              images={temple.galleries.map(
                (gallery) => gallery.imageUrl
              )}
            />

          </div>
        </section>
      )}

      {/* =====================================================
          MAP
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8">

          <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Location
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Find {temple.name}
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            View the temple location and plan your visit.
          </p>

        </div>

        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white p-2 shadow-sm">
          <TempleMap location={temple.mapUrl} />
        </div>

      </section>

      {/* =====================================================
          BOOK MY PANDIT CTA
      ====================================================== */}

      <section className="px-6 pb-24 pt-6">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-900 via-orange-800 to-amber-700 px-8 py-12 md:px-14">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                Need a Pandit?
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white md:text-4xl">
                Perform your pooja at home with an experienced pandit
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-orange-100">
                Select your ceremony, preferred language, location
                and date through DivyaArpan's Book My Pandit service.
              </p>

            </div>

            <Link
              href="/book-my-pandit"
              className="shrink-0 rounded-xl bg-white px-7 py-4 text-center font-bold text-orange-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              Book My Pandit →
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}