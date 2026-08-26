import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "DEVOTEE" || !user.devoteeId) {
      return NextResponse.json(
        { success: false, error: "Devotee authentication required." },
        { status: 401 }
      );
    }

    const [templeBookings, panditBookings, astrologyBookings] = await Promise.all([
      prisma.booking.findMany({
        where: { devoteeId: user.devoteeId },
        include: { statusHistory: { orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.panditBooking.findMany({
        where: { devoteeId: user.devoteeId },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" } },
          assignedPandit: {
            select: { id: true, panditCode: true, name: true, mobile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.astrologyBooking.findMany({
        where: { devoteeId: user.devoteeId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      bookings: { temple: templeBookings, pandit: panditBookings, astrology: astrologyBookings },
    });
  } catch (error) {
    console.error("GET CUSTOMER BOOKINGS ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to load your bookings." }, { status: 500 });
  }
}