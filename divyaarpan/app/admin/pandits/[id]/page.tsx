"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Language = {
  id: number;
  language: string;
};

type Service = {
  id: number;
  serviceName: string;
  basePrice: number | null;
  durationMinutes: number | null;
  isActive: boolean;
};

type ServiceArea = {
  id: number;
  city: string;
  area: string;
  pincode: string | null;
  serviceRadiusKm: number | null;
};

type Document = {
  id: number;
  documentType: string;
  documentUrl: string;
  documentNumber: string | null;
  isVerified: boolean;
  createdAt: string;
};

type Pandit = {
  id: number;
  panditCode: string;

  name: string;
  mobile: string;
  email: string | null;

  profileImage: string | null;

  gender: string | null;
  dateOfBirth: string | null;

  experienceYears: number;
  bio: string | null;

  city: string;
  state: string;
  country: string;

  address: string | null;
  pincode: string | null;

  verificationStatus: string;

  isActive: boolean;
  isOnline: boolean;

  acceptsImmediate: boolean;
  acceptsScheduled: boolean;

  rating: number;
  totalRatings: number;
  totalBookings: number;

  createdAt: string;

  languages: Language[];
  services: Service[];
  serviceAreas: ServiceArea[];
  documents: Document[];
};

/*
|--------------------------------------------------------------------------
| Document Label
|--------------------------------------------------------------------------
*/

function documentLabel(type: string) {
  const labels: Record<string, string> = {
    GOVERNMENT_ID: "Government Photo ID",
    PAN_CARD: "PAN Card",
    ADDRESS_PROOF: "Address Proof",
    POLICE_VERIFICATION:
      "Police / Background Verification",
    QUALIFICATION_CERTIFICATE:
      "Pandit / Pooja Qualification",
    REFERENCE_PROOF:
      "Temple / Guru / Organisation Reference",
    PARTNER_AGREEMENT:
      "DivyaArpan Pandit Partner Agreement",
  };

  return (
    labels[type] ||
    type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      )
  );
}

/*
|--------------------------------------------------------------------------
| Price Formatter
|--------------------------------------------------------------------------
*/

