"use client";

import Link from "next/link";
import {
  Flower2,
  Sparkles,
  Flame,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const poojas = [
  {
    id: 1,
    title: "Ganesh Pooja",
    description:
      "Seek the blessings of Lord Ganesha for success, wisdom and prosperity.",
    icon: Flower2,
    color: "bg-orange-100 text-orange-600",
    href: "/booking?pooja=Ganesh%20Pooja",
  },
  {
    id: 2,
    title: "Rudrabhishek",
    description:
      "Sacred Abhishek of Lord Shiva for peace, health and spiritual growth.",
    icon: Flame,
    color: "bg-blue-100 text-blue-600",
    href: "/booking?pooja=Rudrabhishek",
  },
  {
    id: 3,
    title: "Satyanarayan Pooja",
    description:
      "Traditional family pooja performed for happiness and prosperity.",
    icon: HeartHandshake,
    color: "bg-rose-100 text-rose-600",
    href: "/booking?pooja=Satyanarayan%20Pooja",
  },
  {
    id: 4,
    title: "Navgrah Pooja",
    description:
      "Perform Navgrah rituals to bring harmony and positive energy.",
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-600",
    href: "/booking?pooja=Navgrah%20Pooja",
  },
];

export default function PopularPoojas() {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">

          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Sacred Rituals
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Popular Pooja Services
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Choose from our most requested poojas performed by verified
            pandits and trusted temples across India.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {poojas.map((pooja) => {
            const Icon = pooja.icon;

            return (
              <div
                key={pooja.id}
                className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${pooja.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {pooja.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-7">
                  {pooja.description}
                </p>

                <Link
                  href={pooja.href}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-orange-600 transition group-hover:gap-3"
                >
                  Book Now
                  <ArrowRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}