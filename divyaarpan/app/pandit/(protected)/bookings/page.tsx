"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  date: string;
  time: string;
  devoteeName: string;
  mobile: string;
  language: string;
  address: string;
  status: string;
  paymentStatus: string;
  samagriRequired: boolean;
  amount: number | null;
  createdAt: string;
}

export default function PanditBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    try {
      const response = await fetch(
        "/api/pandit/dashboard"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load bookings."
        );
      }

      const activeBookings = data.assignedBookings || [];
      const completedBookings = data.completedBookings || [];

      setBookings([
        ...activeBookings,
        ...completedBookings,
      ]);
    } catch (error) {
      console.error("LOAD BOOKINGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadBookings);
  }, []);

  function statusLabel(status: string) {
    switch (status) {
      case "PANDIT_ASSIGNED":
        return "Pandit Assigned";

      case "CONFIRMED":
        return "Confirmed";

      case "AWAITING_PAYMENT":
        return "Awaiting Customer Payment";

      case "PANDIT_ON_THE_WAY":
        return "On the Way";

      case "IN_PROGRESS":
        return "In Progress";

      case "COMPLETED":
        return "Completed";

      default:
        return status.replaceAll("_", " ");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-xl font-semibold text-gray-800">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-700 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">

          <a
            href="/pandit/dashboard"
            className="inline-block mb-6 text-orange-100 hover:text-white"
          >
            ← Back to Dashboard
          </a>

          <p className="text-orange-100 font-semibold tracking-wide">
            DIVYAARPAN PARTNER PORTAL
          </p>

          <h1 className="text-4xl font-bold mt-2">
            My Bookings
          </h1>

          <p className="mt-3 text-orange-100">
            View and manage your assigned pooja bookings.
          </p>

        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Total Assigned
            </p>

            <p className="text-4xl font-bold text-gray-900 mt-2">
              {bookings.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Active Bookings
            </p>

            <p className="text-4xl font-bold text-orange-600 mt-2">
              {
                bookings.filter(
                  (booking) =>
                    booking.status !== "COMPLETED"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Completed
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {
                bookings.filter(
                  (booking) =>
                    booking.status === "COMPLETED"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">

            <div className="text-5xl mb-4">
              🙏
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Bookings Yet
            </h2>

            <p className="text-gray-600 mt-3">
                You don&apos;t have any assigned bookings at the moment.
            </p>

            <a
              href="/pandit/dashboard/requests"
              className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              View Booking Requests
            </a>

          </div>
        )}

        {/* Booking List */}
        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md p-7"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Booking ID
                  </p>

                  <h2 className="text-xl font-bold text-gray-900">
                    {booking.bookingId}
                  </h2>
                </div>

                <span className="inline-flex w-fit px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                  {statusLabel(booking.status)}
                </span>

              </div>

              <div className="border-t my-6" />

              <h3 className="text-2xl font-bold text-orange-700">
                {booking.service}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Devotee
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.devoteeName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Mobile
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.mobile}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Language
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.language}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.time}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className={`font-semibold ${booking.paymentStatus === "PAID" ? "text-green-700" : booking.paymentStatus === "FAILED" ? "text-red-700" : "text-orange-700"}`}>
                    {booking.paymentStatus === "PAID" ? "Paid" : booking.paymentStatus === "FAILED" ? "Payment failed - retry pending" : "Payment pending"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Pooja Samagri</p>
                  <p className="font-semibold text-gray-900">{booking.samagriRequired ? "Required" : "Not required"}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    Pooja Address
                  </p>

                  <p className="font-semibold text-gray-900">
                    {booking.address}
                  </p>
                </div>

              </div>

              {booking.amount !== null && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">
                  <p className="text-sm text-green-700">
                    DivyaArpan Booking Amount
                  </p>

                  <p className="text-2xl font-bold text-green-800 mt-1">
                    ₹{(booking.amount / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              )}


                <div className="mt-6 flex justify-end">
                  <a
                    href={`/pandit/bookings/${encodeURIComponent(booking.bookingId)}`}
                    className="inline-flex items-center rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-orange-700"
                  >
                    View Booking →
                  </a>
                </div>
            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
