import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../../lib/auth";
import { getCurrentUser } from "../../lib/auth";
import { setGuestBookingCookie } from "../../lib/booking-access";

function isValidBookingDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return !Number.isNaN(parsed.getTime()) && parsed >= today;
}

function isValidBookingTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();
    const templeId = Number(body.templeId);
    const poojaId = Number(body.poojaId);

    if (!Number.isInteger(templeId) || templeId <= 0 || !Number.isInteger(poojaId) || poojaId <= 0) {
      return NextResponse.json({ success: false, error: "A valid temple and pooja are required." }, { status: 400 });
    }

    const pooja = await prisma.pooja.findFirst({
      where: { id: poojaId, templeId, isActive: true },
      include: { temple: true },
    });

    if (!pooja) {
      return NextResponse.json({ success: false, error: "The selected temple or pooja is unavailable." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const date = typeof body.date === "string" ? body.date.trim() : "";
    const time = typeof body.time === "string" ? body.time.trim() : "";
    const devoteeCount = Number(body.devotees);
    const poojaMode =
      body.poojaMode === "ON_BEHALF" || body.poojaMode === "AT_HOME"
        ? body.poojaMode
        : "DEVOTEE_PRESENT";

    if (name.length < 2 || name.length > 100 || !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(mobile) ||
        (email && !/^\S+@\S+\.\S+$/.test(email)) ||
      !isValidBookingDate(date) || !isValidBookingTime(time) ||
        !Number.isInteger(devoteeCount) || devoteeCount < 1 || devoteeCount > 50) {
      return NextResponse.json({ success: false, error: "Please provide valid booking details." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        bookingId: `DA-${crypto.randomUUID()}`,
        temple: pooja.temple.name,
        pooja: pooja.name,
        poojaMode,
        price: `₹${pooja.price}`,
        duration: pooja.duration,
        name,
        mobile,
        email,
        date,
        time,
        devotees: devoteeCount,
        sankalp: typeof body.sankalp === "string" ? body.sankalp.trim() || null : null,
        devoteeId: user?.role === "DEVOTEE" ? user.devoteeId : null,
        status: "Payment Pending",
      },
    });
    await prisma.bookingStatusHistory.create({
      data: { bookingId: booking.id, toStatus: booking.status, actorRole: user?.role || "GUEST" },
    });

    const response = NextResponse.json({ success: true, booking }, { status: 201 });
    if (!user) setGuestBookingCookie(response, request, booking.bookingId);
    return response;

  } catch (error: unknown) {

    console.error("POST BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create booking.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {

  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });

  } catch (error: unknown) {

    console.error("GET BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch bookings.",
      },
      {
        status: 500,
      }
    );
  }
}