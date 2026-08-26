import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/app/lib/auth";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();

    const {
      bookingId,
      type,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;
    if (typeof bookingId !== "string" || !bookingId.trim()) {
      return NextResponse.json({ success: false, error: "Booking ID is required." }, { status: 400 });
    }
    if (user?.role === "DEVOTEE" && !user.devoteeId) {
      return NextResponse.json({ success: false, error: "Customer authentication required." }, { status: 403 });
    }
    const ownerFilter = user?.role === "DEVOTEE"
      ? { devoteeId: user.devoteeId }
      : { devoteeId: null };

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification details are incomplete.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * TEMPLE POOJA PAYMENT VERIFICATION
     * ==========================================================
     *
     * Book My Pandit does not send type: "temple", so the
     * existing Pandit verification flow below remains unchanged.
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

      if (!templeBooking.paymentOrderId) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment order was not found for this booking.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        templeBooking.paymentOrderId !==
        razorpay_order_id
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment order does not match this booking.",
          },
          {
            status: 400,
          }
        );
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keySecret) {
        console.error("Razorpay secret is missing.");

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

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment verification failed.",
          },
          {
            status: 400,
          }
        );
      }

      if (templeBooking.paymentStatus === "PAID") {
        if (templeBooking.paymentId === razorpay_payment_id) {
          return NextResponse.json({
            success: true,
            message: "Payment was already verified.",
            booking: {
              bookingId: templeBooking.bookingId,
              status: templeBooking.status,
              paymentStatus: templeBooking.paymentStatus,
              paymentId: templeBooking.paymentId,
              paymentOrderId: templeBooking.paymentOrderId,
            },
          });
        }
        return NextResponse.json({ success: false, error: "This booking has already been paid." }, { status: 409 });
      }

      const updatedTempleBooking =
        await prisma.booking.update({
          where: {
            bookingId,
          },
          data: {
            paymentStatus: "PAID",
            paymentId: razorpay_payment_id,
            paymentOrderId: razorpay_order_id,
            status: "Confirmed",
            confirmedAt: new Date(),
          },
        });
      if (updatedTempleBooking.status === "Confirmed") {
        await prisma.bookingStatusHistory.create({
          data: { bookingId: updatedTempleBooking.id, fromStatus: "Payment Pending", toStatus: "Confirmed", actorRole: "PAYMENT" },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully.",
        booking: {
          bookingId: updatedTempleBooking.bookingId,
          status: updatedTempleBooking.status,
          paymentStatus:
            updatedTempleBooking.paymentStatus,
          paymentId:
            updatedTempleBooking.paymentId,
          paymentOrderId:
            updatedTempleBooking.paymentOrderId,
        },
      });
    }

    if (type === "astrology") {
      if (!user || user.role !== "DEVOTEE" || !user.devoteeId) {
        return NextResponse.json(
          { success: false, error: "Devotee authentication required." },
          { status: 401 }
        );
      }

      const astrologyBooking = await prisma.astrologyBooking.findFirst({
        where: { bookingId, devoteeId: user.devoteeId },
      });

      if (!astrologyBooking) {
        return NextResponse.json(
          { success: false, error: "Astrology booking not found." },
          { status: 404 }
        );
      }

      if (!astrologyBooking.paymentOrderId) {
        return NextResponse.json(
          { success: false, error: "Payment order was not found for this booking." },
          { status: 400 }
        );
      }

      if (astrologyBooking.paymentOrderId !== razorpay_order_id) {
        return NextResponse.json(
          { success: false, error: "Payment order does not match this booking." },
          { status: 400 }
        );
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error("Razorpay secret is missing.");
        return NextResponse.json(
          { success: false, error: "Payment gateway is not configured." },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed." },
          { status: 400 }
        );
      }

      if (astrologyBooking.paymentStatus === "PAID") {
        if (astrologyBooking.paymentId === razorpay_payment_id) {
          return NextResponse.json({
            success: true,
            message: "Payment was already verified.",
            booking: {
              bookingId: astrologyBooking.bookingId,
              status: astrologyBooking.status,
              paymentStatus: astrologyBooking.paymentStatus,
              paymentId: astrologyBooking.paymentId,
              paymentOrderId: astrologyBooking.paymentOrderId,
            },
          });
        }

        return NextResponse.json(
          { success: false, error: "This consultation has already been paid." },
          { status: 409 }
        );
      }

      const updatedAstrologyBooking = await prisma.astrologyBooking.update({
        where: { bookingId },
        data: {
          paymentStatus: "PAID",
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          status: "Confirmed",
          confirmedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully.",
        booking: {
          bookingId: updatedAstrologyBooking.bookingId,
          status: updatedAstrologyBooking.status,
          paymentStatus: updatedAstrologyBooking.paymentStatus,
          paymentId: updatedAstrologyBooking.paymentId,
          paymentOrderId: updatedAstrologyBooking.paymentOrderId,
        },
      });
    }

    /*
     * ==========================================================
     * EXISTING BOOK MY PANDIT VERIFICATION FLOW
     * ==========================================================
     *
     * Do not change this branch.
     */

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

    if (!booking.paymentOrderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment order was not found for this booking.",
        },
        {
          status: 400,
        }
      );
    }

    if (booking.paymentOrderId !== razorpay_order_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment order does not match this booking.",
        },
        {
          status: 400,
        }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error("Razorpay secret is missing.");

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

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedBooking =
      await prisma.panditBooking.update({
        where: {
          bookingId,
        },
        data: {
          paymentStatus: "PAID",
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });
    if (updatedBooking.status === "CONFIRMED") {
      await prisma.panditBookingStatusHistory.create({
        data: { bookingId: updatedBooking.id, fromStatus: "AWAITING_PAYMENT", toStatus: "CONFIRMED", actorRole: "PAYMENT" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      booking: {
        bookingId: updatedBooking.bookingId,
        status: updatedBooking.status,
        paymentStatus:
          updatedBooking.paymentStatus,
        paymentId:
          updatedBooking.paymentId,
        paymentOrderId:
          updatedBooking.paymentOrderId,
      },
    });
  } catch (error) {
    console.error(
      "RAZORPAY PAYMENT VERIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      {
        status: 500,
      }
    );
  }
}