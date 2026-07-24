"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  bookingId: string;
  temple: string;
  pooja: string;
  price: string;
  duration: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  devotees: string;
  sankalp: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedBookings =
      sessionStorage.getItem("divyaArpanBookings");

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  return (
    <main className="min-h-screen bg-orange-50 py-16 px-6">

      <section className="max-w-6xl mx-auto">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-orange-700">
            📜 My Bookings
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            View all your DivyaArpan bookings
          </p>

        </div>

        {bookings.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="text-7xl mb-6">
              🙏
            </div>

            <h2 className="text-3xl font-bold text-orange-700 mb-4">
              No Bookings Yet
            </h2>

            <p className="text-gray-600 mb-8">
              You haven't booked any pooja yet.
            </p>

            <Link
              href="/temples"
              className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700"
            >
              Explore Temples
            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {bookings
              .slice()
              .reverse()
              .map((booking) => (

              <div
                key={booking.bookingId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border"
              >

                <div className="bg-orange-600 text-white p-5">

                  <h2 className="text-2xl font-bold">
                    {booking.temple}
                  </h2>

                  <p className="mt-2">
                    {booking.pooja}
                  </p>

                </div>

                <div className="p-6 space-y-3">

                  <p>
                    <strong>Booking ID</strong><br />
                    {booking.bookingId}
                  </p>

                  <p>
                    <strong>Devotee</strong><br />
                    {booking.name}
                  </p>

                  <p>
                    <strong>Amount</strong><br />
                    {booking.price}
                  </p>

                  <p>
                    <strong>Date</strong><br />
                    {booking.date}
                  </p>

                  <p>
                    <strong>Time</strong><br />
                    {booking.time}
                  </p>

                  <p>
                    <strong>Payment</strong><br />
                    {booking.paymentStatus || "Pending"}
                  </p>

                  <div className="pt-4">

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      {booking.status}
                    </span>

                  </div>

                  <Link
                    href="/success"
                    className="block mt-6 text-center bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700"
                  >
                    View Receipt
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}