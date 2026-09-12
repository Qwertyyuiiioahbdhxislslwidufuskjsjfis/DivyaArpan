import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../../../lib/auth";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const user = await requireRole("PANDIT");
    if (!user) {
      return NextResponse.json({ success: false, message: "Pandit access required." }, { status: 403 });
    }
    const { offerId } = await params;

    const numericOfferId = Number(offerId);

    if (!numericOfferId || Number.isNaN(numericOfferId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid offer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Find the offer and the related Pandit
      const offer = await tx.panditBookingOffer.findUnique({
        where: {
          id: numericOfferId,
        },
        include: {
          booking: true,
          pandit: true,
        },
      });

      if (!offer) {
        throw new Error("BOOKING_OFFER_NOT_FOUND");
      }

      if (!user.panditId || offer.panditId !== user.panditId) {
        throw new Error("OFFER_NOT_OWNED");
      }

      // Offer must still be available
      if (offer.status !== "PENDING") {
        throw new Error("OFFER_ALREADY_PROCESSED");
      }

      // Another Pandit may already have accepted this booking
      if (
        offer.booking.status !== "SEARCHING" ||
        offer.booking.panditId !== null
      ) {
        throw new Error("BOOKING_ALREADY_ASSIGNED");
      }

      const now = new Date();

      // Accept this offer
      await tx.panditBookingOffer.update({
        where: {
          id: offer.id,
        },
        data: {
          status: "ACCEPTED",
          respondedAt: now,
        },
      });

      // Automatically assign the booking to this Pandit
      const booking = await tx.panditBooking.update({
        where: {
          id: offer.bookingId,
        },
        data: {
  panditId: offer.panditId,
  panditName: offer.pandit.name,
  amount: offer.offeredAmount,
  status: "PANDIT_ASSIGNED",
  assignedAt: now,
},
      });
      await tx.panditBookingStatusHistory.create({
        data: { bookingId: booking.id, fromStatus: offer.booking.status, toStatus: booking.status, actorRole: "PANDIT" },
      });

      // All other Pandit offers become expired
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

      // Update Pandit's booking count
      await tx.pandit.update({
        where: {
          id: offer.panditId,
        },
        data: {
          totalBookings: {
            increment: 1,
          },
        },
      });

      return {
        booking,
        offer,
        pandit: offer.pandit,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Booking accepted and Pandit assigned successfully.",
      booking: result.booking,
      offer: {
        id: result.offer.id,
        status: result.offer.status,
        offeredAmount: result.offer.offeredAmount,
      },
      pandit: {
        id: result.pandit.id,
        panditCode: result.pandit.panditCode,
        name: result.pandit.name,
      },
    });
  } catch (error) {
    console.error("ACCEPT BOOKING ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "BOOKING_OFFER_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            message: "Booking offer not found.",
          },
          {
            status: 404,
          }
        );
      }

      if (error.message === "OFFER_NOT_OWNED") {
        return NextResponse.json(
          { success: false, message: "You cannot accept another Pandit's offer." },
          { status: 403 }
        );
      }

      if (error.message === "OFFER_ALREADY_PROCESSED") {
        return NextResponse.json(
          {
            success: false,
            message: "This booking offer has already been processed.",
          },
          {
            status: 400,
          }
        );
      }

      if (error.message === "BOOKING_ALREADY_ASSIGNED") {
        return NextResponse.json(
          {
            success: false,
            message: "This booking has already been assigned to another Pandit.",
          },
          {
            status: 409,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to accept booking.",
      },
      {
        status: 500,
      }
    );
  }
}