"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["Payment Pending", "Confirmed", "Completed", "Cancelled"];

type Props = { bookingId: string; currentStatus: string };

export default function AstrologyStatusControl({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus() {
    if (status === currentStatus) {
      setMessage("No status change selected.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/astrology-bookings/${encodeURIComponent(bookingId)}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update consultation status.");
      setMessage("Status updated successfully.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update consultation status.");
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border-t border-orange-100 pt-5">
      <p className="mb-2 text-sm font-semibold text-gray-700">Manage Consultation Status</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select value={status} onChange={(event) => { setStatus(event.target.value); setMessage(""); }} disabled={saving} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3">
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="button" onClick={updateStatus} disabled={saving} className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:bg-orange-300">
          {saving ? "Updating..." : "Update Status"}
        </button>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
