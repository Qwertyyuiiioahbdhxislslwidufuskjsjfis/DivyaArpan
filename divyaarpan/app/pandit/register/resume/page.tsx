"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DRAFT_KEY = "divyaarpan_pandit_registration_draft";

type Draft = {
  fields?: Record<string, string | boolean>;
  languages?: string[];
  services?: string[];
  serviceAreas?: unknown[];
  documents?: unknown[];
  scrollY?: number;
  savedAt?: string;
};

export default function ResumePanditRegistrationPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);

      if (saved) {
        setDraft(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Unable to read Pandit registration draft:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  function startNewRegistration() {
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = "/pandit/register";
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="text-center text-gray-600">
            Loading your registration...
          </div>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              🪔
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              No Saved Registration Found
            </h1>

            <p className="mt-4 text-gray-600">
              We could not find an incomplete Pandit registration on
              this device.
            </p>

            <Link
              href="/pandit/register"
              className="mt-8 inline-block rounded-xl bg-orange-600 px-8 py-3 font-bold text-white hover:bg-orange-700"
            >
              Start Registration
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fields = draft.fields || {};

  const name =
    typeof fields.name === "string" && fields.name.trim()
      ? fields.name
      : "Pandit";

  const completedFields = Object.values(fields).filter(
    (value) =>
      value !== "" &&
      value !== false &&
      value !== null &&
      value !== undefined
  ).length;

  const totalFields = Math.max(Object.keys(fields).length, 1);

  const progress = Math.min(
    100,
    Math.round((completedFields / totalFields) * 100)
  );

  const savedDate = draft.savedAt
    ? new Date(draft.savedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Recently";

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-8 shadow-xl md:p-10">

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              🪔
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              DivyaArpan Partner Portal
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-600">
              You have an incomplete Pandit registration saved on
              this device.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-6">
            <p className="text-sm font-semibold text-gray-500">
              Registration for
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {name}
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                  Saved progress
                </span>

                <span className="font-bold text-orange-700">
                  {progress}%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-orange-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Last saved: {savedDate}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/pandit/register"
              className="block w-full rounded-xl bg-orange-600 px-6 py-4 text-center font-bold text-white shadow-md hover:bg-orange-700"
            >
              Continue Registration
            </Link>

            <button
              type="button"
              onClick={startNewRegistration}
              className="block w-full rounded-xl border border-orange-300 px-6 py-4 font-bold text-orange-700 hover:bg-orange-50"
            >
              Start New Registration
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Your saved registration is stored on this device and
            browser.
          </p>
        </div>
      </div>
    </main>
  );
}
