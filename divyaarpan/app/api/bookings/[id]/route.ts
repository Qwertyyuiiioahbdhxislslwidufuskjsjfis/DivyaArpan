import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "../../../lib/auth";
import { hasGuestBookingAccess } from "../../../lib/booking-access";


export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const { id } = await context.params;


    const user = await getCurrentUser();
    if (!user && !hasGuestBookingAccess(request, id)) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    const booking = await prisma.booking.findFirst({
        where: {
          bookingId: id,
          ...(user?.role === "DEVOTEE" ? { devoteeId: user.devoteeId } : {}),
        },
        include: { statusHistory: { orderBy: { createdAt: "desc" } } },
      });


    if (!booking) {

      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json({

      success: true,

      booking,

    });


  } catch (error) {

    console.error("Fetch Booking Error:", error);


    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch booking",
      },
      {
        status: 500,
      }
    );

  }

}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DEVOTEE" || !user.devoteeId) {
      return NextResponse.json({ success: false, error: "Devotee authentication required." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const action = body.action;
    const booking = await prisma.booking.findUnique({ where: { bookingId: id } });

    if (!booking || booking.devoteeId !== user.devoteeId) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }
    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return NextResponse.json({ success: false, error: "This booking can no longer be changed." }, { status: 409 });
    }

    if (action === "cancel") {
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "Cancelled" },
      });
      await prisma.bookingStatusHistory.create({
        data: { bookingId: updated.id, fromStatus: booking.status, toStatus: updated.status, actorRole: "DEVOTEE" },
      });
      return NextResponse.json({ success: true, booking: updated });
    }

    const date = typeof body.date === "string" ? body.date.trim() : "";
    const time = typeof body.time === "string" ? body.time.trim() : "";
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || !/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ success: false, error: "Choose a valid future date and time." }, { status: 400 });
    }
    if (action !== "reschedule") {
      return NextResponse.json({ success: false, error: "Unsupported booking action." }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { date, time },
    });
    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("UPDATE CUSTOMER BOOKING ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to update this booking." }, { status: 500 });
  }
}
