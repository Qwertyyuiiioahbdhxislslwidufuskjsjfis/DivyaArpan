"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingStatusControlProps = {
  bookingId: number;
  currentStatus: string;
};

const statuses = [
  "Payment Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function BookingStatusControl({
  bookingId,
  currentStatus,
}: BookingStatusControlProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpdate() {
    if (status === currentStatus) {
      setMessage("No status change selected.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking status."
        );
      }

      setMessage("Status updated successfully.");

      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update booking status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border-t pt-5">
      <p className="text-sm font-semibold text-gray-700 mb-2">
        Manage Booking Status
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setMessage("");
          }}
          disabled={saving}
          className="border border-gray-300 rounded-xl px-4 py-3 bg-white flex-1"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-xl"
        >
          {saving ? "Updating..." : "Update Status"}
        </button>
      </div>

      {message && (
        <p className="text-sm mt-3 text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}