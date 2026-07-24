import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import BookingStatusControl from "./BookingStatusControl";
const prisma = new PrismaClient();

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <Link
            href="/admin"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5">
            <h1 className="text-4xl font-bold">
              Manage Bookings
            </h1>

            <p className="mt-2 text-orange-100">
              View and manage devotee pooja bookings.
            </p>
          </div>
        </div>
      </section>

      {/* Booking List */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Bookings
          </h2>

          <span className="text-gray-600">
            Total: {bookings.length}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-5xl mb-4">
              📋
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              No Bookings Found
            </h3>

            <p className="text-gray-500 mt-2">
              Devotee bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-orange-700">
                          {booking.bookingId}
                        </h3>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            booking.status === "Paid" ||
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="text-lg font-semibold text-gray-800 mt-3">
                        {booking.pooja}
                      </p>

                      <p className="text-gray-600 mt-1">
                        🛕 {booking.temple}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-sm text-gray-500">
                        Amount
                      </p>

                      <p className="text-2xl font-bold text-green-700">
                        {booking.price}
                      </p>
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* Booking Details */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">
                        Devotee
                      </p>

                      <p className="font-semibold mt-1">
                        {booking.name}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        📱 {booking.mobile}
                      </p>

                      <p className="text-sm text-gray-600 mt-1 break-all">
                        ✉️ {booking.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Pooja Schedule
                      </p>

                      <p className="font-semibold mt-1">
                        📅 {booking.date}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        🕐 {booking.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Booking Details
                      </p>

                      <p className="font-semibold mt-1">
                        👥 {booking.devotees} Devotee
                        {booking.devotees !== 1 ? "s" : ""}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        ⏳ {booking.duration}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Booked On
                      </p>

                      <p className="font-semibold mt-1">
                        {booking.createdAt.toLocaleDateString(
                          "en-IN"
                        )}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {booking.createdAt.toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Sankalp */}
                  {booking.sankalp && (
                    <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-5">
                      <p className="text-sm font-semibold text-orange-700">
                        🙏 Sankalp / Mannat
                      </p>

                      <p className="text-gray-700 mt-2">
                        {booking.sankalp}
                      </p>
                    </div>
                  )}
                  <BookingStatusControl
  bookingId={booking.id}
  currentStatus={booking.status}
/>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}