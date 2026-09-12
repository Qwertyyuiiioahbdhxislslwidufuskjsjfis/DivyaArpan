"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  MapPin,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";

type Booking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  address: string;
  language: string;
  date: string;
  time: string;
  devoteeName: string;
  mobile: string;
  status: string;
  paymentStatus: string;
  amount: number | null;
};

type PendingOffer = {
  id: number;
  bookingId: number;
  panditId: number;
  status: string;
  offeredAmount: number | null;
  offeredAt: string;
  expiresAt: string | null;
  booking: Booking;
};

type DashboardResponse = {
  pandit: {
    id: number;
    panditCode: string;
    name: string;
    rating: number;
    experienceYears: number;
    isOnline: boolean;
    verificationStatus: string;
  };

  statistics: {
    pendingOffers: number;
    assignedBookings: number;
    completedBookings: number;
    todayEarnings: number;
    totalEarnings: number;
  };

  pendingOffers: PendingOffer[];

  assignedBookings: Booking[];

  completedBookings: Booking[];
  unreadNotifications: number;
};

export default function PanditDashboard() {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "/api/pandit/dashboard",
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load dashboard."
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "PANDIT DASHBOARD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

async function toggleOnlineStatus() {
if (!data?.pandit) return;

const nextStatus = !data.pandit.isOnline;

try {
setError("");

const response = await fetch(
  `/api/pandits/${data.pandit.id}/online-status`,
  {
method: "PATCH",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
isOnline: nextStatus,
}),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(
result.message || "Unable to update online status."
  );
}

setData((current) => {
  if (!current) return current;

  return {
...current,
pandit: {
...current.pandit,
isOnline: result.pandit.isOnline,
},
  };
});
} catch (err) {
setError(
  err instanceof Error
? err.message
: "Unable to update online status."
);
}
  }


  if (loading) {

  return (
      <main className="min-h-screen bg-orange-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <Loader2
              size={40}
              className="mx-auto animate-spin text-orange-600"
            />

            <p className="mt-4 font-semibold text-gray-700">
              Loading Pandit Dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">

            <h1 className="text-2xl font-bold text-gray-900">
              Unable to Load Dashboard
            </h1>

            <p className="mt-4 text-gray-600">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-7 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Try Again
            </button>

          </div>
        </div>
      </main>
    );
  }

  const {
    pandit,
    statistics,
    pendingOffers,
    assignedBookings,
    unreadNotifications,
  } = data;

  const formatMoney = (
    amountInPaise: number
  ) => {
    return `₹${(
      amountInPaise / 100
    ).toLocaleString("en-IN")}`;
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white shadow-lg">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
                DivyaArpan Partner Portal
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Welcome, {pandit.name}
              </h1>

              <p className="mt-2 text-orange-100">
                Pandit Code:{" "}
                <span className="font-semibold text-white">
                  {pandit.panditCode}
                </span>
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <Link
                href="/pandit/profile"
                className="rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Profile
              </Link>

              <Link
                href="/pandit/notifications"
                className="relative rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Notifications
                {unreadNotifications > 0 && (
                  <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-white px-1.5 py-0.5 text-xs text-orange-700">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  pandit.isOnline
                    ? "bg-green-500/20 text-white"
                    : "bg-white/15 text-orange-100"
                }`}
              >

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    pandit.isOnline
                      ? "bg-green-300"
                      : "bg-gray-300"
                  }`}
                />

                {pandit.isOnline
                  ? "Online"
                  : "Offline"}

              </div>

              <button
                type="button"
                onClick={toggleOnlineStatus}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition ${
                  pandit.isOnline
                    ? "bg-white text-orange-700 hover:bg-orange-50"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {pandit.isOnline ? "Go Offline" : "Go Online"}
              </button>

              <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                {pandit.verificationStatus}
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* Main */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Statistics */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Pending Requests"
            value={statistics.pendingOffers}
            icon={<Clock3 size={22} />}
            href="/pandit/dashboard/requests"
          />

          <StatCard
            title="Active Bookings"
            value={statistics.assignedBookings}
            icon={<CalendarDays size={22} />}
            href="/pandit/bookings"
          />

          <StatCard
            title="Completed Poojas"
            value={statistics.completedBookings}
            icon={<CheckCircle2 size={22} />}
            href="/pandit/bookings"
          />

          <StatCard
            title="Rating"
            value={pandit.rating.toFixed(1)}
            icon={<Star size={22} />}
          />

        </div>

        {/* Earnings */}

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <IndianRupee size={22} />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Today&apos;s Earnings
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatMoney(
                    statistics.todayEarnings
                  )}
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Wallet size={22} />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Total Earnings
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatMoney(
                    statistics.totalEarnings
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Pending Requests */}

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Action Required
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Booking Requests
              </h2>

            </div>

            {pendingOffers.length > 0 && (
              <Link
                href="/pandit/dashboard/requests"
                className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                View All Requests
              </Link>
            )}

          </div>

          {pendingOffers.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-gray-200 p-8 text-center">

              <Clock3
                size={34}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 font-semibold text-gray-700">
                No pending booking requests
              </p>

              <p className="mt-1 text-sm text-gray-500">
                New requests will appear here when
                they are offered to you.
              </p>

            </div>
          ) : (
            <div className="mt-7 space-y-4">

              {pendingOffers
                .slice(0, 3)
                .map((offer) => (
                  <BookingRequestCard
                    key={offer.id}
                    offer={offer}
                    formatMoney={formatMoney}
                  />
                ))}

            </div>
          )}

        </div>

        {/* Upcoming Bookings */}

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                Your Schedule
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Upcoming Bookings
              </h2>

            </div>

            <Link
              href="/pandit/bookings"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View All Bookings
            </Link>

          </div>

          {assignedBookings.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-gray-200 p-8 text-center">

              <CalendarDays
                size={34}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 font-semibold text-gray-700">
                No upcoming bookings
              </p>

            </div>
          ) : (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">

              {assignedBookings
                .slice(0, 6)
                .map((booking) => (
                  <UpcomingBookingCard
                    key={booking.id}
                    booking={booking}
                    formatMoney={formatMoney}
                  />
                ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          {icon}
        </div>

      </div>

      <p className="mt-6 text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}

function BookingRequestCard({
  offer,
  formatMoney,
}: {
  offer: PendingOffer;
  formatMoney: (
    amount: number
  ) => string;
}) {
  const booking = offer.booking;

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            New Booking Request
          </p>

          <h3 className="mt-1 text-lg font-bold text-gray-900">
            {booking.service}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {booking.bookingId}
          </p>

        </div>

        {booking.amount !== null && (
          <div className="text-right">

            <p className="text-xs text-gray-500">
              DivyaArpan Booking Amount
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatMoney(
                booking.amount
              )}
            </p>

          </div>
        )}

      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">

        <Detail
          icon={<CalendarDays size={17} />}
          label="Date"
          value={booking.date}
        />

        <Detail
          icon={<Clock3 size={17} />}
          label="Time"
          value={booking.time}
        />

        <Detail
          icon={<MapPin size={17} />}
          label="Location"
          value={booking.city}
        />

        <Detail
          icon={<UserRound size={17} />}
          label="Devotee"
          value={booking.devoteeName}
        />

      </div>

      <div className="mt-5">

        <Link
          href="/pandit/dashboard/requests"
          className="inline-flex rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Review Request
        </Link>

      </div>

    </div>
  );
}

function UpcomingBookingCard({
  booking,
  formatMoney,
}: {
  booking: Booking;
  formatMoney: (
    amount: number
  ) => string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 p-5">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            {booking.status}
          </p>

          <h3 className="mt-1 font-bold text-gray-900">
            {booking.service}
          </h3>

        </div>

        {booking.amount && (
          <p className="font-bold text-gray-900">
            {formatMoney(booking.amount)}
          </p>
        )}

      </div>

      <div className="mt-5 space-y-3">

        <Detail
          icon={<CalendarDays size={17} />}
          label="Date"
          value={booking.date}
        />

        <Detail
          icon={<Clock3 size={17} />}
          label="Time"
          value={booking.time}
        />

        <Detail
          icon={<MapPin size={17} />}
          label="Location"
          value={booking.city}
        />

        <Detail
          icon={<UserRound size={17} />}
          label="Devotee"
          value={booking.devoteeName}
        />

      </div>

    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-gray-400">
        {icon}
      </div>

      <div>

        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="text-sm font-semibold text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}
