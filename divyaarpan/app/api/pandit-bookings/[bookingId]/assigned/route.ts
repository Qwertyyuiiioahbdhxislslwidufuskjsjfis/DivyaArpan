import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/app/lib/auth";
import { hasGuestBookingAccess } from "@/app/lib/booking-access";

const prisma = new PrismaClient();

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
        {
          status: 404,
        }
      );
    }

    const isOwner = user?.role === "DEVOTEE" && booking.devoteeId === user.devoteeId;
    const isAdmin = user?.role === "ADMIN";
    if (!isOwner && !isAdmin && !hasGuestBookingAccess(request, bookingId)) {
      return NextResponse.json(
        { assigned: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (!booking.assignedPandit) {
      return NextResponse.json({
        assigned: false,
        status: booking.status,
      });
    }

    const pandit = booking.assignedPandit;

    return NextResponse.json({
      assigned: true,
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
    console.error("ASSIGNED PANDIT ERROR:", error);

    return NextResponse.json(
      {
        assigned: false,
        message: "Unable to fetch assigned pandit.",
      },
      {
        status: 500,
      }
    );
  }
}