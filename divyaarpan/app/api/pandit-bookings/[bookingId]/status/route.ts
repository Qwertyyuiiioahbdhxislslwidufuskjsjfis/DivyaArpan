import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserFromRequest } from "../../../../lib/auth";
import { createPanditNotification } from "@/lib/pandit-notifications";
import { addMobileCors } from "../../../../lib/mobile-cors";

function mobileJson(
  body: unknown,
  init?: ResponseInit
) {
  return addMobileCors(
    NextResponse.json(body, init)
  );
}

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, { status: 204 })
  );
}

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

const allowedTransitions: Record<string, string[]> = {
  CONFIRMED: ["PANDIT_ON_THE_WAY"],
  PANDIT_ON_THE_WAY: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user?.panditId) {
      return mobileJson(
        {
          success: false,
          error: "Pandit authentication required.",
        },
        { status: 401 }
      );
    }

    const pandit = await prisma.pandit.findUnique({
      where: { id: user.panditId },
      select: { verificationStatus: true, isActive: true },
    });
    if (!pandit || pandit.verificationStatus !== "VERIFIED" || !pandit.isActive) {
      return mobileJson(
        { success: false, error: "Only verified active Pandits can update booking status." },
        { status: 403 }
      );
    }

    const { bookingId } = await context.params;

    const body = await request.json();
    const requestedStatus =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    const booking =
      await prisma.panditBooking.findUnique({
        where: {
          bookingId,
        },
      });

    if (!booking) {
      return mobileJson(
        {
          success: false,
          error: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.panditId !== user.panditId) {
      return mobileJson(
        {
          success: false,
          error: "You are not assigned to this booking.",
        },
        { status: 403 }
      );
    }

    const allowed =
      allowedTransitions[booking.status] || [];

    if (!allowed.includes(requestedStatus)) {
      return mobileJson(
        {
          success: false,
          error: `Cannot change status from ${booking.status} to ${requestedStatus}.`,
        },
        { status: 409 }
      );
    }

    const updated = await prisma.panditBooking.updateMany({
      where: {
        bookingId,
        panditId: user.panditId,
        status: booking.status,
      },
      data: {
        status: requestedStatus,
        ...(requestedStatus === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
    });
    if (updated.count !== 1) {
      return mobileJson(
        { success: false, error: "This booking changed before your update could be applied. Please refresh it." },
        { status: 409 }
      );
    }
    const updatedBooking = await prisma.panditBooking.findUniqueOrThrow({
      where: { bookingId },
    });

    await prisma.panditBookingStatusHistory.create({
      data: {
        bookingId: updatedBooking.id,
        fromStatus: booking.status,
        toStatus: updatedBooking.status,
        actorRole: "PANDIT",
      },
    });
    await createPanditNotification(prisma, {
      panditId: user.panditId,
      type: updatedBooking.status === "COMPLETED" ? "BOOKING_COMPLETED" : "BOOKING_STATUS_UPDATED",
      title: updatedBooking.status === "COMPLETED" ? "Pooja completed" : "Booking status updated",
      message: updatedBooking.status === "COMPLETED" ? `${updatedBooking.service} has been marked completed.` : `${updatedBooking.service} is now ${updatedBooking.status.replaceAll("_", " ").toLowerCase()}.`,
      eventKey: `booking-status:${updatedBooking.id}:${updatedBooking.status}`,
      bookingId: updatedBooking.id,
    });

    return mobileJson({
      success: true,
      message: "Booking status updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "PANDIT STATUS UPDATE ERROR:",
      error
    );

    return mobileJson(
      {
        success: false,
        error: "Unable to update booking status.",
      },
      { status: 500 }
    );
  }
}
