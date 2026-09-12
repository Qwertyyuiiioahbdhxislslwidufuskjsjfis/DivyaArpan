import { NextResponse } from "next/server";
import type { AuthUser } from "./auth";

export const GUEST_BOOKING_COOKIE = "divyaarpan_guest_booking";

function getGuestBookingIds(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const guestCookie = cookieHeader.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${GUEST_BOOKING_COOKIE}=`));
  if (!guestCookie) return [];

  const cookieValue = decodeURIComponent(guestCookie.slice(`${GUEST_BOOKING_COOKIE}=`.length));
  try {
    const parsed = JSON.parse(cookieValue);
    return Array.isArray(parsed) && parsed.every((value) => typeof value === "string") ? parsed : [cookieValue];
  } catch {
    return [cookieValue];
  }
}

export function hasGuestBookingAccess(request: Request, bookingId: string) {
  return getGuestBookingIds(request).includes(bookingId);
}

export function hasCustomerBookingAccess(
  request: Request,
  user: AuthUser | null,
  bookingId: string,
  devoteeId: number | null
) {
  if (user?.role === "DEVOTEE") {
    return user.devoteeId !== null && user.devoteeId === devoteeId;
  }

  return hasGuestBookingAccess(request, bookingId);
}

export function setGuestBookingCookie(response: NextResponse, request: Request, bookingId: string) {
  const bookingIds = getGuestBookingIds(request);
  if (!bookingIds.includes(bookingId)) bookingIds.push(bookingId);

  response.cookies.set(GUEST_BOOKING_COOKIE, JSON.stringify(bookingIds), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}