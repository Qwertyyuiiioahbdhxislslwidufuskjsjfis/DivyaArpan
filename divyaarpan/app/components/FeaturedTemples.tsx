import Link from "next/link";
import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";
import { prisma } from "../lib/prisma";

async function getFeaturedTemples() {
  const featuredTemples = await prisma.temple.findMany({
    where: { isFeatured: true },
    orderBy: { name: "asc" },
    take: 6,
  });

  if (featuredTemples.length > 0) return featuredTemples;

  return prisma.temple.findMany({
    orderBy: { name: "asc" },
    take: 6,
  });
}

export default async function FeaturedTemples() {
  const temples = await getFeaturedTemples();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Sacred destinations</span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">Featured temples</h2>
          <p className="mt-3 max-w-2xl text-gray-600">Discover the real temple listings managed in the DivyaArpan catalog.</p>
        </div>

        <Link href="/temples" className="font-semibold text-orange-600 transition hover:text-orange-700">
          View all temples →
        </Link>
      </div>

      {temples.length === 0 ? (
        <div className="rounded-[28px] border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-5xl">🛕</div>
          <h3 className="mt-5 text-2xl font-bold text-slate-900">Temples are being added</h3>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">The public temple catalog will appear here as active temple listings are added to the DivyaArpan database.</p>
        </div>
      ) : (
        <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => (
            <article key={temple.id} className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative overflow-hidden">
                <Image
                  src={temple.featuredImage}
                  alt={temple.name}
                  width={800}
                  height={420}
                  unoptimized
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {temple.isFeatured ? (
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-orange-600 px-3 py-1 text-[11px] font-semibold text-white">
                    <Sparkles size={12} />
                    Featured
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-bold text-gray-900">{temple.name}</h3>

                <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-orange-600" />
                  <span>{temple.city}, {temple.state}</span>
                </div>

                {temple.description ? (
                  <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">{temple.description}</p>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active listing</span>

                  <Link href={`/temples/${temple.slug}`} className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700">
                    Explore Temple
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}