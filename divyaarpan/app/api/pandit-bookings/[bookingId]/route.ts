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

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

// GET - Fetch one Pandit booking
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { bookingId } = await context.params;

    const booking = await prisma.panditBooking.findUnique({
      where: {
        bookingId,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Pandit booking not found.",
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
  } catch (error) {
    console.error("GET PANDIT BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch pandit booking.",
      },
      {
        status: 500,
      }
    );
  }
}

// PUT - Update Pandit booking
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { bookingId } = await context.params;

    const body = await request.json();

    const {
      amount,
      panditName,
      status,
    } = body;

    const existingBooking =
      await prisma.panditBooking.findUnique({
        where: {
          bookingId,
        },
      });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Pandit booking not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
      IMPORTANT:
      We store money in paise.

      Example:
      Admin enters ₹2100
      Database stores 210000
    */

    let amountInPaise: number | null =
      existingBooking.amount;

    if (
      amount !== undefined &&
      amount !== null &&
      amount !== ""
    ) {
      const parsedAmount = Number(amount);

      if (
        Number.isNaN(parsedAmount) ||
        parsedAmount <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter a valid booking amount.",
          },
          {
            status: 400,
          }
        );
      }

      amountInPaise = Math.round(parsedAmount * 100);
    }

    const cleanPanditName =
      typeof panditName === "string"
        ? panditName.trim()
        : existingBooking.panditName;

    const cleanStatus =
      typeof status === "string" && status.trim()
        ? status.trim()
        : existingBooking.status;

    const updatedBooking =
      await prisma.panditBooking.update({
        where: {
          bookingId,
        },

        data: {
          amount: amountInPaise,

          panditName:
            cleanPanditName || null,

          status: cleanStatus,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Pandit booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "UPDATE PANDIT BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update pandit booking.",
      },
      {
        status: 500,
      }
    );
  }
}