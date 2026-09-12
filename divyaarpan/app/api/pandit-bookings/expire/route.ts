import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runMatchingEngine } from "@/lib/matching-engine";
import { createPanditNotification } from "@/lib/pandit-notifications";

export async function POST(request: NextRequest) {
  try {
    const now = new Date();

    const expiredOffers = await prisma.panditBookingOffer.findMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        bookingId: true,
      },
    });

    let expiredCount = 0;
    let nextRoundCount = 0;

    for (const offer of expiredOffers) {
      const result = await prisma.$transaction(async (tx) => {
        const currentOffer =
          await tx.panditBookingOffer.findUnique({
            where: {
              id: offer.id,
            },
            include: {
              booking: true,
            },
          });

        if (!currentOffer) {
          return {
            expired: false,
            bookingId: null,
          };
        }

        if (currentOffer.status !== "PENDING") {
          return {
            expired: false,
            bookingId: currentOffer.bookingId,
          };
        }

          const updatedOffer = await tx.panditBookingOffer.updateMany({
          where: {
            id: currentOffer.id,
              status: "PENDING",
          },
          data: {
            status: "EXPIRED",
            respondedAt: now,
          },
        });
        if (updatedOffer.count !== 1) {
          return { expired: false, bookingId: currentOffer.bookingId };
        }

        await createPanditNotification(tx, {
          panditId: currentOffer.panditId,
          type: "OFFER_EXPIRED",
          title: "Booking offer expired",
          message: `The ${currentOffer.booking.service} request expired before it was accepted.`,
          eventKey: `offer-expired:${currentOffer.id}`,
          bookingId: currentOffer.bookingId,
          offerId: currentOffer.id,
        });

        return {
          expired: true,
          bookingId: currentOffer.bookingId,
        };
      });

      if (!result.expired || !result.bookingId) {
        continue;
      }

      expiredCount++;

      const booking = await prisma.panditBooking.findUnique({
        where: {
          id: result.bookingId,
        },
      });

      if (!booking || booking.panditId !== null) {
        continue;
      }

      const pendingOffers =
        await prisma.panditBookingOffer.count({
          where: {
            bookingId: result.bookingId,
            status: "PENDING",
          },
        });

      // Another active offer still exists.
      // Wait for that Pandit to accept/reject/expire.
      if (pendingOffers > 0) {
        continue;
      }

      // All current offers are resolved.
      // Start the next matching round.
      if (booking.status === "SEARCHING") {
        const nextOffers = await runMatchingEngine(
          result.bookingId
        );

        if (nextOffers.length > 0) {
          nextRoundCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      expiredCount,
      nextRoundCount,
    });
  } catch (error) {
    console.error(
      "EXPIRE PANDIT OFFERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process expired offers.",
      },
      {
        status: 500,
      }
    );
  }
}
