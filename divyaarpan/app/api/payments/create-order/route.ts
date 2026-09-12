import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/app/lib/auth";

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
    const user = await getCurrentUser();

    const { bookingId, type } = body;
    if (typeof bookingId !== "string" || !bookingId.trim()) {
      return NextResponse.json({ success: false, error: "Booking ID is required." }, { status: 400 });
    }
    if (user?.role === "DEVOTEE" && !user.devoteeId) {
      return NextResponse.json({ success: false, error: "Customer authentication required." }, { status: 403 });
    }
    const ownerFilter = user?.role === "DEVOTEE"
      ? { devoteeId: user.devoteeId }
      : { devoteeId: null };

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

    /*
     * ==========================================================
     * TEMPLE POOJA PAYMENT
     * ==========================================================
     *
     * Temple bookings use the Booking model.
     * Book My Pandit does NOT send type: "temple", so its
     * existing flow below remains unchanged.
     */

    if (type === "temple") {
      const templeBooking = await prisma.booking.findFirst({
        where: {
          bookingId,
          ...ownerFilter,
        },
      });

      if (!templeBooking) {
        return NextResponse.json(
          {
            success: false,
            error: "Temple booking not found.",
          },
          {
            status: 404,
          }
        );
      }

      if (templeBooking.paymentStatus === "PAID") {
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

      /*
       * Price is stored as a string such as:
       * ₹1101
       *
       * Razorpay requires paise:
       * ₹1101 = 110100 paise
       */
      const numericPrice = Number(
        templeBooking.price.replace(/[^0-9.]/g, "")
      );

      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid temple booking amount.",
          },
          {
            status: 400,
          }
        );
      }

      const amountInPaise = Math.round(numericPrice * 100);

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (templeBooking.paymentOrderId) {
        if (!keyId || !keySecret) {
          return NextResponse.json(
            { success: false, error: "Payment gateway is not configured." },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          reused: true,
          order: { id: templeBooking.paymentOrderId, amount: amountInPaise, currency: "INR" },
          keyId,
          booking: {
            bookingId: templeBooking.bookingId,
            temple: templeBooking.temple,
            pooja: templeBooking.pooja,
            name: templeBooking.name,
            mobile: templeBooking.mobile,
            email: templeBooking.email,
          },
        });
      }

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

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: templeBooking.bookingId,
        notes: {
          bookingId: templeBooking.bookingId,
          temple: templeBooking.temple,
          pooja: templeBooking.pooja,
          devoteeName: templeBooking.name,
        },
      });

      const updatedBooking = await prisma.booking.update({
        where: {
          bookingId: templeBooking.bookingId,
        },
        data: {
          amount: amountInPaise,
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
          temple: updatedBooking.temple,
          pooja: updatedBooking.pooja,
          name: updatedBooking.name,
          mobile: updatedBooking.mobile,
          email: updatedBooking.email,
        },
      });
    }

    if (type === "astrology") {
      const astrologyBooking = await prisma.astrologyBooking.findFirst({
        where: { bookingId, ...ownerFilter },
      });

      if (!astrologyBooking) {
        return NextResponse.json(
          { success: false, error: "Astrology booking not found." },
          { status: 404 }
        );
      }

      if (astrologyBooking.paymentStatus === "PAID") {
        return NextResponse.json(
          { success: false, error: "This consultation has already been paid." },
          { status: 400 }
        );
      }

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        console.error("Razorpay credentials are missing.");
        return NextResponse.json(
          { success: false, error: "Payment gateway is not configured." },
          { status: 500 }
        );
      }

      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await razorpay.orders.create({
        amount: astrologyBooking.amount,
        currency: "INR",
        receipt: astrologyBooking.bookingId,
        notes: {
          bookingId: astrologyBooking.bookingId,
          service: astrologyBooking.service,
          devoteeName: astrologyBooking.name,
        },
      });

      const updatedBooking = await prisma.astrologyBooking.update({
        where: { bookingId: astrologyBooking.bookingId },
        data: { paymentOrderId: order.id },
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
          name: updatedBooking.name,
          mobile: updatedBooking.mobile,
          email: updatedBooking.email,
        },
      });
    }

    // ==========================================================
    // EXISTING BOOK MY PANDIT PAYMENT FLOW
    // ==========================================================
    // DO NOT change this logic.

    // Get the booking directly from the database.
    // The customer cannot control the amount.
    const booking = await prisma.panditBooking.findFirst({
      where: {
        bookingId,
        ...ownerFilter,
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

    if (booking.paymentStatus === "PAID") {
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