import {
  storageDeleteItem,
  storageGetItem,
} from "./storage";

const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl ||
  "https://probable-engine-56gj6xwj4w437pg9-3000.app.github.dev"
).replace(/\/+$/, "");

export const PANDIT_SESSION_KEY =
  "divyaarpan_pandit_session";

export const PANDIT_SESSION_EXPIRY_KEY =
  "divyaarpan_pandit_session_expires_at";

export const PANDIT_USER_KEY =
  "divyaarpan_pandit_user";

export async function getPanditSessionToken() {
  return storageGetItem(PANDIT_SESSION_KEY);
}

export async function clearPanditSession() {
  await Promise.all([
    storageDeleteItem(PANDIT_SESSION_KEY),
    storageDeleteItem(PANDIT_SESSION_EXPIRY_KEY),
    storageDeleteItem(PANDIT_USER_KEY),
  ]);
}

export async function panditApiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = await getPanditSessionToken();

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await clearPanditSession();
    throw new Error("SESSION_EXPIRED");
  }

  return response;
}

export async function logoutPandit() {
  const token = await getPanditSessionToken();

  /*
   * Local logout must never depend on network availability.
   * Clear device credentials first so the user is logged out
   * immediately even if the backend tunnel is unavailable.
   */
  await clearPanditSession();

  if (!token) {
    return;
  }

  /*
   * Server-side session invalidation is best-effort.
   * Never block the local logout screen on this request.
   */
  try {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      3000
    );

    try {
      await fetch(
        `${API_BASE_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.warn(
      "[AUTH] Server logout could not be completed.",
      error
    );
  }
}
