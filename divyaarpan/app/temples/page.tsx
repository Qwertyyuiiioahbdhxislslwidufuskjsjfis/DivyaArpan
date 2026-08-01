import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Temple = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  featuredImage: string;
  description: string;
};

async function getTemples(): Promise<Temple[]> {
  const res = await fetch("http://localhost:3000/api/temples", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch temples");
  }

  return res.json();
}

export default async function Temples() {
  const temples = await getTemples();

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-amber-700">
        {/* Background glow */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
            <Sparkles size={16} />
            Sacred Destinations
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Explore Sacred
            <span className="block text-amber-300">
              Temples Across India
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-100">
            Discover revered temples, explore their spiritual
            significance and book authentic poojas through
            DivyaArpan.
          </p>

          {/* Trust badges */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <ShieldCheck size={17} className="text-green-300" />
              Trusted Temples
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              🙏 Authentic Poojas
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              🕉️ Spiritual Services
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-6 pt-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Sacred Destinations
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Discover Temples
            </h2>

            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Explore temples available on DivyaArpan and discover
              their poojas, timings and devotional services.
            </p>
          </div>

          <div className="rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">
            {temples.length}{" "}
            {temples.length === 1 ? "Temple" : "Temples"} Available
          </div>
        </div>
      </section>

      {/* ================= TEMPLE CARDS ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        {temples.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">🛕</div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              More temples coming soon
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              We are continuously adding sacred temples and
              devotional services to DivyaArpan.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {temples.map((temple) => (
              <article
                key={temple.id}
                className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Temple Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={temple.featuredImage}
                    alt={temple.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Verified Badge */}
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-green-700 shadow-md backdrop-blur">
                    <ShieldCheck size={15} />
                    Verified Temple
                  </div>

                  {/* Gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Temple Information */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold leading-snug text-slate-900 transition group-hover:text-orange-700">
                    {temple.name}
                  </h2>

                  <div className="mt-3 flex items-start gap-2 text-slate-500">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-orange-600"
                    />

                    <span>
                      {temple.city}, {temple.state}
                    </span>
                  </div>

                  <p className="mt-5 line-clamp-3 min-h-[72px] leading-6 text-slate-600">
                    {temple.description}
                  </p>

                  <div className="mt-6 border-t border-orange-100 pt-5">
                    <Link
                      href={`/temples/${temple.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-700"
                    >
                      Explore Temple
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="border-t border-orange-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl bg-orange-50 px-6 py-12 md:px-12">
            <div className="grid gap-10 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  🛕
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Sacred Temples
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Discover renowned temples and their devotional
                  services.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  🙏
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Authentic Poojas
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Explore traditional poojas associated with each
                  temple.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  🔒
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Secure Booking
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Book devotional services through the DivyaArpan
                  platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}