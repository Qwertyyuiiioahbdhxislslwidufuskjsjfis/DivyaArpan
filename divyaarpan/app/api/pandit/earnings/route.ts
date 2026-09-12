import { NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/app/lib/auth";
import { addMobileCors } from "@/app/lib/mobile-cors";
import { prisma } from "@/app/lib/prisma";

function startOfLocalDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function startOfWeek(date: Date) {
  const result =
    startOfLocalDay(date);

  const day =
    result.getDay();

  const diff =
    day === 0
      ? 6
      : day - 1;

  result.setDate(
    result.getDate() - diff
  );

  return result;
}

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function GET(
  request: Request
) {
  try {
    const user =
      await getCurrentUserFromRequest(
        request
      );

    if (
      !user ||
      user.role !== "PANDIT" ||
      !user.panditId
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Pandit authentication required.",
          },
          {
            status: 401,
          }
        )
      );
    }

    const pandit =
      await prisma.pandit.findUnique({
        where: {
          id: user.panditId,
        },

        select: {
          id: true,
          panditCode: true,
          verificationStatus: true,
          isActive: true,
        },
      });

    if (!pandit) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Pandit profile not found.",
          },
          {
            status: 404,
          }
        )
      );
    }

    const completedBookings =
      await prisma.panditBooking.findMany(
        {
          where: {
            panditId:
              user.panditId,
            status:
              "COMPLETED",
          },

          select: {
            id: true,
            bookingId: true,
            service: true,
            city: true,
            state: true,
            address: true,
            date: true,
            time: true,
            amount: true,
            paymentStatus: true,
            completedAt: true,
            createdAt: true,
          },

          orderBy: [
            {
              completedAt:
                "desc",
            },
            {
              id: "desc",
            },
          ],
        }
      );

    const now =
      new Date();

    const todayStart =
      startOfLocalDay(now);

    const weekStart =
      startOfWeek(now);

    const monthStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const sumSince = (
      since: Date
    ) =>
      completedBookings
        .filter(
          (booking) =>
            booking.completedAt &&
            booking.completedAt >=
              since
        )
        .reduce(
          (sum, booking) =>
            sum +
            Number(
              booking.amount ?? 0
            ),
          0
        );

    const totalEarnings =
      completedBookings.reduce(
        (sum, booking) =>
          sum +
          Number(
            booking.amount ?? 0
          ),
        0
      );

    const paidBookingAmount =
      completedBookings
        .filter(
          (booking) =>
            booking.paymentStatus ===
            "PAID"
        )
        .reduce(
          (sum, booking) =>
            sum +
            Number(
              booking.amount ?? 0
            ),
          0
        );

    const unpaidBookingAmount =
      completedBookings
        .filter(
          (booking) =>
            booking.paymentStatus !==
            "PAID"
        )
        .reduce(
          (sum, booking) =>
            sum +
            Number(
              booking.amount ?? 0
            ),
          0
        );

    const unreadNotifications =
      await prisma.panditNotification.count(
        {
          where: {
            panditId:
              user.panditId,
            isRead: false,
          },
        }
      );

    return addMobileCors(
      NextResponse.json({
        success: true,

        summary: {
          todayEarnings:
            sumSince(
              todayStart
            ),

          weekEarnings:
            sumSince(
              weekStart
            ),

          monthEarnings:
            sumSince(
              monthStart
            ),

          totalEarnings,

          completedBookings:
            completedBookings.length,

          customerPaidBookingAmount:
            paidBookingAmount,

          customerUnpaidBookingAmount:
            unpaidBookingAmount,
        },

        earnings:
          completedBookings,

        unreadNotifications,

        settlement: {
          available: false,
          message:
            "Pandit payout and settlement tracking is not configured yet.",
        },
      })
    );
  } catch (error) {
    console.error(
      "PANDIT EARNINGS ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          message:
            "Unable to load earnings.",
        },
        {
          status: 500,
        }
      )
    );
  }
}
