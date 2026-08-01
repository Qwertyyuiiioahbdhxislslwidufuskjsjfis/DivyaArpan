import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateBookingId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `DA-PB-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /*
    |--------------------------------------------------------------------------
    | Read + Normalize Request
    |--------------------------------------------------------------------------
    */

    const service =
      typeof body.service === "string"
        ? body.service.trim()
        : "";

    const bookingType =
      typeof body.bookingType === "string"
        ? body.bookingType.trim().toUpperCase()
        : "";

    const urgency =
      typeof body.urgency === "string"
        ? body.urgency.trim().toUpperCase()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";

    const pincode =
      typeof body.pincode === "string"
        ? body.pincode.trim()
        : "";

    const language =
      typeof body.language === "string"
        ? body.language.trim()
        : "";

    const date =
      typeof body.date === "string"
        ? body.date.trim()
        : "";

    const time =
      typeof body.time === "string"
        ? body.time.trim()
        : "";

    const sankalp =
      typeof body.sankalp === "string"
        ? body.sankalp.trim()
        : "";

    const devoteeName =
      typeof body.devoteeName === "string"
        ? body.devoteeName.trim()
        : "";

    const mobile =
      typeof body.mobile === "string"
        ? body.mobile.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    /*
    |--------------------------------------------------------------------------
    | Required Fields
    |--------------------------------------------------------------------------
    */

    if (!service) {
      return NextResponse.json(
        {
          message: "Pooja / service is required.",
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

    const allowedUrgencies = [
      "ASAP",
      "WITHIN_1_HOUR",
      "WITHIN_2_HOURS",
      "WITHIN_4_HOURS",
      "SCHEDULED",
    ];

    if (!allowedUrgencies.includes(urgency)) {
      return NextResponse.json(
        {
          message: "Invalid booking urgency.",
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

    if (!address) {
      return NextResponse.json(
        {
          message: "Pooja address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!language) {
      return NextResponse.json(
        {
          message: "Pandit language is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!devoteeName) {
      return NextResponse.json(
        {
          message: "Devotee name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mobile) {
      return NextResponse.json(
        {
          message: "Mobile number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
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
    | Scheduled Booking Validation
    |--------------------------------------------------------------------------
    */

    if (bookingType === "SCHEDULED") {
      if (!date) {
        return NextResponse.json(
          {
            message:
              "Date is required for a scheduled booking.",
          },
          {
            status: 400,
          }
        );
      }

      if (!time) {
        return NextResponse.json(
          {
            message:
              "Time is required for a scheduled booking.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Immediate Booking
    |--------------------------------------------------------------------------
    */

    const bookingDate =
      bookingType === "IMMEDIATE"
        ? date || new Date().toISOString().slice(0, 10)
        : date;

    const bookingTime =
      bookingType === "IMMEDIATE"
        ? time || "ASAP"
        : time;

    const normalizedUrgency =
      bookingType === "SCHEDULED"
        ? "SCHEDULED"
        : urgency === "SCHEDULED"
        ? "ASAP"
        : urgency;

    /*
    |--------------------------------------------------------------------------
    | Find Eligible Pandits
    |--------------------------------------------------------------------------
    |
    | Immediate:
    | VERIFIED + Active + Online + acceptsImmediate
    |
    | Scheduled:
    | VERIFIED + Active + acceptsScheduled
    |
    | Both:
    | Service + City + Language
    |
    */

    const matchingPandits = await prisma.pandit.findMany({
      where: {
        verificationStatus: "VERIFIED",

        isActive: true,

        ...(bookingType === "IMMEDIATE"
          ? {
              isOnline: true,
              acceptsImmediate: true,
            }
          : {
              acceptsScheduled: true,
            }),

        services: {
          some: {
            isActive: true,

            serviceName: {
              equals: service,
              mode: "insensitive",
            },
          },
        },

        serviceAreas: {
          some: {
            city: {
              equals: city,
              mode: "insensitive",
            },
          },
        },

        languages: {
          some: {
            language: {
              equals: language,
              mode: "insensitive",
            },
          },
        },
      },

      select: {
        id: true,
        panditCode: true,
        name: true,
        rating: true,
        totalBookings: true,
        experienceYears: true,

        services: {
          where: {
            isActive: true,

            serviceName: {
              equals: service,
              mode: "insensitive",
            },
          },

          select: {
            basePrice: true,
          },

          take: 1,
        },
      },

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

      /*
      | Dispatch Round 1:
      | Send the request to the best 5 Pandits.
      */
      take: 5,
    });

    /*
    |--------------------------------------------------------------------------
    | Create Booking
    |--------------------------------------------------------------------------
    */

    const bookingId = generateBookingId();

    const booking = await prisma.panditBooking.create({
      data: {
        bookingId,

        service,

        bookingType:
          bookingType === "IMMEDIATE"
            ? "IMMEDIATE"
            : "SCHEDULED",

        urgency:
          normalizedUrgency as
            | "ASAP"
            | "WITHIN_1_HOUR"
            | "WITHIN_2_HOURS"
            | "WITHIN_4_HOURS"
            | "SCHEDULED",

        city,

        address,

        state: state || null,

        pincode: pincode || null,

        language,

        date: bookingDate,

        time: bookingTime,

        sankalp: sankalp || null,

        devoteeName,

        mobile,

        email: email || null,

        status:
          matchingPandits.length > 0
            ? "SEARCHING"
            : "NO_PANDIT_AVAILABLE",

        paymentStatus: "PENDING",

        searchStartedAt: new Date(),
      },
    });

    /*
    |--------------------------------------------------------------------------
    | No Pandit Available
    |--------------------------------------------------------------------------
    */

    if (matchingPandits.length === 0) {
      return NextResponse.json(
        {
          message:
            "Booking created, but no matching Pandit is currently available.",

          booking,

          totalOffers: 0,

          offers: [],
        },
        {
          status: 201,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Pandit Offers
    |--------------------------------------------------------------------------
    */

    const offerExpiryMinutes =
      bookingType === "IMMEDIATE" ? 5 : 60;

    const expiresAt = new Date(
      Date.now() +
        offerExpiryMinutes * 60 * 1000
    );

    await prisma.panditBookingOffer.createMany({
      data: matchingPandits.map((pandit) => ({
        bookingId: booking.id,

        panditId: pandit.id,

        status: "PENDING",

        dispatchRound: 1,

        expiresAt,
      })),
    });

    /*
    |--------------------------------------------------------------------------
    | Fetch Created Offers
    |--------------------------------------------------------------------------
    */

    const offers = await prisma.panditBookingOffer.findMany({
      where: {
        bookingId: booking.id,
      },

      include: {
        pandit: {
          select: {
            id: true,
            panditCode: true,
            name: true,
            rating: true,
            experienceYears: true,
            isOnline: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        message:
          "Booking request created and sent to matching Pandits.",

        booking,

        totalOffers: offers.length,

        offers,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to create Pandit booking request:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create Pandit booking request.",
      },
      {
        status: 500,
      }
    );
  }
}