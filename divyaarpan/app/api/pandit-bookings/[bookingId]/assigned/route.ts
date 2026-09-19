import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { hasGuestBookingAccess } from "@/app/lib/booking-access";
import { runMatchingEngine } from "@/lib/matching-engine";
import { createPanditNotification } from "@/lib/pandit-notifications";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const user = await getCurrentUser();

    const booking = await prisma.panditBooking.findUnique({
      where: {
        bookingId,
      },
      include: {
        assignedPandit: {
          include: {
            languages: true,
            services: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          assigned: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      user?.role === "DEVOTEE" &&
      booking.devoteeId === user.devoteeId;

    const isAdmin = user?.role === "ADMIN";

    if (
      !isOwner &&
      !isAdmin &&
      !hasGuestBookingAccess(request, bookingId)
    ) {
      return NextResponse.json(
        {
          assigned: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * HOUSEKEEPING
     * ---------------------------------------------------------
     *
     * The customer is actively waiting on the searching page.
     * Use that request to process expired offers.
     *
     * This keeps the matching engine backend-driven and avoids
     * making the browser responsible for matching decisions.
     */

    if (
      booking.status === "SEARCHING" &&
      !booking.panditId
    ) {
      const now = new Date();

      const expiredOffers =
        await prisma.panditBookingOffer.findMany({
          where: {
            bookingId: booking.id,
            status: "PENDING",
            expiresAt: {
              lte: now,
            },
          },
          select: {
            id: true,
          },
        });

      /*
       * Claim each expired offer independently.
       *
       * The conditional PENDING -> EXPIRED update means an accept,
       * reject, or another polling request can win the race safely.
       * Only the transaction that actually changes the offer creates
       * the expiry notification.
       */
      for (const expiredOffer of expiredOffers) {
        await prisma.$transaction(async (tx) => {
          const currentOffer =
            await tx.panditBookingOffer.findUnique({
              where: {
                id: expiredOffer.id,
              },
              include: {
                booking: true,
              },
            });

          if (
            !currentOffer ||
            currentOffer.status !== "PENDING" ||
            !currentOffer.expiresAt ||
            currentOffer.expiresAt > now
          ) {
            return;
          }

          const expiredClaim =
            await tx.panditBookingOffer.updateMany({
              where: {
                id: currentOffer.id,
                status: "PENDING",
                expiresAt: {
                  lte: now,
                },
              },
              data: {
                status: "EXPIRED",
                respondedAt: now,
              },
            });

          if (expiredClaim.count !== 1) {
            return;
          }

          await createPanditNotification(tx, {
            panditId: currentOffer.panditId,
            type: "OFFER_EXPIRED",
            title: "Booking offer expired",
            message:
              `The ${currentOffer.booking.service} request expired before it was accepted.`,
            eventKey:
              `offer-expired:${currentOffer.id}`,
            bookingId: currentOffer.bookingId,
            offerId: currentOffer.id,
          });
        });
      }

      /*
       * Re-check whether any active offers remain.
       */
      const pendingOffers =
        await prisma.panditBookingOffer.count({
          where: {
            bookingId: booking.id,
            status: "PENDING",
          },
        });

      /*
       * If all current offers have expired/been resolved,
       * start the next matching round.
       */
      if (pendingOffers === 0) {
        await runMatchingEngine(booking.id);
      }
    }

    /*
     * Fetch the latest booking state after housekeeping.
     */
    const latestBooking =
      await prisma.panditBooking.findUnique({
        where: {
          id: booking.id,
        },
        include: {
          assignedPandit: {
            include: {
              languages: true,
              services: true,
            },
          },
        },
      });

    if (!latestBooking) {
      return NextResponse.json(
        {
          assigned: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    /*
     * No Pandit assigned yet.
     */
    if (!latestBooking.assignedPandit) {
      return NextResponse.json({
        assigned: false,
        status: latestBooking.status,
      });
    }

    /*
     * Pandit assigned.
     */
    const pandit = latestBooking.assignedPandit;

    return NextResponse.json({
      assigned: true,
      status: latestBooking.status,
      pandit: {
        id: pandit.id,
        panditCode: pandit.panditCode,
        name: pandit.name,
        photo: pandit.profileImage,
        experienceYears: pandit.experienceYears,
        rating: pandit.rating,
        languages: pandit.languages,
        services: pandit.services,
        verificationStatus: pandit.verificationStatus,
        isOnline: pandit.isOnline,
      },
    });
  } catch (error) {
    console.error(
      "ASSIGNED PANDIT ERROR:",
      error
    );

    return NextResponse.json(
      {
        assigned: false,
        message: "Unable to fetch assigned pandit.",
      },
      { status: 500 }
    );
  }
}
