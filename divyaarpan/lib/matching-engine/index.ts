import { prisma } from "@/lib/prisma";
import { findEligiblePandits } from "./filters";
import { rankPandits } from "./ranking";
import { dispatchBookingOffers } from "./dispatcher";

export async function runMatchingEngine(bookingId: number) {
  console.log("");
  console.log("======================================");
  console.log("DIVYAARPAN SMART MATCH ENGINE STARTED");
  console.log("======================================");

  const booking = await prisma.panditBooking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  console.log("Booking ID:", booking.bookingId);

  // Do not start another round for an already assigned booking.
  if (booking.panditId) {
    console.log("Booking already assigned. Matching stopped.");
    return [];
  }

  // Find only Pandits who have NOT already received an offer
  // for this booking.
  const eligiblePandits = await findEligiblePandits({
    bookingId: booking.id,
    city: booking.city,
    pincode: booking.pincode,
    service: booking.service,
    language: booking.language,
    bookingType: booking.bookingType,
    date: booking.date,
    time: booking.time,
  });

  if (eligiblePandits.length === 0) {
    console.log("❌ No new eligible Pandits found.");

    await prisma.panditBooking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "NO_PANDIT_AVAILABLE",
      },
    });

    await prisma.panditBookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        fromStatus: booking.status,
        toStatus: "NO_PANDIT_AVAILABLE",
        actorRole: "SYSTEM",
      },
    });

    return [];
  }

  const rankedPandits = rankPandits(eligiblePandits);

  const offers = await dispatchBookingOffers(
    booking.id,
    rankedPandits
  );

  if (offers.length === 0) {
    await prisma.panditBooking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "NO_PANDIT_AVAILABLE",
      },
    });

    await prisma.panditBookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        fromStatus: booking.status,
        toStatus: "NO_PANDIT_AVAILABLE",
        actorRole: "SYSTEM",
      },
    });

    return offers;
  }

  // Make sure the booking remains in SEARCHING state
  // while the current offer round is active.
  if (booking.status !== "SEARCHING") {
    await prisma.panditBooking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: "SEARCHING",
        searchStartedAt: booking.searchStartedAt ?? new Date(),
      },
    });
  }

  console.log("======================================");
  console.log("MATCHING COMPLETED");
  console.log("Offers Created:", offers.length);
  console.log("======================================");

  return offers;
}
