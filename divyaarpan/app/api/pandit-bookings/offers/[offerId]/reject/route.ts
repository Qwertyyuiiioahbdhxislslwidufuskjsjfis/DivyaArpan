import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }
    const { offerId } = await params;

    const offerIdNumber = Number(offerId);

    if (Number.isNaN(offerIdNumber)) {
      return NextResponse.json(
        {
          message: "Invalid offer id.",
        },
        {
          status: 400,
        }
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

      await tx.panditBookingOffer.update({
        where: {
          id: offer.id,
        },
        data: {
          status: "DECLINED",
          respondedAt: new Date(),
        },
      });

      const pendingOffers = await tx.panditBookingOffer.count({
        where: {
          bookingId: offer.bookingId,
          status: "PENDING",
        },
      });

      if (pendingOffers === 0) {
        const updatedBooking = await tx.panditBooking.update({
          where: {
            id: offer.bookingId,
          },
          data: {
            status: "NO_PANDIT_AVAILABLE",
          },
        });
        await tx.panditBookingStatusHistory.create({
          data: { bookingId: updatedBooking.id, fromStatus: "SEARCHING", toStatus: updatedBooking.status, actorRole: "ADMIN" },
        });
      }

      return {
        bookingId: offer.bookingId,
        pendingOffers,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking offer rejected successfully.",
        bookingId: result.bookingId,
        pendingOffers: result.pendingOffers,
        bookingStatus:
          result.pendingOffers === 0
            ? "NO_PANDIT_AVAILABLE"
            : "SEARCHING",
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
          {
            message: "Offer not found.",
          },
          {
            status: 404,
          }
        );

      case "OFFER_ALREADY_PROCESSED":
        return NextResponse.json(
          {
            message: "Offer has already been processed.",
          },
          {
            status: 409,
          }
        );

      default:
        console.error(error);

        return NextResponse.json(
          {
            message: "Failed to reject booking offer.",
          },
          {
            status: 500,
          }
        );
    }
  }
}