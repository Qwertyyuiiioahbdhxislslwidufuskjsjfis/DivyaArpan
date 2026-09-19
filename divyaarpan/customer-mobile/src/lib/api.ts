const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl ||
  "https://probable-engine-56gj6xwj4w437pg9-3000.app.github.dev"
).replace(/\/+$/, "");

export type TemplePoojaBookingInput = {
  templeId: number;
  poojaId: number;
  poojaMode:
    | "DEVOTEE_PRESENT"
    | "ON_BEHALF";
  name: string;
  mobile: string;
  email?: string;
  date: string;
  time: string;
  devotees: number;
  sankalp?: string;
};

export type TemplePoojaBooking = {
  id: number;
  bookingId: string;
  temple: string;
  pooja: string;
  poojaMode: string;
  price: string;
  duration: string;
  name: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  devotees: number;
  sankalp: string | null;
  status: string;
};

type CreateBookingResponse = {
  success: boolean;
  booking?: TemplePoojaBooking;
  error?: string;
};

export async function createTemplePoojaBooking(
  input: TemplePoojaBookingInput
): Promise<TemplePoojaBooking> {
  const response = await fetch(
    `${API_BASE_URL}/api/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    }
  );

  let payload: CreateBookingResponse;

  try {
    payload =
      (await response.json()) as CreateBookingResponse;
  } catch {
    throw new Error(
      "DivyaArpan server returned an invalid response."
    );
  }

  if (
    !response.ok ||
    !payload.success ||
    !payload.booking
  ) {
    throw new Error(
      payload.error ||
        "Unable to create your Pooja booking."
    );
  }

  return payload.booking;
}


// ============================================================
// LIVE PANDIT AVAILABILITY
// ============================================================

export type PanditLiveAvailability = {
  city: string;
  service: string | null;
  language: string | null;
  availableNow: number;
  verifiedServingArea: number;
  live: boolean;
  checkedAt: string;
};

type PanditLiveAvailabilityResponse = {
  success: boolean;
  availability?: PanditLiveAvailability;
  error?: string;
};

export async function getPanditLiveAvailability(
  city: string,
  options?: {
    service?: string;
    language?: string;
  }
): Promise<PanditLiveAvailability> {
  const params = new URLSearchParams({
    city: city.trim(),
  });

  if (options?.service?.trim()) {
    params.set("service", options.service.trim());
  }

  if (options?.language?.trim()) {
    params.set("language", options.language.trim());
  }

  const response = await fetch(
    `${API_BASE_URL}/api/customer/pandits/live-availability?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );

  let payload: PanditLiveAvailabilityResponse;

  try {
    payload =
      (await response.json()) as PanditLiveAvailabilityResponse;
  } catch {
    throw new Error(
      "DivyaArpan server returned an invalid availability response."
    );
  }

  if (
    !response.ok ||
    !payload.success ||
    !payload.availability
  ) {
    throw new Error(
      payload.error ||
        "Unable to load Pandit availability."
    );
  }

  return payload.availability;
}
