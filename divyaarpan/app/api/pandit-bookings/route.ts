import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runMatchingEngine } from "@/lib/matching-engine";
import { getCurrentUser } from "@/app/lib/auth";
import { hasGuestBookingAccess, setGuestBookingCookie } from "@/app/lib/booking-access";


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
    const user = await getCurrentUser();

    // Fetch one specific booking
    if (bookingId) {
      if (!user && !hasGuestBookingAccess(request, bookingId)) {
        return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
      }
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

      if (user?.role === "DEVOTEE" && booking.devoteeId !== user.devoteeId) {
        return NextResponse.json(
          { success: false, error: "Booking not found." },
          { status: 404 }
        );
      }

      if (user?.role === "PANDIT" && booking.panditId !== user.panditId) {
        return NextResponse.json(
          { success: false, error: "Booking not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        booking,
      });
    }

    // Fetch all bookings
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required." },
        { status: 403 }
      );
    }

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
    const user = await getCurrentUser();

    const {
      service,
      city,
      address,
      language,
      date,
      time,
      sankalp,
      state,
      pincode,
      bookingType,
      urgency,
      samagriRequired,
      devoteeName,
      mobile,
      email,
    } = body;

    const cleanService = typeof service === "string" ? service.trim() : "";
    const cleanCity = typeof city === "string" ? city.trim() : "";
    const cleanAddress = typeof address === "string" ? address.trim() : "";
    const cleanLanguage = typeof language === "string" ? language.trim() : "";
    const cleanDate = typeof date === "string" ? date.trim() : "";
    const cleanTime = typeof time === "string" ? time.trim() : "";
    const cleanName = typeof devoteeName === "string" ? devoteeName.trim() : "";
    const cleanMobile = typeof mobile === "string" ? mobile.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanState = typeof state === "string" ? state.trim() : "";
    const cleanPincode = typeof pincode === "string" ? pincode.trim() : "";
    const normalizedBookingType = bookingType === "IMMEDIATE" ? "IMMEDIATE" : "SCHEDULED";
    const normalizedUrgency = urgency === "ASAP" || urgency === "WITHIN_1_HOUR" || urgency === "WITHIN_2_HOURS" || urgency === "WITHIN_4_HOURS" ? urgency : "SCHEDULED";

    if (bookingType !== undefined && bookingType !== "IMMEDIATE" && bookingType !== "SCHEDULED") {
      return NextResponse.json({ success: false, error: "Booking type must be IMMEDIATE or SCHEDULED." }, { status: 400 });
    }

    if (urgency !== undefined && !["ASAP", "WITHIN_1_HOUR", "WITHIN_2_HOURS", "WITHIN_4_HOURS", "SCHEDULED"].includes(urgency)) {
      return NextResponse.json({ success: false, error: "Invalid booking urgency." }, { status: 400 });
    }

    if (!cleanService || !cleanCity || !cleanAddress || !cleanLanguage || !cleanName || !/^(?:\+91)?[6-9]\d{9}$/.test(cleanMobile) || (cleanEmail && !/^\S+@\S+\.\S+$/.test(cleanEmail)) || (cleanPincode && !/^\d{6}$/.test(cleanPincode))) {
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

    if (normalizedBookingType === "SCHEDULED" && (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) || cleanDate < new Date().toISOString().slice(0, 10) || !cleanTime)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid future date and time." },
        { status: 400 }
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

    service: cleanService,
    city: cleanCity,
    address: cleanAddress,
    language: cleanLanguage,

    date: normalizedBookingType === "IMMEDIATE" ? cleanDate || new Date().toISOString().slice(0, 10) : cleanDate,
    time: normalizedBookingType === "IMMEDIATE" ? cleanTime || "ASAP" : cleanTime,

    sankalp: sankalp?.trim() || null,
    samagriRequired: samagriRequired === true,
    state: cleanState || null,
    pincode: cleanPincode || null,
    bookingType: normalizedBookingType,
    urgency: normalizedBookingType === "IMMEDIATE" ? normalizedUrgency : "SCHEDULED",

    devoteeName: cleanName,
    mobile: cleanMobile,
    email: cleanEmail || null,

    devoteeId: user?.role === "DEVOTEE" ? user.devoteeId : null,

    // Booking enters the Smart Matching Engine immediately
    status: "SEARCHING",

    // Customer pays only after a pandit accepts
    paymentStatus: "PENDING",
  },
});
    await prisma.panditBookingStatusHistory.create({
      data: { bookingId: booking.id, toStatus: booking.status, actorRole: user?.role || "GUEST" },
    });

// 🚀 Start Smart Matching Engine
await runMatchingEngine(booking.id);
    const response = NextResponse.json(
      {
        success: true,
        message: "Pandit booking created successfully.",
        booking,
      },
      {
        status: 201,
      }
    );
    if (!user || user.role !== "DEVOTEE") {
        setGuestBookingCookie(response, request, booking.bookingId);
      }
    return response;
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