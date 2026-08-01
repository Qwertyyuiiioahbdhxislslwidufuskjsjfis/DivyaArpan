"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Languages,
} from "lucide-react";

const services = [
  "Ganesh Pooja",
  "Griha Pravesh",
  "Satyanarayan Pooja",
  "Rudrabhishek",
  "Navgrah Pooja",
  "Wedding Ceremony",
  "Mundan Sanskar",
  "Vastu Pooja",
];

export default function BookMyPandit() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              👳 Verified Pandit Services
            </span>

            <h2 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
              Book Trusted
              <span className="block text-orange-600">
                Pandits For Every Ritual
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether it's a home pooja, temple ritual, wedding,
              griha pravesh or Satyanarayan Katha, DivyaArpan
              connects you with experienced and verified pandits
              across India.
            </p>

            {/* Services */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2">

              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />

                  <span className="font-medium text-gray-700">
                    {service}
                  </span>
                </div>
              ))}

            </div>

            {/* Features */}

            <div className="mt-10 flex flex-wrap gap-4">

              <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                <ShieldCheck size={18} />
                Verified Pandits
              </div>

              <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                <Clock3 size={18} />
                On-Time Arrival
              </div>

              <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                <Languages size={18} />
                Multiple Languages
              </div>

            </div>

            {/* CTA */}

            <div className="mt-12">

              <Link
                href="/book-my-pandit"
                className="inline-flex items-center gap-3 rounded-2xl bg-orange-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-700"
              >
                Book My Pandit
                <ArrowRight size={20} />
              </Link>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl shadow-2xl">

              <Image
                src="/images/services/pandit.jpg"
                alt="Verified Pandit"
                width={700}
                height={850}
                className="h-[650px] w-full object-cover"
                priority
              />

            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-8 -left-8 rounded-3xl bg-white p-6 shadow-2xl">

              <div className="text-4xl font-bold text-orange-600">
                1000+
              </div>

              <p className="mt-2 font-semibold text-gray-700">
                Verified Pandits
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Available for home and temple poojas.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}