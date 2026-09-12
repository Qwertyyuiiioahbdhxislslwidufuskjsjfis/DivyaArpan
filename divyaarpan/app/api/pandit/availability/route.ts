import { NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/app/lib/auth";
import { addMobileCors } from "@/app/lib/mobile-cors";
import { prisma } from "@/app/lib/prisma";

type AvailabilityInput = {
  dayOfWeek?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  isAvailable?: unknown;
};

type CleanAvailability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

const timePattern =
  /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function timeInMinutes(value: string) {
  const [hours, minutes] =
    value.split(":").map(Number);

  return hours * 60 + minutes;
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
          isOnline: true,
          acceptsImmediate: true,
          acceptsScheduled: true,

          availability: {
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              isAvailable: true,
            },
            orderBy: {
              dayOfWeek: "asc",
            },
          },

          serviceAreas: {
            select: {
              id: true,
              city: true,
              area: true,
              pincode: true,
              serviceRadiusKm: true,
            },
            orderBy: {
              id: "asc",
            },
          },
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

    const radius =
      pandit.serviceAreas.find(
        (area) =>
          area.serviceRadiusKm != null
      )?.serviceRadiusKm ?? 10;

    const unreadNotifications =
      await prisma.panditNotification.count(
        {
          where: {
            panditId: user.panditId,
            isRead: false,
          },
        }
      );

    return addMobileCors(
      NextResponse.json({
        success: true,

        availability: {
          panditId: pandit.id,
          panditCode:
            pandit.panditCode,

          verificationStatus:
            pandit.verificationStatus,

          isActive:
            pandit.isActive,

          isOnline:
            pandit.isOnline,

          acceptsImmediate:
            pandit.acceptsImmediate,

          acceptsScheduled:
            pandit.acceptsScheduled,

          radiusKm:
            Number(radius),

          weekly:
            pandit.availability,

          serviceAreas:
            pandit.serviceAreas,
        },

        unreadNotifications,
      })
    );
  } catch (error) {
    console.error(
      "PANDIT AVAILABILITY GET ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          message:
            "Unable to load availability.",
        },
        {
          status: 500,
        }
      )
    );
  }
}

export async function PATCH(
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

    if (
      !pandit.isActive ||
      pandit.verificationStatus !==
        "VERIFIED"
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Only verified active Pandits can update availability.",
          },
          {
            status: 403,
          }
        )
      );
    }

    const body =
      await request.json();

    if (
      typeof body.isOnline !==
        "boolean" ||
      typeof body.acceptsImmediate !==
        "boolean" ||
      typeof body.acceptsScheduled !==
        "boolean"
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Invalid booking preference values.",
          },
          {
            status: 400,
          }
        )
      );
    }

    const radiusKm =
      Number(body.radiusKm);

    const allowedRadii =
      [5, 10, 15, 25, 50];

    if (
      !allowedRadii.includes(
        radiusKm
      )
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Select a valid service radius.",
          },
          {
            status: 400,
          }
        )
      );
    }

    if (
      !Array.isArray(
        body.weekly
      )
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Weekly availability is required.",
          },
          {
            status: 400,
          }
        )
      );
    }

    const weekly: CleanAvailability[] =
      body.weekly.map(
        (
          item: AvailabilityInput
        ): CleanAvailability => ({
          dayOfWeek:
            Number(
              item.dayOfWeek
            ),

          startTime:
            typeof item.startTime ===
            "string"
              ? item.startTime.trim()
              : "",

          endTime:
            typeof item.endTime ===
            "string"
              ? item.endTime.trim()
              : "",

          isAvailable:
            item.isAvailable === true,
        })
      );

    if (
      weekly.length !== 7
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Availability must contain all seven days.",
          },
          {
            status: 400,
          }
        )
      );
    }

    const uniqueDays =
      new Set(
        weekly.map(
          (item) =>
            item.dayOfWeek
        )
      );

    if (
      uniqueDays.size !== 7 ||
      weekly.some(
        (item) =>
          !Number.isInteger(
            item.dayOfWeek
          ) ||
          item.dayOfWeek < 0 ||
          item.dayOfWeek > 6
      )
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Weekly availability contains invalid days.",
          },
          {
            status: 400,
          }
        )
      );
    }

    const invalidTime =
      weekly.find(
        (item) =>
          item.isAvailable &&
          (
            !timePattern.test(
              item.startTime
            ) ||
            !timePattern.test(
              item.endTime
            ) ||
            timeInMinutes(
              item.startTime
            ) >=
              timeInMinutes(
                item.endTime
              )
          )
      );

    if (invalidTime) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            message:
              "Each available day must have a valid start time before its end time.",
          },
          {
            status: 400,
          }
        )
      );
    }

    await prisma.$transaction(
      async (transaction) => {
        await transaction.pandit.update(
          {
            where: {
              id: user.panditId!,
            },

            data: {
              isOnline:
                body.isOnline,

              acceptsImmediate:
                body.acceptsImmediate,

              acceptsScheduled:
                body.acceptsScheduled,
            },
          }
        );

        await transaction
          .panditAvailability
          .deleteMany({
            where: {
              panditId:
                user.panditId!,
            },
          });

        await transaction
          .panditAvailability
          .createMany({
            data: weekly.map(
              (item) => ({
                panditId:
                  user.panditId!,

                dayOfWeek:
                  item.dayOfWeek,

                startTime:
                  item.startTime,

                endTime:
                  item.endTime,

                isAvailable:
                  item.isAvailable,
              })
            ),
          });

        await transaction
          .panditServiceArea
          .updateMany({
            where: {
              panditId:
                user.panditId!,
            },

            data: {
              serviceRadiusKm:
                radiusKm,
            },
          });
      }
    );

    const updated =
      await prisma.pandit.findUnique({
        where: {
          id: user.panditId,
        },

        select: {
          id: true,
          isOnline: true,
          acceptsImmediate: true,
          acceptsScheduled: true,

          availability: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              isAvailable: true,
            },
            orderBy: {
              dayOfWeek: "asc",
            },
          },

          serviceAreas: {
            select: {
              id: true,
              serviceRadiusKm: true,
            },
          },
        },
      });

    return addMobileCors(
      NextResponse.json({
        success: true,
        message:
          "Availability updated successfully.",
        pandit: updated,
        radiusKm,
      })
    );
  } catch (error) {
    console.error(
      "PANDIT AVAILABILITY PATCH ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          message:
            "Unable to update availability.",
        },
        {
          status: 500,
        }
      )
    );
  }
}
