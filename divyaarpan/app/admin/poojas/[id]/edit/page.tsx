"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Temple = {
  id: number;
  name: string;
  city: string;
};

type Pooja = {
  id: number;
  templeId: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  isActive: boolean;
};

export default function EditPoojaPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [pooja, setPooja] = useState<Pooja | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [poojaResponse, templesResponse] = await Promise.all([
          fetch(`/api/poojas/${id}`),
          fetch("/api/temples"),
        ]);

        if (!poojaResponse.ok) {
          throw new Error("Failed to load pooja.");
        }

        if (!templesResponse.ok) {
          throw new Error("Failed to load temples.");
        }

        const poojaData = await poojaResponse.json();
        const templesData = await templesResponse.json();

        setPooja(poojaData);
        setTemples(templesData);
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load pooja."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pooja) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/poojas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templeId: pooja.templeId,
          name: pooja.name,
          description: pooja.description,
          duration: pooja.duration,
          price: pooja.price,
          image: pooja.image,
          isActive: pooja.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update pooja."
        );
      }

      router.push("/admin/poojas");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update pooja."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!pooja) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${pooja.name}"?`
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/poojas/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete pooja."
        );
      }

      router.push("/admin/poojas");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete pooja."
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-xl font-semibold text-orange-700">
          Loading Pooja...
        </p>
      </main>
    );
  }

  if (!pooja) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Pooja could not be loaded.
          </h1>

          {message && (
            <p className="text-red-600 mt-3">
              {message}
            </p>
          )}

          <Link
            href="/admin/poojas"
            className="inline-block mt-6 text-orange-700 font-semibold"
          >
            ← Back to Manage Poojas
          </Link>
        </div>
      </main>
    );
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
            Edit Pooja
          </h1>

          <p className="mt-2 text-orange-100">
            Update {pooja.name}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-7"
        >
          <div>
            <label className="block font-semibold mb-2">
              Temple *
            </label>

            <select
              value={pooja.templeId}
              onChange={(e) =>
                setPooja({
                  ...pooja,
                  templeId: Number(e.target.value),
                })
              }
              required
              className="w-full border rounded-xl px-4 py-3 bg-white"
            >
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
            <label className="block font-semibold mb-2">
              Pooja Name *
            </label>

            <input
              value={pooja.name}
              onChange={(e) =>
                setPooja({
                  ...pooja,
                  name: e.target.value,
                })
              }
              required
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Description *
            </label>

            <textarea
              value={pooja.description}
              onChange={(e) =>
                setPooja({
                  ...pooja,
                  description: e.target.value,
                })
              }
              required
              rows={4}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Duration *
              </label>

              <input
                value={pooja.duration}
                onChange={(e) =>
                  setPooja({
                    ...pooja,
                    duration: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Price (₹) *
              </label>

              <input
                type="number"
                min="0"
                value={pooja.price}
                onChange={(e) =>
                  setPooja({
                    ...pooja,
                    price: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Pooja Image URL
            </label>

            <input
              value={pooja.image}
              onChange={(e) =>
                setPooja({
                  ...pooja,
                  image: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />

            {pooja.image && (
              <img
                src={pooja.image}
                alt={pooja.name}
                className="mt-5 w-full max-w-md h-56 object-cover rounded-xl border"
              />
            )}
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={pooja.isActive}
              onChange={(e) =>
                setPooja({
                  ...pooja,
                  isActive: e.target.checked,
                })
              }
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

          <div className="border-t pt-7 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving || deleting}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-8 py-3 rounded-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/admin/poojas"
              className="border border-gray-300 px-8 py-3 rounded-xl text-center hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="sm:ml-auto bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-8 py-3 rounded-xl"
            >
              {deleting ? "Deleting..." : "Delete Pooja"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}