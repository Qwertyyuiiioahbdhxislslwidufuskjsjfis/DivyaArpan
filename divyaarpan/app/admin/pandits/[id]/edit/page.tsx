"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type LanguageRecord = {
  id: number;
  language: string;
};

type ServiceRecord = {
  id: number;
  serviceName: string;
  basePrice: number | null;
  durationMinutes: number | null;
  isActive: boolean;
};

type ServiceAreaRecord = {
  id: number;
  city: string;
  area: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number | null;
};

type DocumentRecord = {
  id: number;
  documentType: string;
  documentUrl: string;
  documentNumber: string | null;
  isVerified: boolean;
};

type PanditRecord = {
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

  latitude: number | null;
  longitude: number | null;

  verificationStatus: string;

  isActive: boolean;
  isOnline: boolean;

  acceptsImmediate: boolean;
  acceptsScheduled: boolean;

  languages: LanguageRecord[];
  services: ServiceRecord[];
  serviceAreas: ServiceAreaRecord[];
  documents: DocumentRecord[];
};

type EditableService = {
  serviceName: string;
  basePrice: string;
  durationMinutes: string;
  isActive: boolean;
};

type EditableServiceArea = {
  city: string;
  area: string;
  pincode: string;
  latitude: string;
  longitude: string;
  serviceRadiusKm: string;
};

const languageOptions = [
  "Hindi",
  "Marathi",
  "English",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Sanskrit",
];

