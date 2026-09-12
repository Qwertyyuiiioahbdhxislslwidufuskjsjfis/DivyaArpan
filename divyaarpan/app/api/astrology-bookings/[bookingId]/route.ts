import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { bookingId } = await context.params;

    const booking = await prisma.astrologyBooking.findUnique({
      where: { bookingId },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Astrology booking not found." }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (user.role === "DEVOTEE" && booking.devoteeId !== user.devoteeId) {
      return NextResponse.json({ success: false, error: "Astrology booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("GET ASTROLOGY BOOKING ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch astrology booking." },
      { status: 500 }
    );
  }
}