function formatPrice(paise: number | null) {
  if (paise === null) {
    return "Price not added";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

function formatDate(date: string | null) {
  if (!date) {
    return "Not added";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/*
|--------------------------------------------------------------------------
| Pandit Details Page
|--------------------------------------------------------------------------
*/

export default function PanditDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [pandit, setPandit] =
    useState<Pandit | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Document Verification State
  |--------------------------------------------------------------------------
  */

  const [
    verifyingDocumentId,
    setVerifyingDocumentId,
  ] = useState<number | null>(null);

  const [
    verificationMessage,
    setVerificationMessage,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Final Approval State
  |--------------------------------------------------------------------------
  */

  const [approving, setApproving] =
    useState(false);

  const [
    approvalMessage,
    setApprovalMessage,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Pandit
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadPandit() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/pandits/${id}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load Pandit."
          );
        }

        setPandit(data.pandit);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load Pandit."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPandit();
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Verify Document
  |--------------------------------------------------------------------------
  */

  async function verifyDocument(
    documentId: number
  ) {
    if (!pandit) {
      return;
    }

    try {
      setVerifyingDocumentId(
        documentId
      );

      setVerificationMessage("");
      setApprovalMessage("");
      setError("");

      const response = await fetch(
        `/api/pandits/${pandit.id}/documents/${documentId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            isVerified: true,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to verify document."
        );
      }

      setPandit(
        (currentPandit) => {
          if (!currentPandit) {
            return currentPandit;
          }

          return {
            ...currentPandit,

            documents:
              currentPandit.documents.map(
                (document) =>
                  document.id ===
                  documentId
                    ? {
                        ...document,
                        isVerified:
                          true,
                      }
                    : document
              ),
          };
        }
      );

      setVerificationMessage(
        "Document verified successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to verify document."
      );
    } finally {
      setVerifyingDocumentId(
        null
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Pandit
  |--------------------------------------------------------------------------
  */

  async function approvePandit() {
    if (!pandit) {
      return;
    }

    const confirmed = window.confirm(
      `Approve ${pandit.name} as a verified DivyaArpan Pandit?\n\nPlease confirm that you have reviewed the Pandit's profile and required documents.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setApproving(true);
      setError("");
      setApprovalMessage("");
      setVerificationMessage("");

      const response = await fetch(
        `/api/pandits/${pandit.id}/approve`,
        {
          method: "PATCH",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to approve Pandit."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Update Pandit Status Locally
      |--------------------------------------------------------------------------
      */

      setPandit(
        (currentPandit) => {
          if (!currentPandit) {
            return currentPandit;
          }

          return {
            ...currentPandit,
            verificationStatus:
              "VERIFIED",
          };
        }
      );

      setApprovalMessage(
        "Pandit approved successfully. The Pandit is now verified on DivyaArpan."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to approve Pandit."
      );
    } finally {
      setApproving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-orange-700">
              Loading Pandit
              details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error && !pandit) {
    return (
      <main className="min-h-screen bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-bold text-red-600">
              Unable to load Pandit
            </h1>

            <p className="mt-3 text-gray-600">
              {error}
            </p>

            <Link
              href="/admin/pandits"
              className="mt-6 inline-block font-semibold text-orange-700"
            >
              ← Back to Manage
              Pandits
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!pandit) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Verification Counters
  |--------------------------------------------------------------------------
  */

  const verifiedDocuments =
    pandit.documents.filter(
      (document) =>
        document.isVerified
    ).length;

  const totalDocuments =
    pandit.documents.length;

  const allDocumentsVerified =
    totalDocuments > 0 &&
    verifiedDocuments ===
      totalDocuments;

  /*
  |--------------------------------------------------------------------------
  | Required Document Check
  |--------------------------------------------------------------------------
  */

  const requiredDocumentTypes = [
    "GOVERNMENT_ID",
    "PAN_CARD",
    "ADDRESS_PROOF",
  ];

  const requiredDocumentsVerified =
    requiredDocumentTypes.every(
      (requiredType) =>
        pandit.documents.some(
          (document) =>
            document.documentType ===
              requiredType &&
            document.isVerified
        )
    );

  const isPanditVerified =
    pandit.verificationStatus ===
    "VERIFIED";

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/admin/pandits"
            className="font-medium text-orange-100 transition hover:text-white"
          >
            ← Back to Manage
            Pandits
          </Link>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-semibold tracking-wide text-orange-100">
                PANDIT PROFILE
              </p>

              <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                {pandit.name}
              </h1>

              <p className="mt-2 text-orange-100">
                {
                  pandit.panditCode
                }
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge
                  status={
                    pandit.verificationStatus
                  }
                />

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  {pandit.isOnline
                    ? "● Online"
                    : "○ Offline"}
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  {pandit.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            <Link
              href={`/admin/pandits/${pandit.id}/edit`}
              className="rounded-xl bg-white px-6 py-3 text-center font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              Edit Pandit
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* Messages */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            {error}
          </div>
        )}

        {verificationMessage && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 font-semibold text-green-700">
            ✓{" "}
            {
              verificationMessage
            }
          </div>
        )}

        {approvalMessage && (
          <div className="rounded-2xl border border-green-300 bg-green-50 p-5 font-semibold text-green-800">
            ✓ {approvalMessage}
          </div>
        )}

        {/* Summary */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Experience"
            value={`${pandit.experienceYears} years`}
          />

          <SummaryCard
            label="Rating"
            value={`${pandit.rating.toFixed(
              1
            )} ⭐`}
          />

          <SummaryCard
            label="Bookings"
            value={String(
              pandit.totalBookings
            )}
          />

          <SummaryCard
            label="Documents Verified"
            value={`${verifiedDocuments}/${totalDocuments}`}
          />
        </div>

        {/* Personal Information */}

        <SectionCard
          title="Personal Information"
          subtitle="Pandit identity and contact information."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="Full Name"
              value={pandit.name}
            />

            <Detail
              label="Mobile"
              value={pandit.mobile}
            />

            <Detail
              label="Email"
              value={
                pandit.email ||
                "Not added"
              }
            />

            <Detail
              label="Gender"
              value={
                pandit.gender ||
                "Not added"
              }
            />

            <Detail
              label="Date of Birth"
              value={formatDate(
                pandit.dateOfBirth
              )}
            />

            <Detail
              label="Experience"
              value={`${pandit.experienceYears} years`}
            />
          </div>

          {pandit.bio && (
            <div className="mt-7 border-t border-gray-100 pt-6">
              <p className="text-sm font-semibold text-gray-500">
                About Pandit
              </p>

              <p className="mt-2 leading-7 text-gray-700">
                {pandit.bio}
              </p>
            </div>
          )}
        </SectionCard>

        {/* Location */}

        <SectionCard
          title="Location"
          subtitle="Primary address and operating location."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="City"
              value={pandit.city}
            />

            <Detail
              label="State"
              value={pandit.state}
            />

            <Detail
              label="Country"
              value={
                pandit.country
              }
            />

            <Detail
              label="Pincode"
              value={
                pandit.pincode ||
                "Not added"
              }
            />

            <div className="md:col-span-2">
              <Detail
                label="Address"
                value={
                  pandit.address ||
                  "Not added"
                }
              />
            </div>
          </div>
        </SectionCard>

        {/* Languages */}

        <SectionCard
          title="Languages"
          subtitle="Languages available for Pooja and devotee communication."
        >
          {pandit.languages
            .length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {pandit.languages.map(
                (language) => (
                  <span
                    key={
                      language.id
                    }
                    className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-semibold text-orange-700"
                  >
                    {
                      language.language
                    }
                  </span>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No languages added." />
          )}
        </SectionCard>

        {/* Services */}

        <SectionCard
          title="Pooja Services"
          subtitle="Services offered by this Pandit."
        >
          {pandit.services
            .length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pandit.services.map(
                (service) => (
                  <div
                    key={
                      service.id
                    }
                    className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {
                            service.serviceName
                          }
                        </h3>

                        <p className="mt-2 text-xl font-bold text-orange-700">
                          {formatPrice(
                            service.basePrice
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          service.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                      Duration:{" "}
                      {service.durationMinutes
                        ? `${service.durationMinutes} minutes`
                        : "Not added"}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No Pooja services added." />
          )}
        </SectionCard>

        {/* Service Areas */}

        <SectionCard
          title="Service Areas"
          subtitle="Areas where this Pandit can provide at-home services."
        >
          {pandit.serviceAreas
            .length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pandit.serviceAreas.map(
                (area) => (
                  <div
                    key={area.id}
                    className="rounded-2xl border border-gray-200 p-5"
                  >
                    <h3 className="font-bold text-gray-900">
                      {area.area}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {area.city}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        Pincode:{" "}
                        {area.pincode ||
                          "Not added"}
                      </span>

                      <span>
                        Radius:{" "}
                        {area.serviceRadiusKm
                          ? `${area.serviceRadiusKm} km`
                          : "Not added"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No service areas added yet." />
          )}
        </SectionCard>

        {/* Booking Preferences */}

        <SectionCard
          title="Booking Preferences"
          subtitle="Types of marketplace bookings this Pandit accepts."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <PreferenceCard
              icon="⚡"
              title="Immediate Booking"
              enabled={
                pandit.acceptsImmediate
              }
            />

            <PreferenceCard
              icon="📅"
              title="Scheduled Booking"
              enabled={
                pandit.acceptsScheduled
              }
            />
          </div>
        </SectionCard>

        {/* Documents */}

        <SectionCard
          title="Documents & Verification"
          subtitle="Review each document before verifying it."
        >
          <div
            className={`mb-6 rounded-2xl border p-5 ${
              allDocumentsVerified
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className={`font-bold ${
                    allDocumentsVerified
                      ? "text-green-900"
                      : "text-amber-900"
                  }`}
                >
                  Overall Document
                  Verification
                </h3>

                <p
                  className={`mt-1 text-sm ${
                    allDocumentsVerified
                      ? "text-green-800"
                      : "text-amber-800"
                  }`}
                >
                  Pandit status:{" "}
                  <strong>
                    {
                      pandit.verificationStatus
                    }
                  </strong>
                </p>
              </div>

              <p
                className={`font-bold ${
                  allDocumentsVerified
                    ? "text-green-900"
                    : "text-amber-900"
                }`}
              >
                {verifiedDocuments}/
                {totalDocuments}{" "}
                documents verified
              </p>
            </div>

            {allDocumentsVerified && (
              <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm font-semibold text-green-800">
                ✓ All submitted
                documents have been
                verified.
              </div>
            )}
          </div>

          {pandit.documents
            .length > 0 ? (
            <div className="space-y-4">
              {pandit.documents.map(
                (document) => (
                  <div
                    key={
                      document.id
                    }
                    className={`rounded-2xl border p-5 ${
                      document.isVerified
                        ? "border-green-200 bg-green-50/40"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-bold text-gray-900">
                            {documentLabel(
                              document.documentType
                            )}
                          </h3>

                          {document.isVerified ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                              Pending
                              Verification
                            </span>
                          )}
                        </div>

                        {document.documentNumber && (
                          <p className="mt-2 text-sm text-gray-600">
                            Reference:{" "}
                            {
                              document.documentNumber
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                          Uploaded:{" "}
                          {formatDate(
                            document.createdAt
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={
                            document.documentUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-orange-200 px-5 py-2.5 font-semibold text-orange-700 transition hover:bg-orange-50"
                        >
                          View Document
                        </a>

                        {!document.isVerified && (
                          <button
                            type="button"
                            onClick={() =>
                              verifyDocument(
                                document.id
                              )
                            }
                            disabled={
                              verifyingDocumentId ===
                              document.id
                            }
                            className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                          >
                            {verifyingDocumentId ===
                            document.id
                              ? "Verifying..."
                              : "✓ Verify"}
                          </button>
                        )}

                        {document.isVerified && (
                          <span className="rounded-xl bg-green-100 px-5 py-2.5 font-bold text-green-700">
                            ✓ Document
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No verification documents uploaded." />
          )}

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-bold text-blue-900">
              🛡️ Admin Verification
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              Open and review each
              document before clicking
              Verify. Document
              verification does not
              automatically approve the
              Pandit.
            </p>
          </div>
        </SectionCard>

        {/* Final Admin Approval */}

        <SectionCard
          title="Final Admin Approval"
          subtitle="Complete the Pandit's onboarding after reviewing the profile and required documents."
        >
          {isPanditVerified ? (
            /*
            |--------------------------------------------------------------------------
            | Already Approved
            |--------------------------------------------------------------------------
            */

            <div className="rounded-2xl border border-green-300 bg-green-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                  ✓
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-900">
                    Pandit Approved
                  </h3>

                  <p className="mt-2 leading-6 text-green-800">
                    {pandit.name} has
                    completed Admin
                    verification and is
                    now a verified
                    DivyaArpan Pandit.
                  </p>

                  <p className="mt-3 text-sm font-bold text-green-700">
                    Verification Status:
                    VERIFIED
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /*
            |--------------------------------------------------------------------------
            | Pending Approval
            |--------------------------------------------------------------------------
            */

            <div className="space-y-5">
              <div
                className={`rounded-2xl border p-6 ${
                  requiredDocumentsVerified
                    ? "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <h3
                  className={`text-lg font-bold ${
                    requiredDocumentsVerified
                      ? "text-green-900"
                      : "text-amber-900"
                  }`}
                >
                  {requiredDocumentsVerified
                    ? "✓ Ready for Final Approval"
                    : "Approval Requirements Not Complete"}
                </h3>

                <p
                  className={`mt-2 leading-6 ${
                    requiredDocumentsVerified
                      ? "text-green-800"
                      : "text-amber-800"
                  }`}
                >
                  {requiredDocumentsVerified
                    ? "Government Photo ID, PAN Card and Address Proof have all been verified. You can now perform the final Admin approval."
                    : "Government Photo ID, PAN Card and Address Proof must all be uploaded and verified before this Pandit can be approved."}
                </p>
              </div>

              {/* Required Document Checklist */}

              <div className="grid gap-4 md:grid-cols-3">
                {requiredDocumentTypes.map(
                  (type) => {
                    const document =
                      pandit.documents.find(
                        (item) =>
                          item.documentType ===
                          type
                      );

                    const verified =
                      Boolean(
                        document?.isVerified
                      );

                    return (
                      <div
                        key={type}
                        className={`rounded-2xl border p-4 ${
                          verified
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <p className="font-bold text-gray-900">
                          {documentLabel(
                            type
                          )}
                        </p>

                        <p
                          className={`mt-2 text-sm font-bold ${
                            verified
                              ? "text-green-700"
                              : "text-amber-700"
                          }`}
                        >
                          {verified
                            ? "✓ Verified"
                            : document
                            ? "Pending Verification"
                            : "Missing"}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Approval Warning */}

              {requiredDocumentsVerified && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="font-bold text-blue-900">
                    Before approving
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    Confirm that the
                    Pandit's identity,
                    contact information,
                    service details and
                    verification
                    documents have been
                    reviewed. Final
                    approval changes the
                    verification status
                    from PENDING to
                    VERIFIED.
                  </p>
                </div>
              )}

              {/* Approve Button */}

              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-gray-900">
                    Current Status:{" "}
                    <span className="text-amber-700">
                      {
                        pandit.verificationStatus
                      }
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Final approval can
                    only be completed
                    after all required
                    documents are
                    verified.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    approvePandit
                  }
                  disabled={
                    !requiredDocumentsVerified ||
                    approving
                  }
                  className="rounded-xl bg-green-600 px-7 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {approving
                    ? "Approving..."
                    : "✓ Approve Pandit"}
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </section>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable Components
|--------------------------------------------------------------------------
*/

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-7 shadow-sm md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-gray-600">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function PreferenceCard({
  icon,
  title,
  enabled,
}: {
  icon: string;
  title: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        enabled
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {icon}
        </span>

        <div>
          <p className="font-bold text-gray-900">
            {title}
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              enabled
                ? "text-green-700"
                : "text-gray-500"
            }`}
          >
            {enabled
              ? "Enabled"
              : "Disabled"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "VERIFIED") {
    return (
      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
        ✓ Verified
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
      Verification Pending
    </span>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
      {text}
    </div>
  );
}