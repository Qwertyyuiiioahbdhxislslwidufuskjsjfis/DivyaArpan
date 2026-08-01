import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type BookingType = "IMMEDIATE" | "SCHEDULED";

/*
|--------------------------------------------------------------------------
| POST - Match Eligible Pandits
|--------------------------------------------------------------------------
|
| POST /api/pandits/match
|
| Example:
|
| {
|   "serviceName": "Ganesh Pooja",
|   "city": "Mumbai",
|   "area": "Ghatkopar",
|   "pincode": "400075",
|   "language": "Hindi",
|   "bookingType": "IMMEDIATE"
| }
|
*/

export async function POST(request: NextRequest) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Read Request Body
    |--------------------------------------------------------------------------
    */

    const body = await request.json();

    const serviceName =
      typeof body.serviceName === "string"
        ? body.serviceName.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const area =
      typeof body.area === "string"
        ? body.area.trim()
        : "";

    const pincode =
      typeof body.pincode === "string"
        ? body.pincode.trim()
        : "";

    const language =
      typeof body.language === "string"
        ? body.language.trim()
        : "";

    const bookingType =
      typeof body.bookingType === "string"
        ? body.bookingType.trim().toUpperCase()
        : "";

    /*
    |--------------------------------------------------------------------------
    | Validate Required Fields
    |--------------------------------------------------------------------------
    */

    if (!serviceName) {
      return NextResponse.json(
        {
          message: "Service name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!city) {
      return NextResponse.json(
        {
          message: "City is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      bookingType !== "IMMEDIATE" &&
      bookingType !== "SCHEDULED"
    ) {
      return NextResponse.json(
        {
          message:
            "Booking type must be IMMEDIATE or SCHEDULED.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Pincode
    |--------------------------------------------------------------------------
    */

    if (
      pincode &&
      !/^[0-9]{6}$/.test(pincode)
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter a valid 6-digit pincode.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Booking Type
    |--------------------------------------------------------------------------
    */

    const normalizedBookingType =
      bookingType as BookingType;

    /*
    |--------------------------------------------------------------------------
    | Build Pandit Eligibility Query
    |--------------------------------------------------------------------------
    |
    | Base eligibility:
    |
    | 1. VERIFIED
    | 2. Active
    | 3. Offers requested service
    | 4. Covers requested city
    | 5. Language match when supplied
    |
    | Immediate:
    | - Online
    | - acceptsImmediate
    |
    | Scheduled:
    | - acceptsScheduled
    |
    */

    const pandits =
      await prisma.pandit.findMany({
        where: {
          verificationStatus: "VERIFIED",

          isActive: true,

          ...(normalizedBookingType ===
          "IMMEDIATE"
            ? {
                isOnline: true,
                acceptsImmediate: true,
              }
            : {
                acceptsScheduled: true,
              }),

          /*
          |--------------------------------------------------------------------------
          | Service Match
          |--------------------------------------------------------------------------
          */

          services: {
            some: {
              isActive: true,

              serviceName: {
                equals: serviceName,
                mode: "insensitive",
              },
            },
          },

          /*
          |--------------------------------------------------------------------------
          | Service City Match
          |--------------------------------------------------------------------------
          */

          serviceAreas: {
            some: {
              city: {
                equals: city,
                mode: "insensitive",
              },
            },
          },

          /*
          |--------------------------------------------------------------------------
          | Language Match
          |--------------------------------------------------------------------------
          */

          ...(language
            ? {
                languages: {
                  some: {
                    language: {
                      equals: language,
                      mode: "insensitive",
                    },
                  },
                },
              }
            : {}),
        },

        /*
        |--------------------------------------------------------------------------
        | Return Marketplace Information
        |--------------------------------------------------------------------------
        */

        select: {
          id: true,

          panditCode: true,

          name: true,

          profileImage: true,

          experienceYears: true,

          city: true,

          state: true,

          country: true,

          verificationStatus: true,

          isActive: true,

          isOnline: true,

          acceptsImmediate: true,

          acceptsScheduled: true,

          rating: true,

          totalRatings: true,

          totalBookings: true,

          languages: {
            select: {
              language: true,
            },

            orderBy: {
              id: "asc",
            },
          },

          services: {
            where: {
              isActive: true,

              serviceName: {
                equals: serviceName,
                mode: "insensitive",
              },
            },

            select: {
              id: true,
              serviceName: true,
              basePrice: true,
              durationMinutes: true,
            },
          },

          serviceAreas: {
            where: {
              city: {
                equals: city,
                mode: "insensitive",
              },
            },

            select: {
              id: true,
              city: true,
              area: true,
              pincode: true,
              latitude: true,
              longitude: true,
              serviceRadiusKm: true,
            },
          },
        },

        /*
        |--------------------------------------------------------------------------
        | Marketplace Ranking
        |--------------------------------------------------------------------------
        |
        | For now:
        | 1. Higher rating
        | 2. More completed/total bookings
        | 3. More experienced
        |
        */

        orderBy: [
          {
            rating: "desc",
          },

          {
            totalBookings: "desc",
          },

          {
            experienceYears: "desc",
          },
        ],
      });

    /*
    |--------------------------------------------------------------------------
    | Optional Area / Pincode Relevance
    |--------------------------------------------------------------------------
    |
    | City is the hard eligibility condition.
    |
    | Area and pincode are used here to rank the result rather than
    | rejecting Pandits immediately.
    |
    | Later, when latitude/longitude are available, we'll replace this
    | with real distance/radius matching.
    |
    */

    const rankedPandits = pandits
      .map((pandit) => {
        let locationScore = 0;

        const matchingAreas =
          pandit.serviceAreas.map(
            (serviceArea) => {
              const areaMatches =
                area &&
                serviceArea.area
                  .trim()
                  .toLowerCase() ===
                  area.toLowerCase();

              const pincodeMatches =
                pincode &&
                serviceArea.pincode ===
                  pincode;

              if (pincodeMatches) {
                locationScore += 20;
              }

              if (areaMatches) {
                locationScore += 10;
              }

              return {
                ...serviceArea,

                areaMatches:
                  Boolean(areaMatches),

                pincodeMatches:
                  Boolean(
                    pincodeMatches
                  ),
              };
            }
          );

        return {
          ...pandit,

          serviceAreas:
            matchingAreas,

          locationScore,
        };
      })
      .sort((a, b) => {
        /*
        | Location relevance first.
        */

        if (
          b.locationScore !==
          a.locationScore
        ) {
          return (
            b.locationScore -
            a.locationScore
          );
        }

        /*
        | Then rating.
        */

        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        /*
        | Then booking history.
        */

        if (
          b.totalBookings !==
          a.totalBookings
        ) {
          return (
            b.totalBookings -
            a.totalBookings
          );
        }

        /*
        | Then experience.
        */

        return (
          b.experienceYears -
          a.experienceYears
        );
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message:
        rankedPandits.length > 0
          ? "Matching Pandits found."
          : "No matching Pandits found.",

      search: {
        serviceName,
        city,

        area: area || null,

        pincode:
          pincode || null,

        language:
          language || null,

        bookingType:
          normalizedBookingType,
      },

      totalMatches:
        rankedPandits.length,

      pandits:
        rankedPandits,
    });
  } catch (error) {
    console.error(
      "Failed to match Pandits:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to find matching Pandits.",
      },
      {
        status: 500,
      }
    );
  }
}