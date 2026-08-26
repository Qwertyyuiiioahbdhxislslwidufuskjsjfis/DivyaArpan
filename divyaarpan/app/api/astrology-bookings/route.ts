import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser, requireRole } from "../../lib/auth";
import { getAstrologyService } from "@/app/lib/astrology";

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isPhone(value: string) {
  return /^\+?[0-9\s-]{10,20}$/.test(value);
}

function isTodayOrFutureDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() >= today;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DEVOTEE" || !user.devoteeId) {
      return NextResponse.json(
        { success: false, error: "Devotee authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const serviceCode = typeof body.serviceCode === "string" ? body.serviceCode.trim() : "";
    const consultationMode = typeof body.consultationMode === "string" ? body.consultationMode.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const birthDate = typeof body.birthDate === "string" ? body.birthDate.trim() : "";
    const birthTime = typeof body.birthTime === "string" ? body.birthTime.trim() : "";
    const birthPlace = typeof body.birthPlace === "string" ? body.birthPlace.trim() : "";
    const preferredDate = typeof body.preferredDate === "string" ? body.preferredDate.trim() : "";
    const preferredTime = typeof body.preferredTime === "string" ? body.preferredTime.trim() : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";

    const service = getAstrologyService(serviceCode);
    if (!service) {
      return NextResponse.json({ success: false, error: "Please choose a valid consultation service." }, { status: 400 });
    }
    if (!consultationMode || (consultationMode !== "PHONE_CALL" && consultationMode !== "VIDEO_CALL")) {
      return NextResponse.json({ success: false, error: "Please choose a valid consultation mode." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
    }
    if (!isPhone(mobile)) {
      return NextResponse.json({ success: false, error: "Please enter a valid contact number." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !/^\d{2}:\d{2}$/.test(birthTime)) {
      return NextResponse.json({ success: false, error: "Please enter valid birth date and birth time." }, { status: 400 });
    }
    if (birthPlace.length < 2 || birthPlace.length > 140) {
      return NextResponse.json({ success: false, error: "Please enter your birth place." }, { status: 400 });
    }
    if (!isTodayOrFutureDate(preferredDate) || !/^\d{2}:\d{2}$/.test(preferredTime)) {
      return NextResponse.json({ success: false, error: "Please choose a valid preferred consultation slot." }, { status: 400 });
    }
    if (question.length < 15 || question.length > 2000) {
      return NextResponse.json({ success: false, error: "Please enter your consultation details (15 to 2000 characters)." }, { status: 400 });
    }

    const bookingId = `DA-AST-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;

    const booking = await prisma.astrologyBooking.create({
      data: {
        bookingId,
        service: service.name,
        consultationMode,
        name,
        mobile,
        email,
        birthDate,
        birthTime,
        birthPlace,
        preferredDate,
        preferredTime,
        question,
        amount: service.amount,
        devoteeId: user.devoteeId,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("CREATE ASTROLOGY BOOKING ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create astrology consultation booking." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const bookings = await prisma.astrologyBooking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("GET ASTROLOGY BOOKINGS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch astrology bookings." },
      { status: 500 }
    );
  }
}
