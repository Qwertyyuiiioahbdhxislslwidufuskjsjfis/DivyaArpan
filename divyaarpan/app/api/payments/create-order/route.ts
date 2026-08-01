import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Get the booking directly from the database.
    // The customer cannot control the amount.
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

    if (!booking.amount || booking.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Booking amount has not been assigned yet.",
        },
        {
          status: 400,
        }
      );
    }

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json(
        {
          success: false,
          error: "This booking has already been paid.",
        },
        {
          status: 400,
        }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials are missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Payment gateway is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // booking.amount is already stored in paise.
    // Example:
    // ₹2,100 = 210000 paise
    const order = await razorpay.orders.create({
      amount: booking.amount,
      currency: "INR",
      receipt: booking.bookingId,
      notes: {
        bookingId: booking.bookingId,
        service: booking.service,
        devoteeName: booking.devoteeName,
      },
    });

    // Save the Razorpay order ID against the booking.
    const updatedBooking =
      await prisma.panditBooking.update({
        where: {
          bookingId: booking.bookingId,
        },
        data: {
          paymentOrderId: order.id,
        },
      });

    return NextResponse.json({
      success: true,

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      keyId,

      booking: {
        bookingId: updatedBooking.bookingId,
        service: updatedBooking.service,
        devoteeName: updatedBooking.devoteeName,
        mobile: updatedBooking.mobile,
        email: updatedBooking.email,
      },
    });
  } catch (error) {
    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create payment order.",
      },
      {
        status: 500,
      }
    );
  }
}