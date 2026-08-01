import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const { offerId } = await params;

    const offerIdNumber = Number(offerId);

    if (Number.isNaN(offerIdNumber)) {
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

      const latestBooking = await tx.panditBooking.findUnique({
        where: {
          id: offer.bookingId,
        },
      });

      if (!latestBooking) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      if (latestBooking.panditId) {
        throw new Error("BOOKING_ALREADY_ASSIGNED");
      }

      const acceptedOffer = await tx.panditBookingOffer.update({
        where: {
          id: offer.id,
        },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });

      const booking = await tx.panditBooking.update({
        where: {
          id: latestBooking.id,
        },
        data: {
          panditId: offer.panditId,
          panditName: offer.pandit.name,
          status: "PANDIT_ASSIGNED",
          assignedAt: new Date(),
        },
      });

      await tx.panditBookingOffer.updateMany({
        where: {
          bookingId: latestBooking.id,
          id: {
            not: offer.id,
          },
          status: "PENDING",
        },
        data: {
          status: "EXPIRED",
          respondedAt: new Date(),
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
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    switch (message) {
      case "OFFER_NOT_FOUND":
        return NextResponse.json(
          { message: "Offer not found." },
          { status: 404 }
        );

      case "BOOKING_NOT_FOUND":
        return NextResponse.json(
          { message: "Booking not found." },
          { status: 404 }
        );

      case "OFFER_ALREADY_PROCESSED":
        return NextResponse.json(
          { message: "Offer has already been processed." },
          { status: 409 }
        );

      case "BOOKING_ALREADY_ASSIGNED":
        return NextResponse.json(
          { message: "Booking has already been assigned." },
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