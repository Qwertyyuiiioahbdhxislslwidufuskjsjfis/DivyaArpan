import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }

    const devoteeId = Number(id);
    if (!Number.isInteger(devoteeId) || devoteeId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid devotee ID." }, { status: 400 });
    }
    const devotee = await prisma.devotee.findUnique({
      where: { id: devoteeId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
        _count: { select: { bookings: true, panditBookings: true, astrologyBookings: true } },
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, bookingId: true, temple: true, pooja: true, date: true, time: true, price: true, status: true, paymentStatus: true, createdAt: true },
        },
        panditBookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, bookingId: true, service: true, city: true, date: true, time: true, panditName: true, amount: true, status: true, paymentStatus: true, createdAt: true },
        },
        astrologyBookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, bookingId: true, service: true, preferredDate: true, preferredTime: true, amount: true, status: true, paymentStatus: true, createdAt: true },
        },
      },
    });
    if (!devotee) return NextResponse.json({ success: false, message: "Devotee not found." }, { status: 404 });
    return NextResponse.json({ success: true, devotee });
  } catch (error) {
    console.error("Failed to load devotee:", error);
    return NextResponse.json({ success: false, message: "Failed to load devotee." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireRole("ADMIN"))) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    const { id } = await params;
    const devoteeId = Number(id);
    if (!Number.isInteger(devoteeId) || devoteeId <= 0) return NextResponse.json({ success: false, message: "Invalid devotee ID." }, { status: 400 });
    const existing = await prisma.devotee.findUnique({ where: { id: devoteeId } });
    if (!existing) return NextResponse.json({ success: false, message: "Devotee not found." }, { status: 404 });
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : existing.name;
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : existing.mobile;
    const email = typeof body.email === "string" && body.email.trim() ? body.email.trim().toLowerCase() : null;
    const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : null;
    const state = typeof body.state === "string" && body.state.trim() ? body.state.trim() : null;
    const country = typeof body.country === "string" && body.country.trim() ? body.country.trim() : "India";
    const isActive = typeof body.isActive === "boolean" ? body.isActive : existing.isActive;
    if (name.length < 2 || name.length > 100) return NextResponse.json({ success: false, message: "Name must be between 2 and 100 characters." }, { status: 400 });
    if (!/^\+?[0-9\s-]{10,20}$/.test(mobile)) return NextResponse.json({ success: false, message: "Please enter a valid mobile number." }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    const duplicate = await prisma.devotee.findFirst({ where: { OR: [{ mobile }, ...(email ? [{ email }] : [])], NOT: { id: devoteeId } } });
    if (duplicate) return NextResponse.json({ success: false, message: "Another devotee already uses this mobile or email." }, { status: 409 });
    const devotee = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.devotee.update({ where: { id: devoteeId }, data: { name, mobile, email, city, state, country, isActive } });
      if (existing.userId) await transaction.user.update({ where: { id: existing.userId }, data: { name, email: email || existing.email || `${mobile}@invalid.local`, phone: mobile } });
      return updated;
    });
    return NextResponse.json({ success: true, message: "Devotee updated successfully.", devotee });
  } catch (error) {
    console.error("Failed to update devotee:", error);
    return NextResponse.json({ success: false, message: "Failed to update devotee." }, { status: 500 });
  }
}