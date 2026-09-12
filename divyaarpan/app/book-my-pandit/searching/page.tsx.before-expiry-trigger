"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  UserRound,
} from "lucide-react";

type AssignedPandit = {
  name: string;
  experienceYears: number;
  rating: number;
};

function SearchingPanditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState(
    "Searching for nearby verified pandits..."
  );

  const [assignedPandit, setAssignedPandit] =
    useState<AssignedPandit | null>(null);
  const [noPanditAvailable, setNoPanditAvailable] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/pandit-bookings/${bookingId}/assigned`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data.status === "NO_PANDIT_AVAILABLE") {
          clearInterval(interval);
          setNoPanditAvailable(true);
          setStatus("No Pandit is currently available for this request.");
          return;
        }

        if (data.assigned) {
          setAssignedPandit(data.pandit);

          setStatus(
            `${data.pandit.name} accepted your booking`
          );

          clearInterval(interval);

          setTimeout(() => {
            router.push(
              `/book-my-pandit/payment?bookingId=${bookingId}`
            );
          }, 3000);
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId, router]);

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl">

        <div className="text-center">

          {noPanditAvailable ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                !
              </div>

              <h1 className="mt-8 text-3xl font-bold text-orange-700">
                No Pandit is currently available for this request.
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                Please try again with a different time or location.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                >
                  Try Again
                </button>
                <a
                  href="/book-my-pandit"
                  className="rounded-xl border border-orange-600 px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50"
                >
                  Back to Book My Pandit
                </a>
              </div>
            </>
          ) : !assignedPandit ? (
            <>
              <Loader2
                size={60}
                className="mx-auto animate-spin text-orange-600"
              />

              <h1 className="mt-8 text-3xl font-bold text-gray-900">
                Searching for a Verified Pandit
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                Please wait while nearby verified pandits
                receive your booking request.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2
                size={70}
                className="mx-auto text-green-600"
              />

              <h1 className="mt-8 text-3xl font-bold text-green-700">
                Pandit Accepted
              </h1>

              <div className="mt-8 rounded-2xl bg-green-50 p-6">

                <UserRound
                  size={55}
                  className="mx-auto text-green-700"
                />

                <h2 className="mt-4 text-2xl font-bold">
                  {assignedPandit.name}
                </h2>

                <p className="mt-2 text-gray-600">
                  Experience:{" "}
                  {assignedPandit.experienceYears} Years
                </p>

                <p className="mt-2 text-gray-600">
                  Rating ⭐ {assignedPandit.rating}
                </p>

                <p className="mt-4 font-semibold text-green-700">
                  Redirecting to payment...
                </p>
              </div>
            </>
          )}

          <div className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-left">

            <p className="font-semibold text-orange-700">
              Booking ID
            </p>

            <p className="mt-2 font-mono">
              {bookingId}
            </p>

            <div className="mt-8 space-y-4">

              <Step
                done
                title="Booking Created"
              />

              <Step
                done
                title="Finding Nearby Pandits"
              />

              <Step
                done={!!assignedPandit}
                loading={!assignedPandit}
                title={status}
              />

              <Step
                done={false}
                title="Payment"
              />

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function Step({
  title,
  done,
  loading,
}: {
  title: string;
  done?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      {loading ? (
        <Loader2
          size={20}
          className="animate-spin text-orange-600"
        />
      ) : done ? (
        <CheckCircle2
          size={20}
          className="text-green-600"
        />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
      )}

      <span>{title}</span>

    </div>
  );
}

export default function SearchingPanditPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl text-center">
            <Loader2
              size={50}
              className="mx-auto animate-spin text-orange-600"
            />
            <p className="mt-6 text-lg font-semibold text-gray-700">
              Loading pandit search...
            </p>
          </div>
        </main>
      }
    >
      <SearchingPanditPageContent />
    </Suspense>
  );
}