export default function EditPanditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [panditCode, setPanditCode] = useState("");
  const [verificationStatus, setVerificationStatus] =
    useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [profileImage, setProfileImage] = useState("");

  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [experienceYears, setExperienceYears] =
    useState("");

  const [bio, setBio] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [languages, setLanguages] = useState<string[]>(
    []
  );

  const [services, setServices] = useState<
    EditableService[]
  >([]);

  const [serviceAreas, setServiceAreas] = useState<
    EditableServiceArea[]
  >([]);

  const [documents, setDocuments] = useState<
    DocumentRecord[]
  >([]);

  const [acceptsImmediate, setAcceptsImmediate] =
    useState(true);

  const [acceptsScheduled, setAcceptsScheduled] =
    useState(true);

  const [isActive, setIsActive] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Existing Pandit
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load Pandit details."
          );
        }

        const pandit: PanditRecord = data.pandit;

        setPanditCode(pandit.panditCode);
        setVerificationStatus(
          pandit.verificationStatus
        );

        setName(pandit.name || "");
        setMobile(pandit.mobile || "");
        setEmail(pandit.email || "");

        setProfileImage(
          pandit.profileImage || ""
        );

        setGender(pandit.gender || "");

        setDateOfBirth(
          pandit.dateOfBirth
            ? pandit.dateOfBirth.slice(0, 10)
            : ""
        );

        setExperienceYears(
          String(pandit.experienceYears ?? 0)
        );

        setBio(pandit.bio || "");

        setCity(pandit.city || "");
        setState(pandit.state || "");
        setCountry(pandit.country || "India");

        setAddress(pandit.address || "");
        setPincode(pandit.pincode || "");

        setLatitude(
          pandit.latitude !== null
            ? String(pandit.latitude)
            : ""
        );

        setLongitude(
          pandit.longitude !== null
            ? String(pandit.longitude)
            : ""
        );

        setLanguages(
          pandit.languages.map(
            (item) => item.language
          )
        );

        /*
        Database stores service price in paise.
        Edit form displays rupees.

        Example:
        200000 paise -> ₹2,000
        */

        setServices(
          pandit.services.map((service) => ({
            serviceName: service.serviceName,

            basePrice:
              service.basePrice !== null
                ? String(
                    service.basePrice / 100
                  )
                : "",

            durationMinutes:
              service.durationMinutes !== null
                ? String(
                    service.durationMinutes
                  )
                : "",

            isActive: service.isActive,
          }))
        );

        setServiceAreas(
          pandit.serviceAreas.map((area) => ({
            city: area.city || "",
            area: area.area || "",
            pincode: area.pincode || "",

            latitude:
              area.latitude !== null
                ? String(area.latitude)
                : "",

            longitude:
              area.longitude !== null
                ? String(area.longitude)
                : "",

            serviceRadiusKm:
              area.serviceRadiusKm !== null
                ? String(
                    area.serviceRadiusKm
                  )
                : "",
          }))
        );

        setDocuments(pandit.documents || []);

        setAcceptsImmediate(
          pandit.acceptsImmediate
        );

        setAcceptsScheduled(
          pandit.acceptsScheduled
        );

        setIsActive(pandit.isActive);
        setIsOnline(pandit.isOnline);
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
  | Languages
  |--------------------------------------------------------------------------
  */

  function toggleLanguage(language: string) {
    setLanguages((current) => {
      if (current.includes(language)) {
        return current.filter(
          (item) => item !== language
        );
      }

      return [...current, language];
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Services
  |--------------------------------------------------------------------------
  */

  function addService() {
    setServices((current) => [
      ...current,
      {
        serviceName: "",
        basePrice: "",
        durationMinutes: "",
        isActive: true,
      },
    ]);
  }

  function updateService(
    index: number,
    field: keyof EditableService,
    value: string | boolean
  ) {
    setServices((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  }

  function removeService(index: number) {
    setServices((current) =>
      current.filter(
        (_, serviceIndex) =>
          serviceIndex !== index
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Service Areas
  |--------------------------------------------------------------------------
  */

  function addServiceArea() {
    setServiceAreas((current) => [
      ...current,
      {
        city: city,
        area: "",
        pincode: "",
        latitude: "",
        longitude: "",
        serviceRadiusKm: "",
      },
    ]);
  }

  function updateServiceArea(
    index: number,
    field: keyof EditableServiceArea,
    value: string
  ) {
    setServiceAreas((current) =>
      current.map((area, areaIndex) =>
        areaIndex === index
          ? {
              ...area,
              [field]: value,
            }
          : area
      )
    );
  }

  function removeServiceArea(index: number) {
    setServiceAreas((current) =>
      current.filter(
        (_, areaIndex) => areaIndex !== index
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Update
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Pandit name is required.");
      return;
    }

    if (!mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!city.trim()) {
      setError("City is required.");
      return;
    }

    if (!state.trim()) {
      setError("State is required.");
      return;
    }

    if (languages.length === 0) {
      setError(
        "Please select at least one language."
      );
      return;
    }

    const validServices = services.filter(
      (service) =>
        service.serviceName.trim()
    );

    if (validServices.length === 0) {
      setError(
        "Please add at least one Pooja service."
      );
      return;
    }

    try {
      setSaving(true);

      /*
      IMPORTANT:

      The POST registration flow stores price
      in paise.

      Our PUT API receives basePrice in paise,
      so convert ₹ -> paise here.

      Example:
      ₹2,000 -> 200000
      */

      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),

        email: email.trim() || null,

        profileImage:
          profileImage.trim() || null,

        gender: gender || null,

        dateOfBirth:
          dateOfBirth || null,

        experienceYears:
          experienceYears === ""
            ? 0
            : Number(experienceYears),

        bio: bio.trim() || null,

        city: city.trim(),
        state: state.trim(),

        country:
          country.trim() || "India",

        address:
          address.trim() || null,

        pincode:
          pincode.trim() || null,

        latitude:
          latitude === ""
            ? null
            : Number(latitude),

        longitude:
          longitude === ""
            ? null
            : Number(longitude),

        isActive,
        isOnline,

        acceptsImmediate,
        acceptsScheduled,

        languages,

        services: validServices.map(
          (service) => ({
            serviceName:
              service.serviceName.trim(),

            basePrice:
              service.basePrice === ""
                ? null
                : Math.round(
                    Number(
                      service.basePrice
                    ) * 100
                  ),

            durationMinutes:
              service.durationMinutes === ""
                ? null
                : Number(
                    service.durationMinutes
                  ),

            isActive: service.isActive,
          })
        ),

        serviceAreas: serviceAreas
          .filter(
            (area) =>
              area.city.trim() &&
              area.area.trim()
          )
          .map((area) => ({
            city: area.city.trim(),
            area: area.area.trim(),

            pincode:
              area.pincode.trim() || null,

            latitude:
              area.latitude === ""
                ? null
                : Number(area.latitude),

            longitude:
              area.longitude === ""
                ? null
                : Number(area.longitude),

            serviceRadiusKm:
              area.serviceRadiusKm === ""
                ? null
                : Number(
                    area.serviceRadiusKm
                  ),
          })),
      };

      const response = await fetch(
        `/api/pandits/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update Pandit."
        );
      }

      setSuccess(
        "Pandit updated successfully."
      );

      /*
      Return to Pandit View page.
      */

      setTimeout(() => {
        router.push(
          `/admin/pandits/${id}`
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update Pandit."
      );
    } finally {
      setSaving(false);
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
              Loading Pandit details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Load Error
  |--------------------------------------------------------------------------
  */

  if (error && !name) {
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
              ← Back to Manage Pandits
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 pb-16">
      {/* Header */}

      <section className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href={`/admin/pandits/${id}`}
            className="font-medium text-orange-100 hover:text-white"
          >
            ← Back to Pandit Profile
          </Link>

          <p className="mt-8 font-semibold tracking-wide text-orange-100">
            PANDIT MANAGEMENT
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Edit Pandit
          </h1>

          <p className="mt-3 text-orange-100">
            {panditCode}
          </p>

          <div className="mt-5">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Verification:{" "}
              {verificationStatus}
            </span>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl space-y-8 px-6 py-10"
      >
        {/* Messages */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 font-medium text-green-700">
            ✓ {success}
          </div>
        )}

        {/* Step 1 */}

        <Section
          number="1"
          title="Personal Information"
          description="Update the Pandit's identity and profile information."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Full Name"
              required
            >
              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className={inputClass}
                placeholder="Pandit full name"
              />
            </Field>

            <Field
              label="Mobile Number"
              required
            >
              <input
                value={mobile}
                onChange={(event) =>
                  setMobile(
                    event.target.value
                  )
                }
                className={inputClass}
                placeholder="Mobile number"
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                className={inputClass}
                placeholder="Email address"
              />
            </Field>

            <Field label="Gender">
              <select
                value={gender}
                onChange={(event) =>
                  setGender(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </Field>

            <Field label="Date of Birth">
              <input
                type="date"
                value={dateOfBirth}
                onChange={(event) =>
                  setDateOfBirth(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Experience (Years)">
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(event) =>
                  setExperienceYears(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Profile Image URL">
              <input
                value={profileImage}
                onChange={(event) =>
                  setProfileImage(
                    event.target.value
                  )
                }
                className={inputClass}
                placeholder="/uploads/pandits/..."
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="About / Bio">
              <textarea
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                rows={5}
                className={inputClass}
                placeholder="Experience, specialisation, background..."
              />
            </Field>
          </div>
        </Section>

        {/* Step 2 */}

        <Section
          number="2"
          title="Location"
          description="Update the Pandit's primary location."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="City" required>
              <input
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="State" required>
              <input
                value={state}
                onChange={(event) =>
                  setState(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Country">
              <input
                value={country}
                onChange={(event) =>
                  setCountry(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Pincode">
              <input
                value={pincode}
                onChange={(event) =>
                  setPincode(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Address">
              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                rows={3}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field label="Latitude">
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(event) =>
                  setLatitude(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Longitude">
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(event) =>
                  setLongitude(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {/* Step 3 */}

        <Section
          number="3"
          title="Languages"
          description="Select all languages the Pandit can use during Pooja and devotee communication."
        >
          <div className="flex flex-wrap gap-3">
            {languageOptions.map(
              (language) => {
                const selected =
                  languages.includes(
                    language
                  );

                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() =>
                      toggleLanguage(
                        language
                      )
                    }
                    className={`rounded-full border px-5 py-2.5 font-semibold transition ${
                      selected
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    {selected
                      ? "✓ "
                      : ""}
                    {language}
                  </button>
                );
              }
            )}
          </div>
        </Section>

        {/* Step 4 */}

        <Section
          number="4"
          title="Pooja Services"
          description="Update the Poojas offered, price and duration."
        >
          <div className="space-y-5">
            {services.map(
              (service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Pooja / Service">
                      <input
                        value={
                          service.serviceName
                        }
                        onChange={(event) =>
                          updateService(
                            index,
                            "serviceName",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                        placeholder="Example: Ganesh Pooja"
                      />
                    </Field>

                    <Field label="Price (₹)">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={
                          service.basePrice
                        }
                        onChange={(event) =>
                          updateService(
                            index,
                            "basePrice",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                        placeholder="2000"
                      />
                    </Field>

                    <Field label="Duration (Minutes)">
                      <input
                        type="number"
                        min="1"
                        value={
                          service.durationMinutes
                        }
                        onChange={(event) =>
                          updateService(
                            index,
                            "durationMinutes",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                        placeholder="60"
                      />
                    </Field>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <label className="flex cursor-pointer items-center gap-3 font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={
                          service.isActive
                        }
                        onChange={(event) =>
                          updateService(
                            index,
                            "isActive",
                            event.target.checked
                          )
                        }
                        className="h-5 w-5"
                      />

                      Service Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeService(index)
                      }
                      className="font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove Service
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={addService}
            className="mt-5 rounded-xl border border-orange-300 bg-white px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50"
          >
            + Add Pooja Service
          </button>
        </Section>

        {/* Step 5 */}

        <Section
          number="5"
          title="Service Areas"
          description="Areas where this Pandit can perform at-home Poojas."
        >
          {serviceAreas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
              No service areas added yet.
            </div>
          )}

          <div className="space-y-5">
            {serviceAreas.map(
              (area, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="City">
                      <input
                        value={area.city}
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "city",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field label="Area / Locality">
                      <input
                        value={area.area}
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "area",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                        placeholder="Example: Ghatkopar"
                      />
                    </Field>

                    <Field label="Pincode">
                      <input
                        value={
                          area.pincode
                        }
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "pincode",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field label="Service Radius (KM)">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={
                          area.serviceRadiusKm
                        }
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "serviceRadiusKm",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field label="Latitude">
                      <input
                        type="number"
                        step="any"
                        value={
                          area.latitude
                        }
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "latitude",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field label="Longitude">
                      <input
                        type="number"
                        step="any"
                        value={
                          area.longitude
                        }
                        onChange={(event) =>
                          updateServiceArea(
                            index,
                            "longitude",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeServiceArea(
                        index
                      )
                    }
                    className="mt-5 font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove Service Area
                  </button>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={addServiceArea}
            className="mt-5 rounded-xl border border-orange-300 bg-white px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50"
          >
            + Add Service Area
          </button>
        </Section>

        {/* Step 6 */}

        <Section
          number="6"
          title="Booking Preferences"
          description="Control which marketplace bookings this Pandit can receive."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <ToggleCard
              title="⚡ Immediate Booking"
              description="Allow the Pandit to receive immediate Pooja requests."
              checked={acceptsImmediate}
              onChange={
                setAcceptsImmediate
              }
            />

            <ToggleCard
              title="📅 Scheduled Booking"
              description="Allow devotees to book this Pandit for a future date."
              checked={acceptsScheduled}
              onChange={
                setAcceptsScheduled
              }
            />
          </div>
        </Section>

        {/* Step 7 */}

        <Section
          number="7"
          title="Documents & Verification"
          description="Existing documents are preserved while editing the Pandit's profile."
        >
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map(
                (document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {formatDocumentType(
                          document.documentType
                        )}
                      </p>

                      <p
                        className={`mt-2 text-sm font-semibold ${
                          document.isVerified
                            ? "text-green-700"
                            : "text-amber-700"
                        }`}
                      >
                        {document.isVerified
                          ? "✓ Verified"
                          : "Pending Verification"}
                      </p>
                    </div>

                    <a
                      href={
                        document.documentUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-orange-200 px-5 py-2.5 text-center font-semibold text-orange-700 hover:bg-orange-50"
                    >
                      View Document
                    </a>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
              No documents uploaded.
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-800">
            Documents cannot be verified from
            the Edit screen. Verification will
            be handled separately from the
            Pandit Profile screen.
          </div>
        </Section>

        {/* Step 8 */}

        <Section
          number="8"
          title="Account Status"
          description="Manage whether this Pandit is active and currently online."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <ToggleCard
              title="Pandit Active"
              description="Inactive Pandits should not participate in marketplace bookings."
              checked={isActive}
              onChange={setIsActive}
            />

            <ToggleCard
              title="Pandit Online"
              description="Online means the Pandit is currently accepting marketplace requests."
              checked={isOnline}
              onChange={setIsOnline}
            />
          </div>

          {verificationStatus !==
            "VERIFIED" &&
            isOnline && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800">
                ⚠ This Pandit is still{" "}
                {verificationStatus}. We will
                add stricter marketplace
                activation rules during the
                verification step.
              </div>
            )}
        </Section>

        {/* Save */}

        <div className="sticky bottom-4 rounded-2xl border border-orange-100 bg-white/95 p-5 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-gray-900">
                Save Pandit Changes
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Documents and verification
                status will remain unchanged.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/admin/pandits/${id}`}
                className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-orange-600 px-8 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable Components
|--------------------------------------------------------------------------
*/

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-7 shadow-sm md:p-8">
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
          {number}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 text-gray-600">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-2xl border p-5 transition ${
        checked
          ? "border-orange-300 bg-orange-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) =>
            onChange(
              event.target.checked
            )
          }
          className="mt-1 h-5 w-5"
        />

        <div>
          <p className="font-bold text-gray-900">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {description}
          </p>

          <p
            className={`mt-3 text-sm font-bold ${
              checked
                ? "text-green-700"
                : "text-gray-500"
            }`}
          >
            {checked
              ? "Enabled"
              : "Disabled"}
          </p>
        </div>
      </div>
    </label>
  );
}

function formatDocumentType(
  type: string
) {
  const labels: Record<string, string> = {
    GOVERNMENT_ID:
      "Government Photo ID",

    PAN_CARD:
      "PAN Card",

    ADDRESS_PROOF:
      "Address Proof",

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