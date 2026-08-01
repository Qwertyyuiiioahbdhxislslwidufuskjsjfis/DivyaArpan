"use client";

import Link from "next/link";
import { Search, Calendar, MapPin } from "lucide-react";

export default function FloatingSearch() {
  return (
    <section className="relative -mt-20 z-30 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white shadow-2xl border border-orange-100 p-6 lg:p-8">

          <div className="grid lg:grid-cols-4 gap-5">

            {/* Temple */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Temple
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-gray-200 px-4 py-4">
                <MapPin className="text-orange-600 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search Temple"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Pooja */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Pooja
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-gray-200 px-4 py-4">
                <Search className="text-orange-600 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search Pooja"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Preferred Date
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-gray-200 px-4 py-4">
                <Calendar className="text-orange-600 mr-3" size={20} />
                <input
                  type="date"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <div className="flex items-end">
              <Link
                href="/temples"
                className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 transition text-white font-semibold py-4 flex items-center justify-center gap-2 shadow-lg"
              >
                <Search size={20} />
                Search
              </Link>
            </div>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-sm text-gray-500">
              Popular:
            </span>

            {[
              "Siddhivinayak",
              "Mahalakshmi",
              "Shirdi",
              "Kashi Vishwanath",
            ].map((temple) => (
              <button
                key={temple}
                className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 transition"
              >
                {temple}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}