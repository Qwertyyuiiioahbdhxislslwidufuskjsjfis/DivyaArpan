"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  serviceName: string;
  basePrice: string;
  durationMinutes: string;
};

type ServiceArea = {
  city: string;
  area: string;
  pincode: string;
  serviceRadiusKm: string;
};

type PanditDocumentForm = {
  documentType: string;
  label: string;
  description: string;
  required: boolean;
  documentNumber: string;
  documentUrl: string;
  fileName: string;
  uploading: boolean;
  error: string;
};

const languageOptions = [
  "Hindi",
  "Marathi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
];

const poojaOptions = [
  "Ganesh Pooja",
  "Satyanarayan Pooja",
  "Rudrabhishek",
  "Navgrah Pooja",
  "Griha Pravesh",
  "Wedding Ceremony",
  "Mahamrityunjaya Jaap",
  "Lakshmi Pooja",
  "Vastu Shanti",
  "Naamkaran",
];

const initialDocuments: PanditDocumentForm[] = [
  {
    documentType: "GOVERNMENT_ID",
    label: "Government Photo ID",
    description:
      "Upload an accepted government-issued photo identity document.",
    required: true,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "PAN_CARD",
    label: "PAN Card",
    description:
      "Used for identity, payout and accounting verification.",
    required: true,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "ADDRESS_PROOF",
    label: "Current Address Proof",
    description:
      "Upload current residential address proof where applicable.",
    required: true,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "POLICE_VERIFICATION",
    label: "Police Verification",
    description:
      "Background verification document. This may be completed later.",
    required: false,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "QUALIFICATION_CERTIFICATE",
    label: "Pandit / Pooja Qualification",
    description:
      "Certificate from a Gurukul, Sanskrit institution, temple or priest organisation, if available.",
    required: false,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "REFERENCE_PROOF",
    label: "Temple / Guru / Organisation Reference",
    description:
      "Reference or experience proof supporting the Pandit's professional background.",
    required: false,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
  {
    documentType: "PARTNER_AGREEMENT",
    label: "DivyaArpan Pandit Partner Agreement",
    description:
      "Signed DivyaArpan Pandit Partner Agreement. We will prepare the final agreement separately.",
    required: false,
    documentNumber: "",
    documentUrl: "",
    fileName: "",
    uploading: false,
    error: "",
  },
];

export default function AddPanditPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    profileImage: "",
    gender: "",
    dateOfBirth: "",
    experienceYears: "",
    bio: "",

    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    address: "",
    pincode: "",

    acceptsImmediate: true,
    acceptsScheduled: true,
  });

  const [languages, setLanguages] = useState<string[]>([]);

  const [services, setServices] = useState<Service[]>([
    {
      serviceName: "",
      basePrice: "",
      durationMinutes: "",
    },
  ]);

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    {
      city: "Mumbai",
      area: "",
      pincode: "",
      serviceRadiusKm: "",
    },
  ]);

  const [documents, setDocuments] =
    useState<PanditDocumentForm[]>(initialDocuments);

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function toggleLanguage(language: string) {
    setLanguages((previous) =>
      previous.includes(language)
        ? previous.filter((item) => item !== language)
        : [...previous, language]
    );
  }

  function updateService(
    index: number,
    field: keyof Service,
    value: string
  ) {
    setServices((previous) =>
      previous.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  }

  function addService() {
    setServices((previous) => [
      ...previous,
      {
        serviceName: "",
        basePrice: "",
        durationMinutes: "",
      },
    ]);
  }

  function removeService(index: number) {
    setServices((previous) =>
      previous.filter((_, serviceIndex) => serviceIndex !== index)
    );
  }

  function updateServiceArea(
    index: number,
    field: keyof ServiceArea,
    value: string
  ) {
    setServiceAreas((previous) =>
      previous.map((serviceArea, serviceAreaIndex) =>
        serviceAreaIndex === index
          ? {
              ...serviceArea,
              [field]: value,
            }
          : serviceArea
      )
    );
  }

  function addServiceArea() {
    setServiceAreas((previous) => [
      ...previous,
      {
        city: form.city || "Mumbai",
        area: "",
        pincode: "",
        serviceRadiusKm: "",
      },
    ]);
  }

  function removeServiceArea(index: number) {
    setServiceAreas((previous) =>
      previous.filter(
        (_, serviceAreaIndex) => serviceAreaIndex !== index
      )
    );
  }

  function updateDocumentNumber(
    index: number,
    value: string
  ) {
    setDocuments((previous) =>
      previous.map((document, documentIndex) =>
        documentIndex === index
          ? {
              ...document,
              documentNumber: value,
            }
          : document
      )
    );
  }

  async function uploadDocument(
    index: number,
    file: File
  ) {
    const document = documents[index];

    if (!document) {
      return;
    }

    setDocuments((previous) =>
      previous.map((item, documentIndex) =>
        documentIndex === index
          ? {
              ...item,
              uploading: true,
              error: "",
            }
          : item
      )
    );

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "documentType",
        document.documentType
      );

      const response = await fetch(
        "/api/pandits/documents/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Document upload failed."
        );
      }

      setDocuments((previous) =>
        previous.map((item, documentIndex) =>
          documentIndex === index
            ? {
                ...item,
                documentUrl: data.documentUrl,
                fileName: file.name,
                uploading: false,
                error: "",
              }
            : item
        )
      );
    } catch (error) {
      console.error("DOCUMENT UPLOAD ERROR:", error);

      setDocuments((previous) =>
        previous.map((item, documentIndex) =>
          documentIndex === index
            ? {
                ...item,
                uploading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Document upload failed.",
              }
            : item
        )
      );
    }
  }

  function removeUploadedDocument(index: number) {
    setDocuments((previous) =>
      previous.map((document, documentIndex) =>
        documentIndex === index
          ? {
              ...document,
              documentUrl: "",
              fileName: "",
              error: "",
            }
          : document
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!form.name.trim()) {
      setMessage("Please enter the Pandit's name.");
      return;
    }

    if (!form.mobile.trim()) {
      setMessage("Please enter the mobile number.");
      return;
    }

    if (!form.city.trim() || !form.state.trim()) {
      setMessage("Please enter the city and state.");
      return;
    }

    if (languages.length === 0) {
      setMessage("Please select at least one language.");
      return;
    }

    const validServices = services.filter((service) =>
      service.serviceName.trim()
    );

    if (validServices.length === 0) {
      setMessage("Please add at least one Pooja service.");
      return;
    }

    const documentUploading = documents.some(
      (document) => document.uploading
    );

    if (documentUploading) {
      setMessage(
        "Please wait for all document uploads to finish."
      );
      return;
    }

    const missingRequiredDocument = documents.find(
      (document) =>
        document.required && !document.documentUrl
    );

    if (missingRequiredDocument) {
      setMessage(
        `Please upload ${missingRequiredDocument.label}.`
      );
      return;
    }

    const uploadedDocuments = documents
      .filter((document) => document.documentUrl)
      .map((document) => ({
        documentType: document.documentType,
        documentUrl: document.documentUrl,
        documentNumber:
          document.documentNumber.trim() || null,
      }));

    setSubmitting(true);

    try {
      const response = await fetch("/api/pandits", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,

          experienceYears: form.experienceYears
            ? Number(form.experienceYears)
            : 0,

          languages,

          services: validServices,

          serviceAreas: serviceAreas.filter(
            (serviceArea) =>
              serviceArea.city.trim() &&
              serviceArea.area.trim()
          ),

          documents: uploadedDocuments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to register Pandit."
        );

        setSubmitting(false);
        return;
      }

      setMessage("Pandit registered successfully.");

      router.push("/admin/pandits");
      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while registering the Pandit."
      );

      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/admin/pandits"
            className="inline-flex items-center text-orange-100 transition hover:text-white"
          >
            ← Back to Manage Pandits
          </Link>

          <div className="mt-6">
            <p className="font-semibold tracking-wide text-orange-100">
              PANDIT ONBOARDING
            </p>

            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Add New Pandit
            </h1>

            <p className="mt-3 max-w-2xl text-orange-100">
              Register a Pandit for the DivyaArpan network.
              Verification can be completed before the Pandit goes
              live for devotees.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-7">
              <p className="font-semibold text-orange-600">
                STEP 1
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Personal Details
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Full Name *">
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  placeholder="Pandit full name"
                  className="inputStyle"
                  required
                />
              </Field>

              <Field label="Mobile Number *">
                <input
                  value={form.mobile}
                  onChange={(event) =>
                    updateForm("mobile", event.target.value)
                  }
                  placeholder="10 digit mobile number"
                  className="inputStyle"
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm("email", event.target.value)
                  }
                  placeholder="pandit@example.com"
                  className="inputStyle"
                />
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateForm("gender", event.target.value)
                  }
                  className="inputStyle"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Date of Birth">
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    updateForm(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                  className="inputStyle"
                />
              </Field>

              <Field label="Experience (Years)">
                <input
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={(event) =>
                    updateForm(
                      "experienceYears",
                      event.target.value
                    )
                  }
                  placeholder="Example: 10"
                  className="inputStyle"
                />
              </Field>

              <Field label="Profile Image URL">
                <input
                  value={form.profileImage}
                  onChange={(event) =>
                    updateForm(
                      "profileImage",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="inputStyle"
                />
              </Field>

              <div />

              <div className="md:col-span-2">
                <Field label="About Pandit">
                  <textarea
                    value={form.bio}
                    onChange={(event) =>
                      updateForm("bio", event.target.value)
                    }
                    rows={4}
                    placeholder="Experience, specialization, traditional background..."
                    className="inputStyle"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-semibold text-orange-600">
              STEP 2
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Location
            </h2>

            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <Field label="City *">
                <input
                  value={form.city}
                  onChange={(event) =>
                    updateForm("city", event.target.value)
                  }
                  className="inputStyle"
                  required
                />
              </Field>

              <Field label="State *">
                <input
                  value={form.state}
                  onChange={(event) =>
                    updateForm("state", event.target.value)
                  }
                  className="inputStyle"
                  required
                />
              </Field>

              <Field label="Country">
                <input
                  value={form.country}
                  onChange={(event) =>
                    updateForm("country", event.target.value)
                  }
                  className="inputStyle"
                />
              </Field>

              <Field label="Pincode">
                <input
                  value={form.pincode}
                  onChange={(event) =>
                    updateForm("pincode", event.target.value)
                  }
                  className="inputStyle"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Full Address">
                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      updateForm(
                        "address",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Residential / operating address"
                    className="inputStyle"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-semibold text-orange-600">
              STEP 3
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Languages
            </h2>

            <p className="mt-2 text-gray-600">
              Select all languages in which the Pandit can
              comfortably perform and explain rituals.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {languageOptions.map((language) => {
                const selected =
                  languages.includes(language);

                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() =>
                      toggleLanguage(language)
                    }
                    className={`rounded-full border px-5 py-2.5 font-medium transition ${
                      selected
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    {selected ? "✓ " : ""}
                    {language}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-orange-600">
                  STEP 4
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Pooja Services
                </h2>

                <p className="mt-2 text-gray-600">
                  Add the ceremonies this Pandit can perform.
                </p>
              </div>

              <button
                type="button"
                onClick={addService}
                className="rounded-xl border border-orange-200 px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50"
              >
                + Add Service
              </button>
            </div>

            <div className="mt-7 space-y-5">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Pooja / Ceremony">
                      <select
                        value={service.serviceName}
                        onChange={(event) =>
                          updateService(
                            index,
                            "serviceName",
                            event.target.value
                          )
                        }
                        className="inputStyle"
                      >
                        <option value="">
                          Select service
                        </option>

                        {poojaOptions.map((pooja) => (
                          <option
                            key={pooja}
                            value={pooja}
                          >
                            {pooja}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Base Price (₹)">
                      <input
                        type="number"
                        min="0"
                        value={service.basePrice}
                        onChange={(event) =>
                          updateService(
                            index,
                            "basePrice",
                            event.target.value
                          )
                        }
                        placeholder="1500"
                        className="inputStyle"
                      />
                    </Field>

                    <Field label="Duration (Minutes)">
                      <input
                        type="number"
                        min="0"
                        value={service.durationMinutes}
                        onChange={(event) =>
                          updateService(
                            index,
                            "durationMinutes",
                            event.target.value
                          )
                        }
                        placeholder="60"
                        className="inputStyle"
                      />
                    </Field>
                  </div>

                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeService(index)
                      }
                      className="mt-4 text-sm font-semibold text-red-600"
                    >
                      Remove Service
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-orange-600">
                  STEP 5
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Service Areas
                </h2>

                <p className="mt-2 text-gray-600">
                  Specify the areas where the Pandit is willing
                  to travel.
                </p>
              </div>

              <button
                type="button"
                onClick={addServiceArea}
                className="rounded-xl border border-orange-200 px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50"
              >
                + Add Area
              </button>
            </div>

            <div className="mt-7 space-y-5">
              {serviceAreas.map((serviceArea, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
                >
                  <div className="grid gap-5 md:grid-cols-4">
                    <Field label="City">
                      <input
                        value={serviceArea.city}
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "city",
                            event.target.value
                          )
                        }
                        className="inputStyle"
                      />
                    </Field>

                    <Field label="Area">
                      <input
                        value={serviceArea.area}
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "area",
                            event.target.value
                          )
                        }
                        placeholder="Andheri West"
                        className="inputStyle"
                      />
                    </Field>

                    <Field label="Pincode">
                      <input
                        value={serviceArea.pincode}
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "pincode",
                            event.target.value
                          )
                        }
                        placeholder="400053"
                        className="inputStyle"
                      />
                    </Field>

                    <Field label="Travel Radius (km)">
                      <input
                        type="number"
                        min="0"
                        value={
                          serviceArea.serviceRadiusKm
                        }
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "serviceRadiusKm",
                            event.target.value
                          )
                        }
                        placeholder="10"
                        className="inputStyle"
                      />
                    </Field>
                  </div>

                  {serviceAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeServiceArea(index)
                      }
                      className="mt-4 text-sm font-semibold text-red-600"
                    >
                      Remove Area
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Preference */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-semibold text-orange-600">
              STEP 6
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Booking Preference
            </h2>

            <p className="mt-2 text-gray-600">
              Choose which types of booking requests this Pandit
              can receive.
            </p>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label
                className={`cursor-pointer rounded-2xl border p-6 transition ${
                  form.acceptsImmediate
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={form.acceptsImmediate}
                    onChange={(event) =>
                      updateForm(
                        "acceptsImmediate",
                        event.target.checked
                      )
                    }
                    className="mt-1 h-5 w-5"
                  />

                  <div>
                    <h3 className="font-bold text-gray-900">
                      ⚡ Immediate Booking
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Pandit can receive urgent nearby Pooja
                      requests when online.
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`cursor-pointer rounded-2xl border p-6 transition ${
                  form.acceptsScheduled
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={form.acceptsScheduled}
                    onChange={(event) =>
                      updateForm(
                        "acceptsScheduled",
                        event.target.checked
                      )
                    }
                    className="mt-1 h-5 w-5"
                  />

                  <div>
                    <h3 className="font-bold text-gray-900">
                      📅 Scheduled Booking
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Pandit can receive future bookings for a
                      selected date and time.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Documents & Verification */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <p className="font-semibold text-orange-600">
                STEP 7
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Documents & Verification
              </h2>

              <p className="mt-2 max-w-3xl leading-7 text-gray-600">
                Upload documents required for Pandit identity,
                background and professional verification.
                Documents will remain pending until reviewed by
                DivyaArpan Admin.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-bold text-blue-900">
                🔐 Document Privacy
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                These uploads are for development testing. Before
                production, KYC documents must be moved from public
                development storage to protected private storage.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              {documents.map((document, index) => (
                <div
                  key={document.documentType}
                  className={`rounded-2xl border p-6 ${
                    document.documentUrl
                      ? "border-green-200 bg-green-50/40"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {document.label}
                        </h3>

                        {document.required ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                            Required
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Optional
                          </span>
                        )}

                        {document.documentUrl && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            ✓ Uploaded
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {document.description}
                      </p>
                    </div>

                    <div className="w-full lg:max-w-md">
                      <Field label="Document / Reference Number">
                        <input
                          value={document.documentNumber}
                          onChange={(event) =>
                            updateDocumentNumber(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={
                            document.documentType ===
                            "GOVERNMENT_ID"
                              ? "Use only permitted/minimal reference details"
                              : "Optional document number"
                          }
                          className="inputStyle"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-5">
                    {!document.documentUrl ? (
                      <div>
                        <label className="inline-flex cursor-pointer items-center rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700">
                          {document.uploading
                            ? "Uploading..."
                            : "Choose & Upload Document"}

                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            disabled={document.uploading}
                            className="hidden"
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0];

                              if (file) {
                                uploadDocument(index, file);
                              }

                              event.target.value = "";
                            }}
                          />
                        </label>

                        <p className="mt-2 text-xs text-gray-500">
                          PDF, JPG or PNG • Maximum 5 MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 rounded-xl border border-green-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-green-700">
                            ✓ Document uploaded
                          </p>

                          <p className="mt-1 break-all text-sm text-gray-600">
                            {document.fileName ||
                              document.documentUrl}
                          </p>

                          <p className="mt-1 text-xs text-amber-700">
                            Verification status: Pending
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={document.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                          >
                            View
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              removeUploadedDocument(index)
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {document.error && (
                      <p className="mt-3 text-sm font-semibold text-red-600">
                        {document.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-bold text-amber-900">
                Aadhaar / Sensitive Identity Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Do not unnecessarily enter a full Aadhaar number
                into the document-number field. Production KYC
                handling will use an appropriate privacy and
                verification process.
              </p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="font-bold text-amber-900">
              🛡️ Verification Required
            </h3>

            <p className="mt-2 leading-7 text-amber-800">
              New Pandits will be registered with{" "}
              <strong>PENDING</strong> verification status.
              Uploading a document does not automatically verify
              it. DivyaArpan Admin will review the Pandit and
              documents before activation.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className="rounded-xl border border-orange-200 bg-white p-4 font-medium text-gray-700">
              {message}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse gap-4 border-t border-orange-100 pt-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/pandits"
              className="rounded-xl border border-gray-300 px-7 py-4 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                submitting ||
                documents.some(
                  (document) => document.uploading
                )
              }
              className="rounded-xl bg-orange-600 px-8 py-4 font-bold text-white shadow-md transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Registering Pandit..."
                : documents.some(
                    (document) => document.uploading
                  )
                ? "Uploading Documents..."
                : "Register Pandit"}
            </button>
          </div>
        </form>
      </section>

      <style jsx global>{`
        .inputStyle {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.85rem 1rem;
          background: white;
          color: #111827;
          outline: none;
          transition: 0.2s;
        }

        .inputStyle:focus {
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      {children}
    </label>
  );
}