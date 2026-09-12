import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getCurrentUserFromRequest,
} from "@/app/lib/auth";
import {
  addMobileCors,
} from "@/app/lib/mobile-cors";
import { prisma } from "@/lib/prisma";

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function GET(
  request: NextRequest
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
            message:
              "Pandit authentication required.",
          },
          {
            status: 401,
          }
        )
      );
    }

    const [
      notifications,
      unreadCount,
    ] = await Promise.all([
      prisma.panditNotification.findMany({
        where: {
          panditId:
            user.panditId,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take: 100,
      }),

      prisma.panditNotification.count({
        where: {
          panditId:
            user.panditId,
          isRead: false,
        },
      }),
    ]);

    const bookingIds = [
      ...new Set(
        notifications
          .map(
            (notification) =>
              notification.bookingId
          )
          .filter(
            (
              id
            ): id is number =>
              typeof id ===
              "number"
          )
      ),
    ];

    const bookings =
      bookingIds.length > 0
        ? await prisma.panditBooking.findMany(
            {
              where: {
                id: {
                  in: bookingIds,
                },
                panditId:
                  user.panditId,
              },

              select: {
                id: true,
                bookingId: true,
              },
            }
          )
        : [];

    const publicBookingIds =
      new Map(
        bookings.map(
          (booking) => [
            booking.id,
            booking.bookingId,
          ]
        )
      );

    return addMobileCors(
      NextResponse.json({
        notifications:
          notifications.map(
            (notification) => ({
              ...notification,

              publicBookingId:
                notification.bookingId
                  ? publicBookingIds.get(
                      notification.bookingId
                    ) ?? null
                  : null,
            })
          ),

        unreadCount,
      })
    );
  } catch (error) {
    console.error(
      "PANDIT NOTIFICATIONS GET ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          message:
            "Unable to load notifications.",
        },
        {
          status: 500,
        }
      )
    );
  }
}

export async function PATCH(
  request: NextRequest
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
            message:
              "Pandit authentication required.",
          },
          {
            status: 401,
          }
        )
      );
    }

    const body =
      await request.json();

    if (
      body.action ===
      "mark-all-read"
    ) {
      await prisma.panditNotification.updateMany(
        {
          where: {
            panditId:
              user.panditId,
            isRead: false,
          },

          data: {
            isRead: true,
          },
        }
      );

      return addMobileCors(
        NextResponse.json({
          success: true,
          unreadCount: 0,
        })
      );
    }

    const notificationId =
      Number(
        body.notificationId
      );

    if (
      !Number.isInteger(
        notificationId
      ) ||
      notificationId <= 0
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            message:
              "A valid notification is required.",
          },
          {
            status: 400,
          }
        )
      );
    }

    const updated =
      await prisma.panditNotification.updateMany(
        {
          where: {
            id:
              notificationId,
            panditId:
              user.panditId,
          },

          data: {
            isRead: true,
          },
        }
      );

    if (
      updated.count !== 1
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            message:
              "Notification not found.",
          },
          {
            status: 404,
          }
        )
      );
    }

    const unreadCount =
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
        unreadCount,
      })
    );
  } catch (error) {
    console.error(
      "PANDIT NOTIFICATIONS PATCH ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          message:
            "Unable to update notification.",
        },
        {
          status: 500,
        }
      )
    );
  }
}
