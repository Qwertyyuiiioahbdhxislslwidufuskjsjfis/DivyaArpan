"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTemplePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    const data = {
      name: form.get("name"),
      slug: form.get("slug"),
      city: form.get("city"),
      state: form.get("state"),
      address: form.get("address"),
      description: form.get("description"),
      openingTime: form.get("openingTime"),
      closingTime: form.get("closingTime"),
      mapUrl: form.get("mapUrl"),
      featuredImage: form.get("featuredImage"),
      isFeatured: form.get("isFeatured") === "on",
    };

    try {
      const response = await fetch("/api/temples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to create temple");
      }

      router.push("/admin/temples");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the temple."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link
            href="/admin/temples"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Manage Temples
          </Link>

          <h1 className="text-4xl font-bold mt-5">
            Add New Temple
          </h1>

          <p className="mt-2 text-orange-100">
            Add a new temple to the DivyaArpan platform.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Temple Information
            </h2>

            <p className="text-gray-500 mt-1">
              Enter the basic details of the temple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Temple Name *
              </label>

              <input
                name="name"
                required
                placeholder="e.g. Shirdi Sai Baba Temple"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Slug *
              </label>

              <input
                name="slug"
                required
                placeholder="e.g. shirdi-sai-baba"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Use lowercase letters and hyphens only.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                City *
              </label>

              <input
                name="city"
                required
                placeholder="e.g. Shirdi"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                State *
              </label>

              <input
                name="state"
                required
                placeholder="e.g. Maharashtra"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Full Address *
            </label>

            <textarea
              name="address"
              required
              rows={3}
              placeholder="Enter the complete temple address"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Description *
            </label>

            <textarea
              name="description"
              required
              rows={5}
              placeholder="Write a short description about the temple..."
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Opening Time *
              </label>

              <input
                name="openingTime"
                required
                placeholder="e.g. 05:00 AM"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Closing Time *
              </label>

              <input
                name="closingTime"
                required
                placeholder="e.g. 10:00 PM"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Google Map URL *
            </label>

            <input
              name="mapUrl"
              required
              placeholder="Paste the Google Maps URL"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Featured Image URL *
            </label>

            <input
              name="featuredImage"
              required
              placeholder="Paste the temple image URL"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Image upload will be added later. For now, paste an image URL.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              className="w-5 h-5"
            />

            <span className="font-semibold">
              Show this temple as a Featured Temple
            </span>
          </label>

          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              {loading ? "Adding Temple..." : "Add Temple"}
            </button>

            <Link
              href="/admin/temples"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl text-center hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}