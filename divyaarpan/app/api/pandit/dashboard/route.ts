import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole("PANDIT", "ADMIN");
    if (!user) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);

    const requestedPanditId = Number(searchParams.get("panditId"));
    const panditId = user.role === "PANDIT" ? user.panditId : requestedPanditId;

    if (!panditId || Number.isNaN(panditId)) {
      return NextResponse.json(
        {
          message: "Valid panditId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },
    });

    if (!pandit) {
      return NextResponse.json(
        {
          message: "Pandit not found.",
        },
        {
          status: 404,
        }
      );
    }

    const pendingOffers = await prisma.panditBookingOffer.findMany({
      where: {
        panditId,
        status: "PENDING",
      },
      include: {
        booking: true,
      },
      orderBy: {
        offeredAt: "desc",
      },
    });

    const assignedBookings = await prisma.panditBooking.findMany({
      where: {
        panditId,
        status: {
          in: [
            "PANDIT_ASSIGNED",
            "CONFIRMED",
            "PANDIT_ON_THE_WAY",
            "IN_PROGRESS",
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const completedBookings = await prisma.panditBooking.findMany({
      where: {
        panditId,
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayCompleted = completedBookings.filter(
      (booking) =>
        booking.completedAt &&
        booking.completedAt >= today
    );

    const todayEarnings = todayCompleted.reduce(
      (sum, booking) => sum + Number(booking.amount ?? 0),
      0
    );

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + Number(booking.amount ?? 0),
      0
    );

    return NextResponse.json({
      pandit: {
        id: pandit.id,
        panditCode: pandit.panditCode,
        name: pandit.name,
        rating: pandit.rating,
        experienceYears: pandit.experienceYears,
        isOnline: pandit.isOnline,
        verificationStatus: pandit.verificationStatus,
      },

      statistics: {
        pendingOffers: pendingOffers.length,
        assignedBookings: assignedBookings.length,
        completedBookings: completedBookings.length,
        todayEarnings,
        totalEarnings,
      },

      pendingOffers,
      assignedBookings,
      completedBookings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}