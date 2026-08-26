import { prisma } from "@/lib/prisma";
import { RankedPandit } from "./ranking";

export async function dispatchBookingOffers(
  bookingId: number,
  rankedPandits: RankedPandit[]
) {
  // Fetch the booking so we know which service the customer requested
  const booking = await prisma.panditBooking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Send booking to Top 5 ranked Pandits
  const selectedPandits = rankedPandits.slice(0, 5);

  const offers = [];

  for (const pandit of selectedPandits) {
    // Find this Pandit's active price for the requested service
    const panditService = await prisma.panditService.findFirst({
      where: {
        panditId: pandit.id,
        serviceName: booking.service,
        isActive: true,
      },
    });

    // If the Pandit has no active price for this service,
    // don't create an offer with an unknown amount.
    if (!panditService || panditService.basePrice === null) {
      console.log(
        `⚠️ Skipping ${pandit.name} - no active price found for ${booking.service}`
      );

      continue;
    }

    const offer = await prisma.panditBookingOffer.create({
      data: {
        bookingId,
        panditId: pandit.id,
        offeredAmount: panditService.basePrice,
        dispatchRound: 1,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
    });

    offers.push(offer);

    console.log(
      `💰 Offer created: ${pandit.name} → ₹${(
        panditService.basePrice / 100
      ).toLocaleString("en-IN")}`
    );
  }

  console.log(
    `✅ ${offers.length} booking offers created successfully.`
  );

  return offers;
}