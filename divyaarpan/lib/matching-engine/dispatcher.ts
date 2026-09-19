import { Prisma } from "@prisma/client";
import { RankedPandit } from "./ranking";
import { createPanditNotification } from "@/lib/pandit-notifications";

const DISPATCH_BATCH_SIZE = 5;


export async function dispatchBookingOffers(
  tx: Prisma.TransactionClient,
  bookingId: number,
  rankedPandits: RankedPandit[]
) {
  const booking = await tx.panditBooking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Find Pandits who have already received an offer for this booking.
  const existingOffers = await tx.panditBookingOffer.findMany({
    where: {
      bookingId,
    },
    select: {
      panditId: true,
    },
  });

  const alreadyOfferedPanditIds = new Set(
    existingOffers.map((offer) => offer.panditId)
  );

  // Never send the same booking to the same Pandit twice.
  const availablePandits = rankedPandits.filter(
    (pandit) => !alreadyOfferedPanditIds.has(pandit.id)
  );

  if (availablePandits.length === 0) {
    console.log("❌ No new Pandits available for this booking.");
    return [];
  }

  // Determine the next dispatch round.
  const latestOffer = await tx.panditBookingOffer.findFirst({
    where: {
      bookingId,
    },
    orderBy: {
      dispatchRound: "desc",
    },
    select: {
      dispatchRound: true,
    },
  });

  const dispatchRound = (latestOffer?.dispatchRound ?? 0) + 1;

  // Send the request to the next best available Pandits.
  const selectedPandits = availablePandits.slice(
    0,
    DISPATCH_BATCH_SIZE
  );

  const offers = [];

  for (const pandit of selectedPandits) {
    const panditService = await tx.panditService.findFirst({
      where: {
        panditId: pandit.id,
        serviceName: {
          equals: booking.service,
          mode: "insensitive",
        },
        isActive: true,
      },
    });

      // A missing price must not prevent a Pandit from receiving the booking.
      // Pandit pricing remains available in the Pandit Portal.
      if (!panditService) {
        console.log(
          `⚠️ Skipping ${pandit.name} - no active service configured for ${booking.service}`
        );
        continue;
      }

    const offer = await tx.panditBookingOffer.create({
      data: {
        bookingId,
        panditId: pandit.id,
        offeredAmount: panditService.basePrice,
        dispatchRound,
        status: "PENDING",
        expiresAt: new Date(
          Date.now() +
            (booking.bookingType === "IMMEDIATE" ? 5 : 60) *
              60 *
              1000
        ),
      },
    });

    await createPanditNotification(tx, {
      panditId: pandit.id,
      type: "BOOKING_OFFER",
      title: "New booking request",
      message: `${booking.service} in ${booking.city} is waiting for your response.`,
      eventKey: `offer-received:${offer.id}`,
      bookingId: booking.id,
      offerId: offer.id,
    });

    offers.push(offer);

      console.log(
        panditService.basePrice !== null
          ? `💰 Round ${dispatchRound}: ${pandit.name} → ₹${(panditService.basePrice / 100).toLocaleString("en-IN")}`
          : `💰 Round ${dispatchRound}: ${pandit.name} → Price not configured`
      );
  }

  console.log(
    `✅ Round ${dispatchRound}: ${offers.length} booking offers created.`
  );

  return offers;
}
