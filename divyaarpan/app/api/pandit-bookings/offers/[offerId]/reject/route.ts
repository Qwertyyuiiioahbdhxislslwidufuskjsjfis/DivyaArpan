import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runMatchingEngine } from "@/lib/matching-engine";
import { getCurrentUserFromRequest } from "../../../../../lib/auth";


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: "Pandit access required." }, { status: 403 });
    }

    if (!user.panditId) {
      return NextResponse.json({ success: false, message: "Pandit account required." }, { status: 403 });
    }

    const pandit = await prisma.pandit.findUnique({
      where: { id: user.panditId },
      select: { verificationStatus: true, isActive: true },
    });

    if (!pandit || pandit.verificationStatus !== "VERIFIED" || !pandit.isActive) {
      return NextResponse.json(
        { success: false, message: "Only verified active Pandits can reject offers." },
        { status: 403 }
      );
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

    const payload = await request.json().catch(() => ({}));
    const reason = typeof payload.reason === "string" ? payload.reason.trim() : "";

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          message: "A rejection reason is required.",
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

      if (offer.panditId !== user.panditId) {
        throw new Error("OFFER_NOT_OWNED");
      }

      if (offer.status !== "PENDING") {
        throw new Error("OFFER_ALREADY_PROCESSED");
      }

      if (offer.expiresAt && offer.expiresAt <= new Date()) {
        throw new Error("OFFER_EXPIRED");
      }

      const now = new Date();

      const rejectedOffer =
        await tx.panditBookingOffer.updateMany({
          where: {
            id: offer.id,
            panditId: user.panditId,
            status: "PENDING",
            expiresAt: {
              gt: now,
            },
          },
          data: {
            status: "DECLINED",
            respondedAt: now,
            rejectionReason: reason,
          },
        });

      if (rejectedOffer.count !== 1) {
        throw new Error("OFFER_ALREADY_PROCESSED");
      }

      const pendingOffers = await tx.panditBookingOffer.count({
        where: {
          bookingId: offer.bookingId,
          status: "PENDING",
        },
      });

      return {
        bookingId: offer.bookingId,
        pendingOffers,
      };
    });

    let bookingStatus = "SEARCHING";
    let nextRoundOffers = 0;

    /*
     * If this was the last active offer in the current round,
     * ask the matching engine for the next eligible Pandits.
     *
     * runMatchingEngine() already excludes Pandits who received
     * this booking in previous rounds. If nobody remains, the
     * matching engine will set NO_PANDIT_AVAILABLE.
     */
    if (result.pendingOffers === 0) {
      const nextOffers = await runMatchingEngine(result.bookingId);
      nextRoundOffers = nextOffers.length;

      const latestBooking = await prisma.panditBooking.findUnique({
        where: {
          id: result.bookingId,
        },
        select: {
          status: true,
        },
      });

      bookingStatus =
        latestBooking?.status ?? "NO_PANDIT_AVAILABLE";
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking offer rejected successfully.",
        bookingId: result.bookingId,
        pendingOffers: result.pendingOffers,
        nextRoundOffers,
        bookingStatus,
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

      case "OFFER_NOT_OWNED":
        return NextResponse.json(
          {
            message: "You cannot reject another Pandit's offer.",
          },
          {
            status: 403,
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

      case "OFFER_EXPIRED":
        return NextResponse.json(
          {
            message: "This offer has expired.",
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