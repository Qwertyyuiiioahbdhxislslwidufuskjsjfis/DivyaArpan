"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ServiceArea = {
  id: number;
  city: string;
  area: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number | null;
};

type Pandit = {
  id: number;
  panditCode: string;
  name: string;
  city: string;
  state: string;
  isActive: boolean;
  verificationStatus: string;
  serviceAreas: ServiceArea[];
};

export default function PanditServiceAreasPage() {
  const params = useParams();
  const router = useRouter();

  const panditId = params.id as string;

  const [pandit, setPandit] =
    useState<Pandit | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [city, setCity] =
    useState("");

  const [area, setArea] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [serviceRadiusKm, setServiceRadiusKm] =
    useState("10");

  /*
  |--------------------------------------------------------------------------
  | Fetch Pandit
  |--------------------------------------------------------------------------
  */

  async function fetchPandit() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/pandits/${panditId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch Pandit."
        );
      }

      setPandit(data.pandit);

      /*
      | Use Pandit's city as default for
      | new service areas.
      */
      setCity((current) =>
        current || data.pandit.city || ""
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch Pandit."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (panditId) {
      fetchPandit();
    }
  }, [panditId]);

  /*
  |--------------------------------------------------------------------------
  | Add Service Area
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!city.trim()) {
      setError("City is required.");
      return;
    }

    if (!area.trim()) {
      setError("Area is required.");
      return;
    }

    if (
      pincode.trim() &&
      !/^[0-9]{6}$/.test(pincode.trim())
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    const radius = Number(
      serviceRadiusKm
    );

    if (
      !Number.isFinite(radius) ||
      radius <= 0
    ) {
      setError(
        "Service radius must be greater than 0 km."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/pandits/${panditId}/service-areas`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            city: city.trim(),
            area: area.trim(),

            pincode:
              pincode.trim() || null,

            serviceRadiusKm:
              radius,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add service area."
        );
      }

      setMessage(
        "Service area added successfully."
      );

      /*
      | Keep city because Pandits will
      | commonly add several areas in
      | the same city.
      */
      setArea("");
      setPincode("");
      setServiceRadiusKm("10");

      await fetchPandit();

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add service area."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service Area
  |--------------------------------------------------------------------------
  */

  async function deleteServiceArea(
    serviceArea: ServiceArea
  ) {
    const confirmed =
      window.confirm(
        `Remove ${serviceArea.area}, ${serviceArea.city} from this Pandit's service areas?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        serviceArea.id
      );

      setError("");
      setMessage("");

      const response = await fetch(
        `/api/pandits/${panditId}/service-areas/${serviceArea.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove service area."
        );
      }

      setMessage(
        "Service area removed successfully."
      );

      await fetchPandit();

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove service area."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-gray-600">
              Loading Pandit service
              areas...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Pandit Not Available
  |--------------------------------------------------------------------------
  */

  if (!pandit) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Pandit Not Available
            </h1>

            <p className="mt-3 text-red-600">
              {error ||
                "Unable to load Pandit details."}
            </p>

            <Link
              href="/admin/pandits"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white"
            >
              Back to Pandits
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href={`/admin/pandits/${pandit.id}`}
            className="text-orange-100 transition hover:text-white"
          >
            ← Back to Pandit Profile
          </Link>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold tracking-wide text-orange-100">
                PANDIT MARKETPLACE
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                Service Areas
              </h1>

              <p className="mt-3 text-orange-100">
                Define where this Pandit
                can provide pooja services.
              </p>
            </div>

            <Link
              href="/admin/pandits"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-orange-700 shadow"
            >
              Manage Pandits
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Pandit Summary */}

        <div className="mb-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {pandit.name}
                </h2>

                {pandit.verificationStatus ===
                  "VERIFIED" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ Verified
                  </span>
                )}

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

              <p className="mt-1 font-medium text-orange-600">
                {pandit.panditCode}
              </p>

              <p className="mt-2 text-gray-600">
                📍 {pandit.city},{" "}
                {pandit.state}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 px-6 py-4 text-center">
              <p className="text-sm font-medium text-gray-500">
                Service Areas
              </p>

              <p className="mt-1 text-3xl font-bold text-orange-700">
                {pandit.serviceAreas.length}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}

        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-semibold text-green-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Add Area */}

          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <p className="font-semibold text-orange-600">
                NEW AREA
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Add Service Area
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Add the areas where this
                Pandit is willing to travel
                for pooja bookings.
              </p>

              {/* City */}

              <div className="mt-6">
                <label className="block font-semibold text-gray-800">
                  City *
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  placeholder="Mumbai"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Area */}

              <div className="mt-5">
                <label className="block font-semibold text-gray-800">
                  Area / Locality *
                </label>

                <input
                  type="text"
                  value={area}
                  onChange={(event) =>
                    setArea(
                      event.target.value
                    )
                  }
                  placeholder="Ghatkopar East"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Pincode */}

              <div className="mt-5">
                <label className="block font-semibold text-gray-800">
                  Pincode
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(event) =>
                    setPincode(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="400075"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Radius */}

              <div className="mt-5">
                <label className="block font-semibold text-gray-800">
                  Service Radius (km) *
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={
                    serviceRadiusKm
                  }
                  onChange={(event) =>
                    setServiceRadiusKm(
                      event.target.value
                    )
                  }
                  placeholder="10"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Example: 10 km means
                  the Pandit can generally
                  accept bookings around
                  this locality within a
                  10 km radius.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-7 w-full rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {saving
                  ? "Adding..."
                  : "+ Add Service Area"}
              </button>
            </form>
          </div>

          {/* Existing Areas */}

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-orange-600">
                  COVERAGE
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Current Service Areas
                </h2>
              </div>

              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                {
                  pandit.serviceAreas
                    .length
                }{" "}
                areas
              </span>
            </div>

            {pandit.serviceAreas.length ===
            0 ? (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-6 py-12 text-center">
                <div className="text-4xl">
                  📍
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  No Service Areas Added
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Add the first locality
                  where this Pandit can
                  provide pooja services.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {pandit.serviceAreas.map(
                  (serviceArea) => (
                    <div
                      key={
                        serviceArea.id
                      }
                      className="rounded-2xl border border-gray-200 p-5 transition hover:border-orange-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            📍{" "}
                            {
                              serviceArea.area
                            }
                          </h3>

                          <p className="mt-1 text-gray-600">
                            {
                              serviceArea.city
                            }
                            {serviceArea.pincode
                              ? ` - ${serviceArea.pincode}`
                              : ""}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {serviceArea.serviceRadiusKm !==
                              null && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                Radius:{" "}
                                {
                                  serviceArea.serviceRadiusKm
                                }{" "}
                                km
                              </span>
                            )}

                            {serviceArea.latitude !==
                              null &&
                              serviceArea.longitude !==
                                null && (
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  Location
                                  mapped
                                </span>
                              )}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            serviceArea.id
                          }
                          onClick={() =>
                            deleteServiceArea(
                              serviceArea
                            )
                          }
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          serviceArea.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}