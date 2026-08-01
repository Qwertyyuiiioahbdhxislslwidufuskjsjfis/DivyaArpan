"use client";

import Link from "next/link";
import { temples } from "../data/temples";

export default function FeaturedTemples() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <span className="text-orange-600 font-semibold uppercase tracking-wider">
            Sacred Destinations
          </span>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Featured Temples
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            Explore renowned temples across India and book authentic poojas
            performed by verified temple authorities.
          </p>
        </div>

        <Link
          href="/temples"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          View All Temples →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {temples.map((temple) => (
          <div
            key={temple.id}
            className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="relative overflow-hidden">
              <img
                src={temple.image}
                alt={temple.name}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                Featured
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {temple.name}
              </h3>

              <p className="mt-2 text-gray-500">
                📍 {temple.city}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-green-600 font-semibold">
                  Verified Temple
                </span>

                <Link
                  href={`/temples/${temple.id}`}
                  className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
                >
                  Book Pooja
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}