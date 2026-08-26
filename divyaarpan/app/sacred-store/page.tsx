import Link from "next/link";
import {
  ArrowRight,
  Flower2,
  Gift,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const categories = [
  {
    icon: "🪔",
    title: "Temple Prasad",
    description:
      "Sacred offerings and prasad associated with revered temples and deities.",
  },
  {
    icon: "🙏",
    title: "Pooja Essentials",
    description:
      "Devotional essentials thoughtfully selected for your daily prayers and ceremonies.",
  },
  {
    icon: "📿",
    title: "Spiritual Products",
    description:
      "Items that help bring devotion and spiritual connection into your home.",
  },
  {
    icon: "🌸",
    title: "Devotional Gifts",
    description:
      "Meaningful devotional gifts for festivals, family occasions and loved ones.",
  },
];

export default function SacredStorePage() {
  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
            <ShoppingBag size={16} />
            DivyaArpan Sacred Store
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Bring the Blessings of
            <span className="block text-amber-300">
              Sacred Traditions Home
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-orange-100">
            Discover authentic devotional products associated with temples and
            deities, prepared and presented with care and devotion.
          </p>

          <div className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-4 font-semibold text-white ring-1 ring-white/20">
            <Sparkles size={18} className="text-amber-300" />
            Sacred Store Coming Soon
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Our Sacred Collection
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Devotional Products with a Purpose
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            We are building a curated collection of devotional products that
            connect devotees with temples, traditions and spiritual practices.
          </p>
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-3xl border border-orange-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-4xl">
                {category.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {category.title}
              </h3>

              <div className="mt-3 flex items-center justify-center gap-2 text-orange-500">
                <span className="h-px w-8 bg-orange-300" />
                <Flower2 size={15} />
                <span className="h-px w-8 bg-orange-300" />
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {category.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-orange-50 p-7 text-center">
              <ShieldCheck className="mx-auto text-orange-600" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Authentic & Thoughtful
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Products selected with attention to their devotional purpose
                and association.
              </p>
            </div>

            <div className="rounded-3xl bg-amber-50 p-7 text-center">
              <Heart className="mx-auto text-orange-600" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Made for Devotees
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                A collection designed around the needs of devotees and
                spiritual families.
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-7 text-center">
              <Gift className="mx-auto text-orange-600" size={32} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Meaningful Gifting
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Discover devotional gifting options for festivals and special
                occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950 via-orange-900 to-amber-700 px-8 py-14 text-center md:px-14">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Stay connected with DivyaArpan
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-orange-100">
            While our Sacred Store is being prepared, you can explore our
            Poojas and connect with a Pandit for your spiritual requirements.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/poojas"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-orange-800 shadow-lg transition hover:bg-orange-50"
            >
              Explore Poojas
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/book-my-pandit"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              Book My Pandit
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
