import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUserFromRequest,
} from "@/app/lib/auth";
import {
  addMobileCors,
} from "@/app/lib/mobile-cors";

type ServiceAreaInput = {
  city?: unknown;
  area?: unknown;
  pincode?: unknown;
  serviceRadiusKm?: unknown;
};

type AvailabilityInput = {
  dayOfWeek?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  isAvailable?: unknown;
};

type CleanServiceArea = {
  city: string;
  area: string;
  pincode: string;
  serviceRadiusKm: number | null;
};

type CleanAvailability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function cleanText(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function cleanStringArray(value: unknown, maximumLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item: unknown) => cleanText(item, maximumLength)).filter(Boolean))] as string[];
}

function timeInMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
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
  request: NextRequest
) {
  try {
    const user =
      await getCurrentUserFromRequest(
        request
      );

    if (
      !user ||
      !["PANDIT", "ADMIN"].includes(
        user.role
      ) ||
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
      pandit,
      unreadNotifications,
    ] = await Promise.all([
      prisma.pandit.findUnique({
        where: {
          id: user.panditId,
        },
        select: {
          id: true,
          panditCode: true,
          name: true,
          mobile: true,
          email: true,
          profileImage: true,
          experienceYears: true,
          bio: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          verificationStatus: true,
          isActive: true,
          isOnline: true,
          acceptsImmediate: true,
          acceptsScheduled: true,
          rating: true,
          totalRatings: true,
          totalBookings: true,
          createdAt: true,

          languages: {
            select: {
              language: true,
            },
            orderBy: {
              language: "asc",
            },
          },

          services: {
            select: {
              serviceName: true,
            },
            orderBy: {
              serviceName: "asc",
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
        },
      }),

      prisma.panditNotification.count({
        where: {
          panditId: user.panditId,
          isRead: false,
        },
      }),
    ]);

    if (!pandit) {
      return addMobileCors(
        NextResponse.json(
          {
            message:
              "Pandit not found.",
          },
          {
            status: 404,
          }
        )
      );
    }

    return addMobileCors(
      NextResponse.json({
        pandit,
        unreadNotifications,
      })
    );
  } catch (error) {
    console.error(
      "GET PANDIT PROFILE ERROR:",
      error
    );

    return addMobileCors(
      NextResponse.json(
        {
          message:
            "Unable to load your profile.",
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
      !["PANDIT", "ADMIN"].includes(
        user.role
      ) ||
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

    const body = await request.json();

    /*
     * Mobile-safe profile edit.
     *
     * This intentionally updates only basic
     * profile fields. It must NOT replace
     * languages, services, service areas or
     * availability.
     */
    if (
      body.action ===
      "basic-profile"
    ) {
      const name =
        cleanText(
          body.name,
          100
        );

      const mobile =
        cleanText(
          body.mobile,
          20
        );

      const address =
        cleanText(
          body.address,
          500
        );

      const city =
        cleanText(
          body.city,
          100
        );

      const state =
        cleanText(
          body.state,
          100
        );

      const pincode =
        cleanText(
          body.pincode,
          6
        );

      const bio =
        cleanText(
          body.bio,
          2000
        );

      const experienceYears =
        Number(
          body.experienceYears
        );

      if (
        name.length < 2 ||
        !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(
          mobile
        ) ||
        !address ||
        !city ||
        !state ||
        !/^\d{6}$/.test(
          pincode
        ) ||
        !Number.isInteger(
          experienceYears
        ) ||
        experienceYears < 0 ||
        experienceYears > 80
      ) {
        return addMobileCors(
          NextResponse.json(
            {
              message:
                "Enter valid profile details, Indian mobile number and 6-digit pincode.",
            },
            {
              status: 400,
            }
          )
        );
      }

      const currentPandit =
        await prisma.pandit.findUnique(
          {
            where: {
              id:
                user.panditId,
            },

            select: {
              isActive: true,
              verificationStatus:
                true,
            },
          }
        );

      if (
        !currentPandit ||
        !currentPandit.isActive ||
        currentPandit.verificationStatus !==
          "VERIFIED"
      ) {
        return addMobileCors(
          NextResponse.json(
            {
              message:
                "Only verified active Pandits can update their profile.",
            },
            {
              status: 403,
            }
          )
        );
      }

      await prisma.pandit.update({
        where: {
          id: user.panditId,
        },

        data: {
          name,
          mobile,
          address,
          city,
          state,
          pincode,
          bio:
            bio || null,
          experienceYears,
        },
      });

      return GET(request);
    }
    const name = cleanText(body.name, 100);
    const mobile = cleanText(body.mobile, 20);
    const address = cleanText(body.address, 500);
    const city = cleanText(body.city, 100);
    const state = cleanText(body.state, 100);
    const pincode = cleanText(body.pincode, 6);
    const bio = cleanText(body.bio, 2000);
    const experienceYears = Number(body.experienceYears);
    const languages = cleanStringArray(body.languages, 50);
    const services = cleanStringArray(body.services, 100);
    const serviceAreas: CleanServiceArea[] = Array.isArray(body.serviceAreas)
      ? body.serviceAreas.map((entry: ServiceAreaInput) => ({
          city: cleanText(entry.city, 100),
          area: cleanText(entry.area, 150),
          pincode: cleanText(entry.pincode, 6),
          serviceRadiusKm: entry.serviceRadiusKm === "" || entry.serviceRadiusKm === undefined ? null : Number(entry.serviceRadiusKm),
        }))
      : [];
    const availability: CleanAvailability[] = Array.isArray(body.availability)
      ? body.availability.map((entry: AvailabilityInput) => ({
          dayOfWeek: Number(entry.dayOfWeek),
          startTime: cleanText(entry.startTime, 5),
          endTime: cleanText(entry.endTime, 5),
          isAvailable: entry.isAvailable === true,
        }))
      : [];

    if (name.length < 2 || !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(mobile) || !address || !city || !state || !/^\d{6}$/.test(pincode)) {
      return addMobileCors(NextResponse.json({ message: "Enter a valid name, Indian mobile number, address, city, state, and 6-digit pincode." }, { status: 400 }));
    }
    if (!Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 80 || languages.length === 0 || services.length === 0) {
      return addMobileCors(NextResponse.json({ message: "Enter valid experience and select at least one language and service." }, { status: 400 }));
    }
    if (serviceAreas.length === 0 || serviceAreas.some((area) => !area.city || !area.area || (area.pincode && !/^\d{6}$/.test(area.pincode)) || (area.serviceRadiusKm !== null && (!Number.isFinite(area.serviceRadiusKm) || area.serviceRadiusKm <= 0)))) {
      return addMobileCors(NextResponse.json({ message: "Add at least one valid service area." }, { status: 400 }));
    }
    if (availability.some((slot) => !Number.isInteger(slot.dayOfWeek) || slot.dayOfWeek < 0 || slot.dayOfWeek > 6 || !timePattern.test(slot.startTime) || !timePattern.test(slot.endTime) || timeInMinutes(slot.startTime) >= timeInMinutes(slot.endTime)) || new Set(availability.map((slot) => slot.dayOfWeek)).size !== availability.length) {
      return addMobileCors(NextResponse.json({ message: "Availability must have one valid start and end time per day." }, { status: 400 }));
    }

    const currentPandit = await prisma.pandit.findUnique({
      where: { id: user.panditId },
      select: { isActive: true, verificationStatus: true, services: { select: { serviceName: true, basePrice: true, durationMinutes: true, isActive: true } } },
    });
    if (!currentPandit || !currentPandit.isActive || currentPandit.verificationStatus !== "VERIFIED") {
      return addMobileCors(NextResponse.json({ message: "Only verified active Pandits can update operational profile settings." }, { status: 403 }));
    }

    const serviceByName = new Map(currentPandit.services.map((service) => [service.serviceName.toLowerCase(), service]));
    await prisma.$transaction(async (transaction) => {
      await transaction.panditLanguage.deleteMany({ where: { panditId: user.panditId! } });
      await transaction.panditService.deleteMany({ where: { panditId: user.panditId! } });
      await transaction.panditServiceArea.deleteMany({ where: { panditId: user.panditId! } });
      await transaction.panditAvailability.deleteMany({ where: { panditId: user.panditId! } });
      await transaction.pandit.update({
        where: { id: user.panditId! },
        data: {
          name,
          mobile,
          address,
          city,
          state,
          pincode,
          bio: bio || null,
          experienceYears,
          languages: { create: languages.map((language) => ({ language })) },
          services: { create: services.map((serviceName) => {
            const existing = serviceByName.get(serviceName.toLowerCase());
            return { serviceName, basePrice: existing?.basePrice ?? null, durationMinutes: existing?.durationMinutes ?? null, isActive: existing?.isActive ?? true };
          }) },
          serviceAreas: { create: serviceAreas.map((area) => ({ ...area, pincode: area.pincode || null })) },
          availability: { create: availability.map((slot) => slot) },
        },
      });
    });

    return GET(request);
  } catch (error) {
    console.error("UPDATE PANDIT PROFILE ERROR:", error);
    return addMobileCors(NextResponse.json({ message: "Unable to update your profile." }, { status: 500 }));
  }
}