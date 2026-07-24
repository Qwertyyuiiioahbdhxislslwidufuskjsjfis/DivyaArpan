"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Temple = {
  id: number;
  name: string;
  city: string;
  state: string;
};

type Gallery = {
  id: number;
  templeId: number;
  imageUrl: string;
  temple: Temple;
};

export default function AdminGalleryPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const [templeId, setTempleId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [templesResponse, galleryResponse] = await Promise.all([
        fetch("/api/temples", {
          cache: "no-store",
        }),
        fetch("/api/gallery", {
          cache: "no-store",
        }),
      ]);

      if (!templesResponse.ok) {
        throw new Error("Failed to load temples.");
      }

      if (!galleryResponse.ok) {
        throw new Error("Failed to load gallery images.");
      }

      const templesData = await templesResponse.json();
      const galleryData = await galleryResponse.json();

      const templeList = Array.isArray(templesData)
        ? templesData
        : templesData.temples || [];

      const galleryList = Array.isArray(galleryData)
        ? galleryData
        : galleryData.galleries || [];

      setTemples(templeList);
      setGalleries(galleryList);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load gallery."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!templeId) {
      setError("Please select a temple.");
      return;
    }

    if (!imageUrl.trim()) {
      setError("Please enter an image URL.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templeId: Number(templeId),
          imageUrl: imageUrl.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add gallery image."
        );
      }

      setImageUrl("");
      setMessage("Gallery image added successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to add gallery image."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(gallery: Gallery) {
    const confirmed = window.confirm(
      `Are you sure you want to delete this image from "${gallery.temple.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(gallery.id);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/gallery/${gallery.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete gallery image."
        );
      }

      setMessage("Gallery image deleted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete gallery image."
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
              Temple Gallery
            </h1>

            <p className="mt-2 text-orange-100">
              Add and manage gallery images for each temple.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Add Image */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Gallery Image
          </h2>

          <p className="text-gray-500 mt-2">
            Select a temple and enter the image URL.
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
                htmlFor="imageUrl"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https://example.com/temple-image.jpg"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-xl"
            >
              {saving ? "Adding..." : "+ Add Image"}
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

        {/* Gallery */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Gallery Images
            </h2>

            <span className="text-gray-600">
              Total: {galleries.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
              Loading gallery...
            </div>
          ) : galleries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <div className="text-5xl mb-4">
                🖼️
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                No Gallery Images
              </h3>

              <p className="text-gray-500 mt-2">
                Add the first temple gallery image above.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <img
                    src={gallery.imageUrl}
                    alt={gallery.temple.name}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-orange-700">
                      {gallery.temple.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      📍 {gallery.temple.city},{" "}
                      {gallery.temple.state}
                    </p>

                    <p className="text-xs text-gray-400 mt-4 break-all">
                      {gallery.imageUrl}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(gallery)
                      }
                      disabled={
                        deletingId === gallery.id
                      }
                      className="w-full mt-5 border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold py-2.5 rounded-xl"
                    >
                      {deletingId === gallery.id
                        ? "Deleting..."
                        : "Delete Image"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}