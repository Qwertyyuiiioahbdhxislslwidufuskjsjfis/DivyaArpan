"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Temple = {
  id: number;
  name: string;
  city: string;
};

export default function AddPoojaPage() {
  const router = useRouter();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTemples() {
      try {
        const response = await fetch("/api/temples");

        if (!response.ok) {
          throw new Error("Failed to load temples");
        }

        const data = await response.json();
        setTemples(data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load temples.");
      } finally {
        setLoadingTemples(false);
      }
    }

    loadTemples();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    const data = {
      templeId: Number(form.get("templeId")),
      name: form.get("name"),
      description: form.get("description"),
      duration: form.get("duration"),
      price: form.get("price"),
      image: form.get("image"),
      isActive: form.get("isActive") === "on",
    };

    try {
      const response = await fetch("/api/poojas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add pooja"
        );
      }

      router.push("/admin/poojas");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to add pooja."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="bg-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link
            href="/admin/poojas"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Manage Poojas
          </Link>

          <h1 className="text-4xl font-bold mt-5">
            Add New Pooja
          </h1>

          <p className="mt-2 text-orange-100">
            Add a pooja service to a temple on DivyaArpan.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-7"
        >
          {/* Temple */}

          <div>
            <label className="block font-semibold mb-2">
              Select Temple *
            </label>

            <select
              name="templeId"
              required
              disabled={loadingTemples}
              defaultValue=""
              className="w-full border rounded-xl px-4 py-3 bg-white"
            >
              <option value="" disabled>
                {loadingTemples
                  ? "Loading temples..."
                  : "Choose a temple"}
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

          {/* Pooja Name */}

          <div>
            <label className="block font-semibold mb-2">
              Pooja Name *
            </label>

            <input
              name="name"
              required
              placeholder="e.g. Devi Pooja"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* Description */}

          <div>
            <label className="block font-semibold mb-2">
              Description *
            </label>

            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe the pooja service..."
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Duration */}

            <div>
              <label className="block font-semibold mb-2">
                Duration *
              </label>

              <input
                name="duration"
                required
                placeholder="e.g. 30 Minutes"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* Price */}

            <div>
              <label className="block font-semibold mb-2">
                Price (₹) *
              </label>

              <input
                name="price"
                required
                type="number"
                min="0"
                placeholder="e.g. 501"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Image */}

          <div>
            <label className="block font-semibold mb-2">
              Pooja Image URL
            </label>

            <input
              name="image"
              placeholder="Optional for now"
              className="w-full border rounded-xl px-4 py-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Leave this blank for now if you do not have a genuine pooja image.
            </p>
          </div>

          {/* Active */}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="w-5 h-5"
            />

            <span className="font-semibold">
              Pooja is Active
            </span>
          </label>

          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-8 py-3 rounded-xl"
            >
              {saving ? "Adding Pooja..." : "Add Pooja"}
            </button>

            <Link
              href="/admin/poojas"
              className="border border-gray-300 px-8 py-3 rounded-xl text-center hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}