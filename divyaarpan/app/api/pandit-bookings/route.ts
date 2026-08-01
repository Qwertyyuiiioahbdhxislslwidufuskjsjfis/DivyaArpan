import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// GET - Fetch all bookings OR one booking by bookingId
export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId");

    // Fetch one specific booking
    if (bookingId) {
      const booking = await prisma.panditBooking.findUnique({
        where: {
          bookingId,
        },
      });

      if (!booking) {
        return NextResponse.json(
          {
            success: false,
            error: "Booking not found.",
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
    }

    // Fetch all bookings
    const bookings = await prisma.panditBooking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("GET PANDIT BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch pandit bookings.",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Create new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      service,
      city,
      address,
      language,
      date,
      time,
      sankalp,
      devoteeName,
      mobile,
      email,
    } = body;

    if (
      !service ||
      !city ||
      !address ||
      !language ||
      !date ||
      !time ||
      !devoteeName ||
      !mobile
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required booking details.",
        },
        {
          status: 400,
        }
      );
    }

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const randomCode = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase();

    const bookingId = `DPA-PND-${year}${month}${day}-${randomCode}`;

    const booking = await prisma.panditBooking.create({
      data: {
        bookingId,

        service: service.trim(),
        city: city.trim(),
        address: address.trim(),
        language: language.trim(),

        date,
        time,

        sankalp: sankalp?.trim() || null,

        devoteeName: devoteeName.trim(),
        mobile: mobile.trim(),
        email: email?.trim() || null,

        status: "AWAITING_PAYMENT",
paymentStatus: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pandit booking created successfully.",
        booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE PANDIT BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create pandit booking.",
      },
      {
        status: 500,
      }
    );
  }
}