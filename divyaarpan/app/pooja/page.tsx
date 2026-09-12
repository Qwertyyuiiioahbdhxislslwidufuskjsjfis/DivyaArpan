import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { prisma } from "../lib/prisma";

type Pooja = {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  temple: {
    slug: string;
    name: string;
    city: string;
    state: string;
  };
};

async function getPoojas(): Promise<Pooja[]> {
  return prisma.pooja.findMany({
    where: { isActive: true },
    include: {
      temple: {
        select: {
          slug: true,
          name: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: [{ name: "asc" }, { createdAt: "desc" }],
  });
}

export default async function Pooja() {
  const poojas = await getPoojas();

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-amber-700">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-orange-100 backdrop-blur">
            <Sparkles size={16} />
            DivyaDarpan Pooja Services
          </div>
          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Choose a Pooja for your
            <span className="block text-amber-300">devotional journey</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-orange-100">
            Browse active Pooja services offered through our temple listings,
            review the details and continue into the existing booking flow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Active services
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Poojas available to book
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Every card is connected to its temple listing and the current
              DivyaDarpan booking journey.
            </p>
          </div>
          <div className="rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-700">
            {poojas.length} {poojas.length === 1 ? "Pooja" : "Poojas"}
          </div>
        </div>

        {poojas.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-orange-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">🙏</div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Pooja services are being prepared
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
              Browse our temple listings to discover available devotional
              services as they are added.
            </p>
            <Link
              href="/temples"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
            >
              Explore Temples
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {poojas.map((pooja) => (
              <article
                key={pooja.id}
                className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {pooja.image ? (
                  <Image
                    src={pooja.image}
                    alt={pooja.name}
                    width={800}
                    height={400}
                    unoptimized
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-6xl">
                    🙏
                  </div>
                )}
                <div className="p-6">
                  <p className="text-sm font-semibold text-orange-700">
                    {pooja.temple.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 group-hover:text-orange-700">
                    {pooja.name}
                  </h2>
                  <p className="mt-3 line-clamp-3 min-h-[72px] leading-6 text-slate-600">
                    {pooja.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-2">
                      <Clock3 size={15} className="text-orange-600" />
                      {pooja.duration}
                    </span>
                    <span className="rounded-full bg-orange-50 px-3 py-2 font-bold text-orange-700">
                      {pooja.price}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-orange-100 pt-5">
                    <Link
                      href={`/temples/${pooja.temple.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-orange-700"
                    >
                      <MapPin size={15} />
                      View Temple
                    </Link>
                    <Link
                      href={`/poojas/${pooja.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-bold text-white transition hover:bg-orange-700"
                    >
                      View Pooja
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
