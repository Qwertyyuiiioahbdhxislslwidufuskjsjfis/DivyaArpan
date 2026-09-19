import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "../../../../../lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const { offerId } = await params;
    const offerIdNumber = Number(offerId);

    if (!offerIdNumber || Number.isNaN(offerIdNumber)) {
      return NextResponse.json(
        { message: "Invalid offer id." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const offer = await tx.panditBookingOffer.findUnique({
        where: {
          id: offerIdNumber,
        },
        include: {
          booking: true,
          pandit: true,
        },
      });

      if (!offer) {
        throw new Error("OFFER_NOT_FOUND");
      }

      if (offer.status !== "PENDING") {
        throw new Error("OFFER_ALREADY_PROCESSED");
      }

      const now = new Date();

      if (offer.expiresAt && offer.expiresAt <= now) {
        throw new Error("OFFER_EXPIRED");
      }

      /*
       * Claim the booking atomically.
       *
       * Only one concurrent accept can change an unassigned SEARCHING
       * booking into PANDIT_ASSIGNED.
       */
      const bookingClaim = await tx.panditBooking.updateMany({
        where: {
          id: offer.bookingId,
          panditId: null,
          status: "SEARCHING",
        },
        data: {
          panditId: offer.panditId,
          panditName: offer.pandit.name,
          amount: offer.offeredAmount,
          status: "PANDIT_ASSIGNED",
          assignedAt: now,
        },
      });

      if (bookingClaim.count !== 1) {
        throw new Error("BOOKING_ALREADY_ASSIGNED");
      }

      /*
       * Claim the offer atomically as well.
       *
       * If reject/expiry processed this offer first, this update affects
       * zero rows and the entire transaction rolls back, including the
       * booking assignment above.
       */
      const acceptedOfferResult =
        await tx.panditBookingOffer.updateMany({
          where: {
            id: offer.id,
            status: "PENDING",
            expiresAt: {
              gt: now,
            },
          },
          data: {
            status: "ACCEPTED",
            respondedAt: now,
          },
        });

      if (acceptedOfferResult.count !== 1) {
        throw new Error("OFFER_ALREADY_PROCESSED");
      }

      const booking =
        await tx.panditBooking.findUniqueOrThrow({
          where: {
            id: offer.bookingId,
          },
        });

      await tx.panditBookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: offer.booking.status,
          toStatus: booking.status,
          actorRole: "ADMIN",
        },
      });

      /*
       * Once this Pandit wins, close all remaining pending offers.
       */
      await tx.panditBookingOffer.updateMany({
        where: {
          bookingId: offer.bookingId,
          id: {
            not: offer.id,
          },
          status: "PENDING",
        },
        data: {
          status: "EXPIRED",
          respondedAt: now,
        },
      });

      const acceptedOffer =
        await tx.panditBookingOffer.findUniqueOrThrow({
          where: {
            id: offer.id,
          },
        });

      return {
        booking,
        acceptedOffer,
        pandit: offer.pandit,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking accepted successfully.",
        booking: result.booking,
        offer: result.acceptedOffer,
        pandit: {
          id: result.pandit.id,
          name: result.pandit.name,
          panditCode: result.pandit.panditCode,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR";

    switch (message) {
      case "OFFER_NOT_FOUND":
        return NextResponse.json(
          { message: "Offer not found." },
          { status: 404 }
        );

      case "OFFER_ALREADY_PROCESSED":
        return NextResponse.json(
          {
            message:
              "Offer has already been processed.",
          },
          { status: 409 }
        );

      case "OFFER_EXPIRED":
        return NextResponse.json(
          {
            message: "This booking offer has expired.",
          },
          { status: 409 }
        );

      case "BOOKING_ALREADY_ASSIGNED":
        return NextResponse.json(
          {
            message:
              "Booking has already been assigned.",
          },
          { status: 409 }
        );

      default:
        console.error(error);

        return NextResponse.json(
          {
            message: "Failed to accept booking.",
          },
          {
            status: 500,
          }
        );
    }
  }
}
