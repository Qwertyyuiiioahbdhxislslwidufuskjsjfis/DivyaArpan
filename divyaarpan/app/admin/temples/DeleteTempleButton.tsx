"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteTempleButtonProps = {
  slug: string;
  templeName: string;
};

export default function DeleteTempleButton({
  slug,
  templeName,
}: DeleteTempleButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${templeName}"?\n\nThis will also delete its associated poojas, gallery images and facilities.\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/temples/${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete temple."
        );
      }

      router.refresh();
    } catch (err) {
      console.error("DELETE TEMPLE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete temple."
      );

      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="w-full rounded-lg bg-red-600 px-5 py-2 text-center font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="mt-2 max-w-40 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}