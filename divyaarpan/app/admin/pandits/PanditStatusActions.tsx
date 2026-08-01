"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PanditStatusActionsProps = {
  panditId: number;
  panditName: string;
  panditCode: string;
  isActive: boolean;
  deactivationReason: string | null;
  deactivationRemarks: string | null;
};

const DEACTIVATION_REASONS = [
  "Devotee complaint",
  "Document / identity issue",
  "Service quality issue",
  "Pandit requested temporary deactivation",
  "Policy violation",
  "Unable to contact",
  "Other",
];

export default function PanditStatusActions({
  panditId,
  panditName,
  panditCode,
  isActive,
  deactivationReason,
  deactivationRemarks,
}: PanditStatusActionsProps) {
  const router = useRouter();

  const [showDeactivateModal, setShowDeactivateModal] =
    useState(false);

  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Close Deactivation Modal
  |--------------------------------------------------------------------------
  */

  function closeModal() {
    if (submitting) {
      return;
    }

    setShowDeactivateModal(false);
    setReason("");
    setRemarks("");
    setConfirmation("");
    setError("");
  }

  /*
  |--------------------------------------------------------------------------
  | Deactivate Pandit
  |--------------------------------------------------------------------------
  */

  async function deactivatePandit() {
    if (!reason) {
      setError(
        "Please select a reason for deactivation."
      );
      return;
    }

    if (confirmation !== "DEACTIVATE") {
      setError(
        "Please type DEACTIVATE to confirm."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `/api/pandits/${panditId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            action: "DEACTIVATE",
            reason,
            remarks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to deactivate Pandit."
        );
      }

      closeModal();

      /*
      |--------------------------------------------------------------------------
      | Refresh Server Component
      |--------------------------------------------------------------------------
      */

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate Pandit."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Reactivate Pandit
  |--------------------------------------------------------------------------
  */

  async function reactivatePandit() {
    const confirmed = window.confirm(
      `Reactivate ${panditName} (${panditCode})?\n\nThe Pandit will become Active again but will remain Offline until they go online.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `/api/pandits/${panditId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            action: "REACTIVATE",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reactivate Pandit."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to reactivate Pandit."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Active Pandit
  |--------------------------------------------------------------------------
  */

  if (isActive) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setError("");
            setShowDeactivateModal(true);
          }}
          className="rounded-xl border border-red-200 px-5 py-2.5 text-center font-semibold text-red-600 transition hover:bg-red-50"
        >
          Deactivate
        </button>

        {showDeactivateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              {/* Modal Header */}

              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-red-600">
                      Pandit Management
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      Deactivate Pandit
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {panditName} • {panditCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}

              <div className="space-y-6 px-6 py-6 sm:px-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-bold text-amber-900">
                    What happens after deactivation?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    The Pandit will become inactive and
                    will automatically be taken offline.
                    Their profile, verification status,
                    documents and historical records will
                    remain preserved.
                  </p>
                </div>

                {/* Reason */}

                <div>
                  <label
                    htmlFor={`reason-${panditId}`}
                    className="block font-bold text-gray-800"
                  >
                    Reason for deactivation{" "}
                    <span className="text-red-600">*</span>
                  </label>

                  <select
                    id={`reason-${panditId}`}
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value)
                    }
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      Select reason
                    </option>

                    {DEACTIVATION_REASONS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Remarks */}

                <div>
                  <label
                    htmlFor={`remarks-${panditId}`}
                    className="block font-bold text-gray-800"
                  >
                    Additional remarks
                  </label>

                  <textarea
                    id={`remarks-${panditId}`}
                    value={remarks}
                    onChange={(event) =>
                      setRemarks(event.target.value)
                    }
                    disabled={submitting}
                    maxLength={1000}
                    rows={4}
                    placeholder="Add any additional Admin notes..."
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {remarks.length}/1000
                  </p>
                </div>

                {/* Authentication Confirmation */}

                <div>
                  <label
                    htmlFor={`confirmation-${panditId}`}
                    className="block font-bold text-gray-800"
                  >
                    Confirmation{" "}
                    <span className="text-red-600">*</span>
                  </label>

                  <p className="mt-1 text-sm text-gray-500">
                    Type{" "}
                    <strong className="text-gray-800">
                      DEACTIVATE
                    </strong>{" "}
                    below to confirm this action.
                  </p>

                  <input
                    id={`confirmation-${panditId}`}
                    type="text"
                    value={confirmation}
                    onChange={(event) =>
                      setConfirmation(
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    autoComplete="off"
                    placeholder="Type DEACTIVATE"
                    className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deactivatePandit}
                  disabled={
                    submitting ||
                    !reason ||
                    confirmation !== "DEACTIVATE"
                  }
                  className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {submitting
                    ? "Deactivating..."
                    : "Deactivate Pandit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Inactive Pandit
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-red-200 bg-red-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-red-600">
          Inactive
        </p>

        {deactivationReason && (
          <p className="mt-1 text-sm font-semibold text-red-800">
            {deactivationReason}
          </p>
        )}

        {deactivationRemarks && (
          <p className="mt-1 max-w-[220px] text-xs leading-5 text-red-700">
            {deactivationRemarks}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={reactivatePandit}
        disabled={submitting}
        className="w-full rounded-xl bg-green-600 px-5 py-2.5 text-center font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
      >
        {submitting
          ? "Reactivating..."
          : "Reactivate"}
      </button>
    </div>
  );
}