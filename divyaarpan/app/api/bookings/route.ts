import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const booking = await prisma.booking.create({
      data: {
        bookingId: body.bookingId,
        temple: body.temple,
        pooja: body.pooja,
        price: body.price,
        duration: body.duration,
        name: body.name,
        mobile: body.mobile,
        email: body.email,
        date: body.date,
        time: body.time,
        devotees: Number(body.devotees),
        sankalp: body.sankalp || null,
        status: "Payment Pending",
      },
    });

    return NextResponse.json({
      success: true,
      booking,
    });

  } catch (error: any) {

    console.error("POST BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {

  try {

    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });

  } catch (error: any) {

    console.error("GET BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}