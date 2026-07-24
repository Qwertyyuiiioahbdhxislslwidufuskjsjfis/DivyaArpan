"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Temple = {
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  mapUrl: string;
  featuredImage: string;
  isFeatured: boolean;
};

export default function EditTemplePage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTemple() {
      try {
        const response = await fetch(`/api/temples/${slug}`);

        if (!response.ok) {
          throw new Error("Failed to load temple");
        }

        const data = await response.json();

        setTemple(data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load temple.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadTemple();
    }
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!temple) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/temples/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: temple.name,
          newSlug: temple.slug,
          city: temple.city,
          state: temple.state,
          address: temple.address,
          description: temple.description,
          openingTime: temple.openingTime,
          closingTime: temple.closingTime,
          mapUrl: temple.mapUrl,
          featuredImage: temple.featuredImage,
          isFeatured: temple.isFeatured,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update temple"
        );
      }

      router.push("/admin/temples");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update temple."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-xl text-orange-700 font-semibold">
          Loading temple...
        </p>
      </main>
    );
  }

  if (!temple) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Temple could not be loaded.
          </p>

          <Link
            href="/admin/temples"
            className="inline-block mt-5 text-orange-700 font-semibold"
          >
            ← Back to Manage Temples
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
            href="/admin/temples"
            className="text-orange-100 hover:text-white"
          >
            ← Back to Manage Temples
          </Link>

          <h1 className="text-4xl font-bold mt-5">
            Edit Temple
          </h1>

          <p className="mt-2 text-orange-100">
            Update {temple.name}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold">
              Temple Information
            </h2>

            <p className="text-gray-500 mt-1">
              Update the temple details below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Temple Name
              </label>

              <input
                value={temple.name}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    name: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Slug
              </label>

              <input
                value={temple.slug}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    slug: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                City
              </label>

              <input
                value={temple.city}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    city: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                State
              </label>

              <input
                value={temple.state}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    state: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Full Address
            </label>

            <textarea
              value={temple.address}
              onChange={(e) =>
                setTemple({
                  ...temple,
                  address: e.target.value,
                })
              }
              required
              rows={3}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              value={temple.description}
              onChange={(e) =>
                setTemple({
                  ...temple,
                  description: e.target.value,
                })
              }
              required
              rows={5}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Opening Time
              </label>

              <input
                value={temple.openingTime}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    openingTime: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Closing Time
              </label>

              <input
                value={temple.closingTime}
                onChange={(e) =>
                  setTemple({
                    ...temple,
                    closingTime: e.target.value,
                  })
                }
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Google Map URL
            </label>

            <input
              value={temple.mapUrl}
              onChange={(e) =>
                setTemple({
                  ...temple,
                  mapUrl: e.target.value,
                })
              }
              required
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Featured Image URL
            </label>

            <input
              value={temple.featuredImage}
              onChange={(e) =>
                setTemple({
                  ...temple,
                  featuredImage: e.target.value,
                })
              }
              required
              className="w-full border rounded-xl px-4 py-3"
            />

            {temple.featuredImage && (
              <div className="mt-5">
                <p className="font-semibold mb-2">
                  Image Preview
                </p>

                <img
                  src={temple.featuredImage}
                  alt={temple.name}
                  className="w-full max-w-lg h-64 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={temple.isFeatured}
              onChange={(e) =>
                setTemple({
                  ...temple,
                  isFeatured: e.target.checked,
                })
              }
              className="w-5 h-5"
            />

            <span className="font-semibold">
              Featured Temple
            </span>
          </label>

          {message && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-8 py-3 rounded-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/admin/temples"
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