"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Languages,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

type PanditBooking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  address: string;
  language: string;
  date: string;
  time: string;
  sankalp: string | null;
  devoteeName: string;
  mobile: string;
  email: string | null;
  status: string;
  paymentStatus: string;
  panditId: number | null;
  panditName: string | null;
  amount: number | null;
  createdAt: string;
};

export default function AdminPanditBookingsPage() {
  const [bookings, setBookings] = useState<PanditBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchBookings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/pandit-bookings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load pandit bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("LOAD PANDIT BOOKINGS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load pandit bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const term = search.toLowerCase();

    return (
      booking.bookingId.toLowerCase().includes(term) ||
      booking.devoteeName.toLowerCase().includes(term) ||
      booking.mobile.toLowerCase().includes(term) ||
      booking.service.toLowerCase().includes(term) ||
      booking.city.toLowerCase().includes(term)
    );
  });

  const pendingBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Pending"
  ).length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "Paid"
  ).length;

  const assignedBookings = bookings.filter(
    (booking) => booking.panditName
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/25"
          >
            <ArrowLeft size={17} />
            Admin Dashboard
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
                DivyaArpan Admin
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                Pandit Bookings
              </h1>

              <p className="mt-3 text-orange-100">
                Manage Book My Pandit requests, payments and
                pandit assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
          />

          <StatCard
            title="Payment Pending"
            value={pendingBookings}
          />

          <StatCard
            title="Paid"
            value={paidBookings}
          />

          <StatCard
            title="Pandit Assigned"
            value={assignedBookings}
          />
        </div>

        {/* Search */}

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking ID, devotee, mobile, service or city..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-orange-500"
            />
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="mt-8 flex min-h-64 items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <Loader2
                size={36}
                className="mx-auto animate-spin text-orange-600"
              />

              <p className="mt-4 font-medium text-gray-600">
                Loading pandit bookings...
              </p>
            </div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBookings}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredBookings.length === 0 && (
            <div className="mt-8 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                No Pandit Bookings Found
              </h2>

              <p className="mt-2 text-gray-500">
                {search
                  ? "No bookings match your search."
                  : "New Book My Pandit bookings will appear here."}
              </p>
            </div>
          )}

        {/* Booking Cards */}

        {!loading &&
          !error &&
          filteredBookings.length > 0 && (
            <div className="mt-8 space-y-6">
              {filteredBookings.map((booking) => {
                const formattedDate = booking.date
                  ? new Date(
                      `${booking.date}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    {/* Booking Header */}

                    <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Booking ID
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-gray-900">
                          {booking.bookingId}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusBadge
                          label={booking.status}
                          type="booking"
                        />

                        <StatusBadge
                          label={booking.paymentStatus}
                          type="payment"
                        />
                      </div>
                    </div>

                    {/* Booking Body */}

                    <div className="grid gap-8 p-6 lg:grid-cols-[1fr_260px]">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {booking.service}
                        </h3>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                          <BookingDetail
                            icon={<UserRound size={18} />}
                            label="Devotee"
                            value={booking.devoteeName}
                          />

                          <BookingDetail
                            icon={<MapPin size={18} />}
                            label="City"
                            value={booking.city}
                          />

                          <BookingDetail
                            icon={<CalendarDays size={18} />}
                            label="Date"
                            value={formattedDate}
                          />

                          <BookingDetail
                            icon={<Clock3 size={18} />}
                            label="Time"
                            value={booking.time}
                          />

                          <BookingDetail
                            icon={<Languages size={18} />}
                            label="Language"
                            value={booking.language}
                          />

                          <BookingDetail
                            icon={<MapPin size={18} />}
                            label="Address"
                            value={booking.address}
                          />
                        </div>

                        <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Contact
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            {booking.mobile}
                          </p>

                          {booking.email && (
                            <p className="mt-1 text-sm text-gray-600">
                              {booking.email}
                            </p>
                          )}
                        </div>

                        {booking.sankalp && (
                          <div className="mt-5 rounded-2xl bg-orange-50 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                              Sankalp
                            </p>

                            <p className="mt-2 leading-6 text-gray-700">
                              {booking.sankalp}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Admin Summary */}

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <p className="text-sm font-bold text-gray-900">
                          Admin Summary
                        </p>

                        <div className="mt-5 space-y-5">
                          <AdminRow
                            label="Amount"
                            value={
                              booking.amount
                                ? `₹${(
                                    booking.amount / 100
                                  ).toLocaleString("en-IN")}`
                                : "Not Assigned"
                            }
                          />

                          <AdminRow
                            label="Pandit"
                            value={
                              booking.panditName ||
                              "Not Assigned"
                            }
                          />

                          <AdminRow
                            label="Payment"
                            value={booking.paymentStatus}
                          />
                        </div>

                        <Link
                          href={`/admin/pandit-bookings/${booking.bookingId}`}
                          className="mt-6 block w-full rounded-xl bg-orange-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-700"
                        >
                          Manage Booking
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function BookingDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-orange-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function AdminRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  label,
  type,
}: {
  label: string;
  type: "booking" | "payment";
}) {
  let classes =
    "bg-gray-100 text-gray-700";

  if (label === "Paid" || label === "Completed") {
    classes = "bg-green-100 text-green-700";
  } else if (
    label === "Pending" ||
    label === "Payment Pending"
  ) {
    classes = "bg-amber-100 text-amber-700";
  } else if (label === "Failed") {
    classes = "bg-red-100 text-red-700";
  } else if (
    label === "Pandit Assigned" ||
    label === "Confirmed"
  ) {
    classes = "bg-blue-100 text-blue-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${classes}`}
    >
      {type === "payment"
        ? `Payment: ${label}`
        : label}
    </span>
  );
}