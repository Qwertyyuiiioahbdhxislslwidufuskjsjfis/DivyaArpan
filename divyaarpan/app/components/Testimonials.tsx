"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    city: "Mumbai",
    review:
      "The booking process was seamless. The pandit arrived on time, performed the pooja with complete devotion, and explained every ritual beautifully.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Iyer",
    city: "Bengaluru",
    review:
      "We booked Satyanarayan Pooja through DivyaArpan. Everything was well organized and the experience felt authentic and peaceful.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    city: "Ahmedabad",
    review:
      "Finding a trusted pandit used to be difficult. DivyaArpan made the entire process simple and transparent.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-white to-orange-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Devotee Experiences
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Trusted by Devotees Across India
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600">
            Every pooja is performed with authenticity, transparency and
            devotion by verified temples and experienced pandits.
          </p>

        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex gap-1">

                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 text-gray-600 leading-8">
                "{testimonial.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-xl font-bold text-white">
                  {testimonial.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h3>

                  <p className="text-gray-500">
                    {testimonial.city}
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}