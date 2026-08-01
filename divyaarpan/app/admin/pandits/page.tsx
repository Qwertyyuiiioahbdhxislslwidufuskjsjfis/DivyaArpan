import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import PanditStatusActions from "./PanditStatusActions";

const prisma = new PrismaClient();

export default async function AdminPanditsPage() {
  /*
  |--------------------------------------------------------------------------
  | Fetch Pandits
  |--------------------------------------------------------------------------
  */

  const pandits = await prisma.pandit.findMany({
    include: {
      languages: true,
      services: true,
      serviceAreas: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Dashboard Statistics
  |--------------------------------------------------------------------------
  */

  const totalPandits = pandits.length;

  const verifiedPandits = pandits.filter(
    (pandit) =>
      pandit.verificationStatus === "VERIFIED"
  ).length;

  const onlinePandits = pandits.filter(
    (pandit) =>
      pandit.isActive && pandit.isOnline
  ).length;

  const pendingPandits = pandits.filter(
    (pandit) =>
      pandit.verificationStatus === "PENDING"
  ).length;

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/admin"
            className="inline-flex items-center text-orange-100 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold tracking-wide text-orange-100">
                PANDIT NETWORK
              </p>

              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                Manage Pandits
              </h1>

              <p className="mt-3 max-w-2xl text-orange-100">
                Add, verify and manage Pandits available
                through the DivyaArpan marketplace.
              </p>
            </div>

            <Link
              href="/admin/pandits/new"
              className="rounded-xl bg-white px-6 py-3 font-bold text-orange-700 shadow-lg transition hover:bg-orange-50"
            >
              + Add New Pandit
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}

      <section className="relative z-10 mx-auto -mt-5 max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Pandits */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Pandits
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalPandits}
            </p>
          </div>

          {/* Verified */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Verified
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {verifiedPandits}
            </p>
          </div>

          {/* Online */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Online Now
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {onlinePandits}
            </p>
          </div>

          {/* Pending */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Verification Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingPandits}
            </p>
          </div>
        </div>
      </section>

      {/* Pandit Network */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="font-semibold text-orange-600">
            NETWORK
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Registered Pandits
          </h2>

          <p className="mt-2 text-gray-600">
            View and manage Pandits registered with
            DivyaArpan.
          </p>
        </div>

        {/* Empty State */}

        {pandits.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-6xl">
              🧘
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              No Pandits Added Yet
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-gray-600">
              Start building the DivyaArpan Pandit
              network by adding your first verified
              Pandit.
            </p>

            <Link
              href="/admin/pandits/new"
              className="mt-7 inline-block rounded-xl bg-orange-600 px-7 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Add First Pandit
            </Link>
          </div>
        ) : (
          /*
          |--------------------------------------------------------------------------
          | Pandit Cards
          |--------------------------------------------------------------------------
          */

          <div className="space-y-5">
            {pandits.map((pandit) => (
              <div
                key={pandit.id}
                className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-lg ${
                  pandit.isActive
                    ? "border-orange-100"
                    : "border-red-200"
                }`}
              >
                {/* Inactive Pandit Warning */}

                {!pandit.isActive && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-red-800">
                          ⛔ Pandit Inactive
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                          This Pandit is currently
                          inactive and unavailable on
                          the DivyaArpan marketplace.
                        </p>

                        {pandit.deactivationReason && (
                          <p className="mt-2 text-sm text-red-800">
                            <strong>
                              Reason:
                            </strong>{" "}
                            {
                              pandit.deactivationReason
                            }
                          </p>
                        )}

                        {pandit.deactivationRemarks && (
                          <p className="mt-1 text-sm text-red-700">
                            <strong>
                              Remarks:
                            </strong>{" "}
                            {
                              pandit.deactivationRemarks
                            }
                          </p>
                        )}
                      </div>

                      {pandit.deactivatedAt && (
                        <p className="shrink-0 text-xs font-semibold text-red-600">
                          Deactivated:{" "}
                          {new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          ).format(
                            pandit.deactivatedAt
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Pandit Basic Information */}

                  <div className="flex items-start gap-5">
                    {/* Profile Image */}

                    {pandit.profileImage ? (
                      <img
                        src={pandit.profileImage}
                        alt={pandit.name}
                        className={`h-20 w-20 rounded-2xl object-cover ${
                          pandit.isActive
                            ? ""
                            : "opacity-60"
                        }`}
                      />
                    ) : (
                      <div
                        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                          pandit.isActive
                            ? "bg-orange-100"
                            : "bg-gray-100 opacity-60"
                        }`}
                      >
                        🧘
                      </div>
                    )}

                    <div>
                      {/* Name / Verification */}

                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {pandit.name}
                        </h3>

                        {/* Verification Status */}

                        {pandit.verificationStatus ===
                          "VERIFIED" && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            ✓ Verified
                          </span>
                        )}

                        {pandit.verificationStatus ===
                          "PENDING" && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            Verification Pending
                          </span>
                        )}

                        {pandit.verificationStatus ===
                          "REJECTED" && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            Rejected
                          </span>
                        )}

                        {pandit.verificationStatus ===
                          "SUSPENDED" && (
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                            Suspended
                          </span>
                        )}

                        {/* Active / Inactive */}

                        {pandit.isActive ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Pandit Code */}

                      <p className="mt-1 text-sm font-medium text-orange-600">
                        {pandit.panditCode}
                      </p>

                      {/* Location */}

                      <p className="mt-2 text-gray-600">
                        📍 {pandit.city},{" "}
                        {pandit.state}
                      </p>

                      {/* Experience / Rating / Bookings */}

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                        <span>
                          Experience:{" "}
                          <strong>
                            {
                              pandit.experienceYears
                            }{" "}
                            years
                          </strong>
                        </span>

                        <span>
                          ⭐{" "}
                          {pandit.rating.toFixed(
                            1
                          )}
                        </span>

                        <span>
                          {
                            pandit.totalBookings
                          }{" "}
                          bookings
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Languages / Services / Areas */}

                  <div className="grid gap-4 sm:grid-cols-3 lg:w-[520px]">
                    {/* Languages */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Languages
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {pandit.languages
                          .length > 0
                          ? pandit.languages
                              .map(
                                (item) =>
                                  item.language
                              )
                              .join(", ")
                          : "Not added"}
                      </p>
                    </div>

                    {/* Services */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Services
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {pandit.services
                          .length > 0
                          ? `${pandit.services.length} services`
                          : "Not added"}
                      </p>
                    </div>

                    {/* Service Areas */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Service Areas
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {pandit.serviceAreas
                          .length > 0
                          ? `${pandit.serviceAreas.length} areas`
                          : "Not added"}
                      </p>
                    </div>
                  </div>

                  {/* Marketplace Availability */}

                  <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-stretch">
                    {/* Online / Offline / Inactive */}

                    <span
                      className={`rounded-full px-4 py-2 text-center text-sm font-bold ${
                        !pandit.isActive
                          ? "bg-red-100 text-red-700"
                          : pandit.isOnline
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {!pandit.isActive
                        ? "⛔ Inactive"
                        : pandit.isOnline
                        ? "● Online"
                        : "○ Offline"}
                    </span>

                    {/* Immediate */}

                    {pandit.isActive &&
                      pandit.acceptsImmediate && (
                        <span className="rounded-full bg-orange-100 px-4 py-2 text-center text-xs font-semibold text-orange-700">
                          ⚡ Immediate
                        </span>
                      )}

                    {/* Scheduled */}

                    {pandit.isActive &&
                      pandit.acceptsScheduled && (
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-center text-xs font-semibold text-blue-700">
                          📅 Scheduled
                        </span>
                      )}
                  </div>

                  {/* Actions */}

                  <div className="flex gap-3 lg:w-[150px] lg:flex-col">
                    {/* Edit */}

                    <Link
                      href={`/admin/pandits/${pandit.id}/edit`}
                      className="rounded-xl bg-orange-600 px-5 py-2.5 text-center font-semibold text-white transition hover:bg-orange-700"
                    >
                      Edit
                    </Link>

                    {/* View */}

                    <Link
                      href={`/admin/pandits/${pandit.id}`}
                      className="rounded-xl border border-orange-200 px-5 py-2.5 text-center font-semibold text-orange-700 transition hover:bg-orange-50"
                    >
                      View
                    </Link>

                    {/* Deactivate / Reactivate */}

                    <PanditStatusActions
                      panditId={pandit.id}
                      panditName={pandit.name}
                      panditCode={
                        pandit.panditCode
                      }
                      isActive={
                        pandit.isActive
                      }
                      deactivationReason={
                        pandit.deactivationReason
                      }
                      deactivationRemarks={
                        pandit.deactivationRemarks
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
    
  );
}