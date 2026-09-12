import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { hasCustomerBookingAccess } from "@/app/lib/booking-access";

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();
    if (typeof bookingId !== "string" || !bookingId.trim()) {
      return NextResponse.json({ success: false, error: "Booking ID is required." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const booking = await prisma.panditBooking.findUnique({ where: { bookingId } });
    if (!booking || !hasCustomerBookingAccess(request, user, bookingId, booking.devoteeId)) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    if (booking.paymentStatus !== "PAID" && booking.status === "AWAITING_PAYMENT") {
      await prisma.panditBooking.update({
        where: { id: booking.id },
        data: { paymentStatus: "FAILED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to record payment status." }, { status: 500 });
  }
}