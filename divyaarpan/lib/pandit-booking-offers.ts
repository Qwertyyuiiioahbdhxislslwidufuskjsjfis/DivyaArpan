import { PanditBookingStatus, type Prisma } from "@prisma/client";
import { createPanditNotification } from "@/lib/pandit-notifications";

type AcceptableOffer = {
  id: number;
  bookingId: number;
  panditId: number;
  booking: {
    id: number;
    panditId: number | null;
    status: string;
    amount: number | null;
  };
  pandit: {
    name: string;
  };
};

export async function acceptPanditBookingOffer(
  tx: Prisma.TransactionClient,
  offer: AcceptableOffer,
  actorRole: "ADMIN" | "PANDIT"
) {
  if (offer.booking.panditId !== null) {
    throw new Error("BOOKING_ALREADY_ASSIGNED");
  }

  if (!offer.booking.amount || offer.booking.amount <= 0) {
    throw new Error("FINAL_AMOUNT_REQUIRED");
  }

  const now = new Date();
  const assignmentResult = await tx.panditBooking.updateMany({
    where: {
      id: offer.bookingId,
      panditId: null,
      status: "SEARCHING",
    },
    data: {
      panditId: offer.panditId,
      panditName: offer.pandit.name,
      status: "AWAITING_PAYMENT",
      assignedAt: now,
    },
  });
  if (assignmentResult.count !== 1) {
    throw new Error("BOOKING_ALREADY_ASSIGNED");
  }

  const acceptedOfferResult = await tx.panditBookingOffer.updateMany({
    where: {
      id: offer.id,
      panditId: offer.panditId,
      status: "PENDING",
      expiresAt: { gt: now },
    },
    data: { status: "ACCEPTED", respondedAt: now },
  });
  if (acceptedOfferResult.count !== 1) {
    throw new Error("OFFER_EXPIRED_OR_PROCESSED");
  }

  const booking = await tx.panditBooking.findUniqueOrThrow({
    where: { id: offer.bookingId },
  });
  const acceptedOffer = await tx.panditBookingOffer.findUniqueOrThrow({
    where: { id: offer.id },
  });

  await tx.panditBookingStatusHistory.create({
    data: {
      bookingId: booking.id,
      fromStatus: offer.booking.status as PanditBookingStatus,
      toStatus: "AWAITING_PAYMENT",
      actorRole,
    },
  });

  await createPanditNotification(tx, {
    panditId: offer.panditId,
    type: "OFFER_ACCEPTED",
    title: "Booking assigned to you",
    message: `You accepted ${booking.service}. It is awaiting customer payment.`,
    eventKey: `offer-accepted:${offer.id}`,
    bookingId: booking.id,
    offerId: offer.id,
  });

  await tx.panditBookingOffer.updateMany({
    where: {
      bookingId: offer.bookingId,
      id: { not: offer.id },
      status: "PENDING",
    },
    data: { status: "EXPIRED", respondedAt: now },
  });

  await tx.pandit.update({
    where: { id: offer.panditId },
    data: { totalBookings: { increment: 1 } },
  });

  return { booking, acceptedOffer };
}