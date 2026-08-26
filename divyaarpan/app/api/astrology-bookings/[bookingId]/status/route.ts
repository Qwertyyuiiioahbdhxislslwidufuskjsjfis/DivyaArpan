import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../../../../lib/auth";

const allowedTransitions: Record<string, string[]> = {
  "Payment Pending": ["Confirmed", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json(
        { success: false, error: "Admin access required." },
        { status: 403 }
      );
    }

    const { bookingId } = await params;
    if (!bookingId.trim()) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const requestedStatus = typeof body.status === "string" ? body.status.trim() : "";
    const existingBooking = await prisma.astrologyBooking.findUnique({
      where: { bookingId },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Astrology booking not found." },
        { status: 404 }
      );
    }

    if (!Object.prototype.hasOwnProperty.call(allowedTransitions, requestedStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid consultation status." },
        { status: 400 }
      );
    }

    if (requestedStatus === existingBooking.status) {
      return NextResponse.json(
        { success: false, error: "Booking already has this status." },
        { status: 409 }
      );
    }

    if (!allowedTransitions[existingBooking.status]?.includes(requestedStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot change status from ${existingBooking.status} to ${requestedStatus}.`,
        },
        { status: 409 }
      );
    }

    const booking = await prisma.astrologyBooking.update({
      where: { bookingId },
      data: {
        status: requestedStatus,
        ...(requestedStatus === "Confirmed" && !existingBooking.confirmedAt
          ? { confirmedAt: new Date() }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Astrology consultation status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("UPDATE ASTROLOGY BOOKING STATUS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update astrology booking status." },
      { status: 500 }
    );
  }
}
