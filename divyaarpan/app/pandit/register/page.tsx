"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  "Hindi",
  "Marathi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];

const SERVICES = [
  "Ganesh Pooja",
  "Satyanarayan Pooja",
  "Griha Pravesh",
  "Vastu Pooja",
  "Navgraha Pooja",
  "Havan",
  "Marriage Pooja",
  "Mundan",
  "Naming Ceremony",
  "Shraddha / Pitru Pooja",
];

const DOCUMENT_TYPES = [
  "Government Photo ID",
  "PAN Card",
  "Address Proof",
  "Police Verification",
  "Pooja / Vedic Qualification Certificate",
];

type ServiceArea = {
  city: string;
  area: string;
  pincode: string;
  serviceRadiusKm: string;
};

type DocumentEntry = {
  documentType: string;
  documentNumber: string;
  documentUrl: string;
  file: File | null;
};

export default function PanditRegisterPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const [languages, setLanguages] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    {
      city: "Mumbai",
      area: "",
      pincode: "",
      serviceRadiusKm: "10",
    },
  ]);

  const [documents, setDocuments] = useState<DocumentEntry[]>(
    DOCUMENT_TYPES.map((documentType) => ({
      documentType,
      documentNumber: "",
      documentUrl: "",
      file: null,
    }))
  );

  const [uploadingDocuments, setUploadingDocuments] =
    useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "divyaarpan_pandit_registration_draft"
      );

      if (!saved) return;

      const draft = JSON.parse(saved);

      if (draft.languages) setLanguages(draft.languages);
      if (draft.services) setServices(draft.services);
      if (draft.serviceAreas) setServiceAreas(draft.serviceAreas);


        if (typeof draft.scrollY === "number") {
          window.setTimeout(() => {
            window.scrollTo({
              top: draft.scrollY,
              behavior: "smooth",
            });
          }, 300);
        }
      if (draft.documents) {
        setDocuments((current) =>
          current.map((document, index) => ({
            ...document,
            documentNumber:
              draft.documents[index]?.documentNumber || "",
            documentUrl:
              draft.documents[index]?.documentUrl || "",
            file: null,
          }))
        );
      }

      const form = document.querySelector("form");

      if (form && draft.fields) {
        Object.entries(draft.fields).forEach(
          ([name, value]) => {
            const field = form.elements.namedItem(name);

            if (
              field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement ||
              field instanceof HTMLSelectElement
            ) {
              if (
                (field instanceof HTMLInputElement) &&
                (field.type === "checkbox" ||
                  field.type === "radio")
              ) {
                field.checked = Boolean(value);
              } else if (
                field instanceof HTMLInputElement ||
                field instanceof HTMLTextAreaElement ||
                field instanceof HTMLSelectElement
              ) {
                field.value = String(value ?? "");
              }
            }
          }
        );
      }
    } catch (error) {
      console.error(
        "Unable to restore Pandit registration draft:",
        error
      );
    }
  }, []);

  useEffect(() => {
    const saveDraft = () => {
      try {
        const form = document.querySelector("form");
        const fields: Record<string, string | boolean> = {};

        if (form) {
          Array.from(form.elements).forEach((element) => {
            if (
              element instanceof HTMLInputElement ||
              element instanceof HTMLTextAreaElement ||
              element instanceof HTMLSelectElement
            ) {
              if (!element.name) return;

              // Never save passwords in browser storage.
              if (
                element instanceof HTMLInputElement &&
                (element.type === "password" ||
                  element.name === "password" ||
                  element.name === "confirmation")
              ) {
                return;
              }

              fields[element.name] =
                element instanceof HTMLInputElement &&
                (element.type === "checkbox" ||
                  element.type === "radio")
                  ? element.checked
                  : element.value;
            }
          });
        }

        localStorage.setItem(
          "divyaarpan_pandit_registration_draft",
          JSON.stringify({
            fields,
            languages,
            services,
            serviceAreas,
            documents: documents.map((document) => ({
              documentType: document.documentType,
              documentNumber: document.documentNumber,
              documentUrl: document.documentUrl,
            })),
            savedAt: new Date().toISOString(),
            scrollY: window.scrollY,
          })
        );
      } catch (error) {
        console.error(
          "Unable to save Pandit registration draft:",
          error
        );
      }
    };

    const timer = window.setTimeout(saveDraft, 300);

    return () => window.clearTimeout(timer);
  }, [languages, services, serviceAreas, documents]);

  function toggleItem(
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function updateServiceArea(
    index: number,
    field: keyof ServiceArea,
    value: string
  ) {
    setServiceAreas((current) =>
      current.map((area, areaIndex) =>
        areaIndex === index
          ? { ...area, [field]: value }
          : area
      )
    );
  }

  function addServiceArea() {
    setServiceAreas((current) => [
      ...current,
      {
        city: "Mumbai",
        area: "",
        pincode: "",
        serviceRadiusKm: "10",
      },
    ]);
  }

  function removeServiceArea(index: number) {
    setServiceAreas((current) =>
      current.length === 1
        ? current
        : current.filter((_, areaIndex) => areaIndex !== index)
    );
  }

  function updateDocument(
    index: number,
    field: keyof DocumentEntry,
    value: string
  ) {
    setDocuments((current) =>
      current.map((document, documentIndex) =>
        documentIndex === index
          ? { ...document, [field]: value }
          : document
      )
    );
  }

  async function uploadDocument(
    index: number,
    file: File | null
  ) {
    if (!file) return;
    setDocuments((current) =>
      current.map((document, documentIndex) =>
        documentIndex === index
          ? {
              ...document,
              file,
              documentUrl: "",
            }
          : document
      )
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const password = String(
      form.get("password") || ""
    );

    const confirmation = String(
      form.get("confirmation") || ""
    );

    if (password !== confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (languages.length === 0) {
      setError("Please select at least one language.");
      setLoading(false);
      return;
    }

    if (services.length === 0) {
      setError("Please select at least one service.");
      setLoading(false);
      return;
    }

    const validAreas = serviceAreas.filter(
      (area) =>
        area.city.trim() &&
        area.area.trim()
    );

    if (validAreas.length === 0) {
      setError(
        "Please add at least one service area."
      );
      setLoading(false);
      return;
    }

      const incompleteDocuments = documents.filter(
        (document) =>
          !document.documentNumber.trim() ||
          !document.file
      );

      if (incompleteDocuments.length > 0) {
        setError(
          "Please complete all required verification documents."
        );
        setLoading(false);
        return;
      }

    try {
        setError("");

      if (!accountCreated) {
        const response = await fetch(
        "/api/auth/pandit-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            mobile: form.get("mobile"),
            password,

            gender: form.get("gender"),
            dateOfBirth: form.get("dateOfBirth"),
            experienceYears: form.get(
              "experienceYears"
            ),
            bio: form.get("bio"),

            address: form.get("address"),
            city: form.get("city"),
            state: form.get("state"),
            country: "India",
            pincode: form.get("pincode"),

            latitude: null,
            longitude: null,

            acceptsImmediate:
              form.get("acceptsImmediate") === "on",

            acceptsScheduled:
              form.get("acceptsScheduled") === "on",

            languages,
            services,

            serviceAreas: validAreas.map(
              (area) => ({
                city: area.city,
                area: area.area,
                pincode: area.pincode,
                serviceRadiusKm:
                  area.serviceRadiusKm,
              })
            ),

              documents: [],
          }),
        }
      );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to submit your Pandit application."
          );
        }

        setAccountCreated(true);
      }

      await Promise.all(
        documents.map(async (document) => {
          if (!document.file) {
            throw new Error(
              `Please select ${document.documentType}.`
            );
          }

          const uploadData = new FormData();
          uploadData.append("file", document.file);
          uploadData.append("documentType", document.documentType);
          uploadData.append("documentNumber", document.documentNumber);

          const uploadResponse = await fetch(
            "/api/pandit/documents/upload",
            { method: "POST", body: uploadData }
          );
          const uploadResult = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(
              uploadResult.message ||
                `Unable to upload ${document.documentType}.`
            );
          }
        })
      );

      setSubmitted(true);
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to submit your Pandit application."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              DivyaArpan Partner Portal
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Application Submitted
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Your Pandit profile has been submitted
              successfully and is now pending Admin
              verification.
            </p>

            <div className="mt-8 rounded-2xl bg-orange-50 p-6 text-left">
              <p className="font-bold text-orange-800">
                What happens next?
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p>✓ Your profile has been created.</p>
                <p>✓ Your documents will be reviewed.</p>
                <p>✓ DivyaDarpan Admin will verify your application.</p>
                <p>✓ You can receive booking requests only after approval.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
              >
                Go to Login
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-orange-300 px-6 py-3 font-bold text-orange-700 hover:bg-orange-50"
              >
                Back to DivyaDarpan
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            DivyaArpan Partner Portal
          </p>

          <h1 className="mt-3 text-4xl font-bold text-orange-800">
            Become a DivyaDarpan Pandit
          </h1>

          <p className="mx-auto mt-3 max-w-3xl text-gray-600">
            Complete your profile and submit your documents
            for verification. Your application will be reviewed
            by the DivyaDarpan Admin team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-xl md:p-10"
        >
          {/* ACCOUNT */}
          <section>
            <SectionTitle
              number="1"
              title="Account Details"
              description="Create the login account you will use for the Pandit dashboard."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name *"
                name="name"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <Field
                label="Mobile Number *"
                name="mobile"
                type="tel"
                placeholder="10 digit mobile number"
                autoComplete="tel"
                required
              />

              <Field
                label="Email Address *"
                name="email"
                type="email"
                placeholder="yourname@example.com"
                autoComplete="email"
                required
              />

              <Field
                label="Password *"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <Field
                label="Confirm Password *"
                name="confirmation"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </section>

          {/* PERSONAL */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <SectionTitle
              number="2"
              title="Personal Details"
              description="Tell us about yourself and your experience."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <label className="font-semibold text-gray-700">
                Gender
                <select
                  name="gender"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 font-normal outline-none focus:border-orange-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
              />

              <Field
                label="Years of Experience *"
                name="experienceYears"
                type="number"
                min={0}
                max={80}
                placeholder="Example: 12"
                required
              />

              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700">
                  About You / Vedic Experience
                  <textarea
                    name="bio"
                    rows={5}
                    placeholder="Describe your Vedic knowledge, experience, specialisations and background..."
                    className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-orange-500"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* ADDRESS */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <SectionTitle
              number="3"
              title="Address & Location"
              description="This information helps DivyaDarpan match you with nearby devotees."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700">
                  Full Address *
                  <textarea
                    name="address"
                    rows={3}
                    required
                    placeholder="House / building, street, locality..."
                    className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-orange-500"
                  />
                </label>
              </div>

              <Field
                label="City *"
                name="city"
                defaultValue="Mumbai"
                required
              />

              <Field
                label="State *"
                name="state"
                defaultValue="Maharashtra"
                required
              />

              <Field
                label="Pincode *"
                name="pincode"
                placeholder="6 digit pincode"
                required
              />

              <Field
                label="Country"
                name="country"
                defaultValue="India"
                disabled
              />
            </div>
          </section>

          {/* LANGUAGES */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <SectionTitle
              number="4"
              title="Languages & Services"
              description="Select all languages and pooja services you can provide."
            />

            <h3 className="font-bold text-gray-900">
              Languages You Speak *
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {LANGUAGES.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() =>
                    toggleItem(language, setLanguages)
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    languages.includes(language)
                      ? "border-orange-600 bg-orange-100 text-orange-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                  }`}
                >
                  {languages.includes(language) ? "✓ " : ""}
                  {language}
                </button>
              ))}
            </div>

            <h3 className="mt-8 font-bold text-gray-900">
              Services You Perform *
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() =>
                    toggleItem(service, setServices)
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    services.includes(service)
                      ? "border-orange-600 bg-orange-100 text-orange-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                  }`}
                >
                  {services.includes(service) ? "✓ " : ""}
                  {service}
                </button>
              ))}
            </div>
          </section>

          {/* SERVICE AREAS */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <SectionTitle
                number="5"
                title="Service Areas"
                description="Tell us where you are available to perform poojas."
              />

              <button
                type="button"
                onClick={addServiceArea}
                className="h-fit rounded-xl border border-orange-600 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50"
              >
                + Add Area
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {serviceAreas.map((area, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold text-gray-900">
                      Service Area {index + 1}
                    </p>

                    {serviceAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeServiceArea(index)
                        }
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="City *"
                      value={area.city}
                      onChange={(value) =>
                        updateServiceArea(
                          index,
                          "city",
                          value
                        )
                      }
                    />

                    <Input
                      label="Area / Locality *"
                      value={area.area}
                      onChange={(value) =>
                        updateServiceArea(
                          index,
                          "area",
                          value
                        )
                      }
                    />

                    <Input
                      label="Pincode"
                      value={area.pincode}
                      onChange={(value) =>
                        updateServiceArea(
                          index,
                          "pincode",
                          value
                        )
                      }
                    />

                    <Input
                      label="Service Radius (KM)"
                      value={area.serviceRadiusKm}
                      onChange={(value) =>
                        updateServiceArea(
                          index,
                          "serviceRadiusKm",
                          value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AVAILABILITY */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <SectionTitle
              number="6"
              title="Booking Availability"
              description="Choose the types of bookings you are willing to accept."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-5 hover:border-orange-300">
                <input
                  type="checkbox"
                  name="acceptsImmediate"
                  defaultChecked
                  className="mt-1 h-5 w-5 accent-orange-600"
                />
                <span>
                  <strong className="block">
                    Immediate Bookings
                  </strong>
                  <span className="mt-1 block text-sm text-gray-500">
                    I am available for urgent / same-day requests.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-5 hover:border-orange-300">
                <input
                  type="checkbox"
                  name="acceptsScheduled"
                  defaultChecked
                  className="mt-1 h-5 w-5 accent-orange-600"
                />
                <span>
                  <strong className="block">
                    Scheduled Bookings
                  </strong>
                  <span className="mt-1 block text-sm text-gray-500">
                    I accept advance booking requests.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="mt-10 border-t border-orange-100 pt-10">
            <SectionTitle
              number="7"
              title="Verification Documents"
              description="All documents are required for Admin verification."
            />

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Important:</strong> Your application
              cannot be approved until the required documents
              have been reviewed by DivyaDarpan Admin.
            </div>

            <div className="mt-5 space-y-5">
              {documents.map((document, index) => (
                <div
                  key={document.documentType}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <p className="font-bold text-gray-900">
                    {index + 1}. {document.documentType} *
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Input
                      label="Document Number *"
                      value={document.documentNumber}
                      onChange={(value) =>
                        updateDocument(
                          index,
                          "documentNumber",
                          value
                        )
                      }
                    />

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Document File *
                        </label>

                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            required={!document.documentUrl}
                            disabled={uploadingDocuments.has(index)}
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0] || null;

                              void uploadDocument(index, file);

                              event.target.value = "";
                            }}
                            className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:font-semibold file:text-orange-700 hover:file:bg-orange-200 disabled:opacity-60"
                          />

                        <p className="mt-2 text-xs text-gray-500">
                          PDF, JPG or PNG only. Maximum size: 5 MB.
                        </p>

                        {document.file && (
                          <p className="mt-2 text-sm font-semibold text-green-700">
                            ✓ {document.file.name}
                          </p>
                        )}
                      </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    The selected file will be uploaded securely when you submit your application.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="mt-8 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600"
            >
              {error}
            </p>
          )}

          <div className="mt-10 rounded-2xl bg-orange-50 p-5 text-sm text-gray-700">
            <p className="font-bold text-orange-800">
              Admin Approval Required
            </p>

            <p className="mt-2">
              Creating an account does not automatically make
              you an approved DivyaDarpan Pandit. Your profile
              and documents will be reviewed by our Admin team.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-orange-600 py-4 font-bold text-white shadow-md transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Submitting Application..."
              : "Submit Pandit Application"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-orange-700 hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
          {number}
        </span>

        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <p className="mt-2 ml-12 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  minLength,
  min,
  max,
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  minLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType =
    isPassword && showPassword ? "text" : type;

  return (
    <label className="font-semibold text-gray-700">
      {label}

      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          minLength={minLength}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          className={`mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-orange-500 disabled:bg-gray-100 ${
            isPassword ? "pr-12" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-orange-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="font-semibold text-gray-700">
      {label}

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-orange-500"
      />
    </label>
  );
}
