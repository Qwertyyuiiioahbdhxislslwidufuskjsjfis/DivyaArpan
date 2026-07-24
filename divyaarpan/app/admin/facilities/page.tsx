"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Temple = {
  id: number;
  name: string;
  city: string;
  state: string;
};

type Facility = {
  id: number;
  templeId: number;
  facility: string;
  temple: Temple;
};

export default function AdminFacilitiesPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [templeId, setTempleId] = useState("");
  const [facility, setFacility] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [templesResponse, facilitiesResponse] =
        await Promise.all([
          fetch("/api/temples", {
            cache: "no-store",
          }),
          fetch("/api/facilities", {
            cache: "no-store",
          }),
        ]);

      if (!templesResponse.ok) {
        throw new Error("Failed to load temples.");
      }

      if (!facilitiesResponse.ok) {
        throw new Error("Failed to load facilities.");
      }

      const templesData = await templesResponse.json();
      const facilitiesData = await facilitiesResponse.json();

      const templeList = Array.isArray(templesData)
        ? templesData
        : templesData.temples || [];

      const facilityList = Array.isArray(facilitiesData)
        ? facilitiesData
        : facilitiesData.facilities || [];

      setTemples(templeList);
      setFacilities(facilityList);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load facilities."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!templeId) {
      setError("Please select a temple.");
      return;
    }

    if (!facility.trim()) {
      setError("Please enter a facility.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templeId: Number(templeId),
          facility: facility.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add facility."
        );
      }

      setFacility("");
      setMessage("Facility added successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to add facility."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Facility) {
    const confirmed = window.confirm(
      `Delete "${item.facility}" from "${item.temple.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/facilities/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete facility."
        );
      }

      setMessage("Facility deleted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete facility."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-orange-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link
            href="/admin"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5">
            <h1 className="text-4xl font-bold">
              Temple Facilities
            </h1>

            <p className="mt-2 text-orange-100">
              Add and manage facilities available at each temple.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Add Facility */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Facility
          </h2>

          <p className="text-gray-500 mt-2">
            Select a temple and enter the facility available
            for devotees.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid lg:grid-cols-[1fr_2fr_auto] gap-4 items-end"
          >
            <div>
              <label
                htmlFor="templeId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Temple
              </label>

              <select
                id="templeId"
                value={templeId}
                onChange={(event) =>
                  setTempleId(event.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
              >
                <option value="">
                  Select Temple
                </option>

                {temples.map((temple) => (
                  <option
                    key={temple.id}
                    value={temple.id}
                  >
                    {temple.name} - {temple.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="facility"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Facility
              </label>

              <input
                id="facility"
                type="text"
                value={facility}
                onChange={(event) =>
                  setFacility(event.target.value)
                }
                placeholder="Example: Parking"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-xl"
            >
              {saving ? "Adding..." : "+ Add Facility"}
            </button>
          </form>

          {message && (
            <p className="mt-5 bg-green-50 text-green-700 border border-green-200 rounded-xl px-4 py-3">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-5 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Facilities List */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Facilities
            </h2>

            <span className="text-gray-600">
              Total: {facilities.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
              Loading facilities...
            </div>
          ) : facilities.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <div className="text-5xl mb-4">
                🏛️
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                No Facilities
              </h3>

              <p className="text-gray-500 mt-2">
                Add the first temple facility above.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {facilities.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      🏛️
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.facility}
                      </h3>

                      <p className="text-orange-700 font-semibold mt-2">
                        {item.temple.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        📍 {item.temple.city},{" "}
                        {item.temple.state}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="w-full mt-5 border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold py-2.5 rounded-xl"
                  >
                    {deletingId === item.id
                      ? "Deleting..."
                      : "Delete Facility"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}