import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../../../../lib/auth";

const allowedStatuses = [
  "Payment Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const allowedTransitions: Record<string, string[]> = {
  "Payment Pending": ["Confirmed", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();

    const bookingId = Number(id);
    const status = body.status;

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID.",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking status.",
        },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (existingBooking.status === status) {
      return NextResponse.json({ success: false, message: "Booking already has this status." }, { status: 409 });
    }

    if (!allowedTransitions[existingBooking.status]?.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Cannot change status from ${existingBooking.status} to ${status}.` },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    });
    if (existingBooking.status !== booking.status) {
      await prisma.bookingStatusHistory.create({
        data: { bookingId: booking.id, fromStatus: existingBooking.status, toStatus: booking.status, actorRole: "ADMIN" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Failed to update booking status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking status.",
      },
      { status: 500 }
    );
  }
}