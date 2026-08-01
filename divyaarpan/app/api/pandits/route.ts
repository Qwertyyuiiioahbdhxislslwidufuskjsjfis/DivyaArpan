import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| GET - Fetch all Pandits
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const pandits = await prisma.pandit.findMany({
      include: {
        languages: true,
        services: true,
        serviceAreas: true,
        availability: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pandits);
  } catch (error) {
    console.error("Failed to fetch Pandits:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch Pandits.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Create New Pandit
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      mobile,
      email,
      profileImage,
      gender,
      dateOfBirth,
      experienceYears,
      bio,
      city,
      state,
      country,
      address,
      pincode,
      latitude,
      longitude,
      acceptsImmediate,
      acceptsScheduled,
      languages,
      services,
      serviceAreas,
      documents,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | Required Fields
    |--------------------------------------------------------------------------
    */

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message: "Pandit name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mobile?.trim()) {
      return NextResponse.json(
        {
          message: "Mobile number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!city?.trim()) {
      return NextResponse.json(
        {
          message: "City is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!state?.trim()) {
      return NextResponse.json(
        {
          message: "State is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Mobile Check
    |--------------------------------------------------------------------------
    */

    const existingMobile = await prisma.pandit.findUnique({
      where: {
        mobile: mobile.trim(),
      },
    });

    if (existingMobile) {
      return NextResponse.json(
        {
          message:
            "A Pandit with this mobile number is already registered.",
        },
        {
          status: 409,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Email Check
    |--------------------------------------------------------------------------
    */

    if (email?.trim()) {
      const existingEmail = await prisma.pandit.findUnique({
        where: {
          email: email.trim().toLowerCase(),
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            message:
              "A Pandit with this email address is already registered.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Pandit Code
    |--------------------------------------------------------------------------
    |
    | DA-PND-00001
    | DA-PND-00002
    |--------------------------------------------------------------------------
    */

    const latestPandit = await prisma.pandit.findFirst({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });

    const nextNumber = (latestPandit?.id ?? 0) + 1;

    const panditCode = `DA-PND-${String(
      nextNumber
    ).padStart(5, "0")}`;

    /*
    |--------------------------------------------------------------------------
    | Clean Languages
    |--------------------------------------------------------------------------
    */

    const cleanedLanguages: string[] = Array.isArray(languages)
      ? Array.from(
          new Set(
            languages
              .map((language: unknown) =>
                typeof language === "string"
                  ? language.trim()
                  : ""
              )
              .filter(Boolean)
          )
        )
      : [];

    /*
    |--------------------------------------------------------------------------
    | Clean Services
    |--------------------------------------------------------------------------
    */

    const cleanedServices = Array.isArray(services)
      ? services
          .filter(
            (service: {
              serviceName?: string;
            }) => service?.serviceName?.trim()
          )
          .map(
            (service: {
              serviceName: string;
              basePrice?: number | string | null;
              durationMinutes?: number | string | null;
            }) => ({
              serviceName: service.serviceName.trim(),

              /*
              Admin enters rupees.
              Database stores paise.

              ₹1,500 -> 150000
              */

              basePrice:
                service.basePrice !== undefined &&
                service.basePrice !== null &&
                service.basePrice !== ""
                  ? Math.round(
                      Number(service.basePrice) * 100
                    )
                  : null,

              durationMinutes:
                service.durationMinutes !== undefined &&
                service.durationMinutes !== null &&
                service.durationMinutes !== ""
                  ? Number(service.durationMinutes)
                  : null,
            })
          )
      : [];

    /*
    |--------------------------------------------------------------------------
    | Clean Service Areas
    |--------------------------------------------------------------------------
    */

    const cleanedServiceAreas = Array.isArray(serviceAreas)
      ? serviceAreas
          .filter(
            (area: {
              city?: string;
              area?: string;
            }) => area?.city?.trim() && area?.area?.trim()
          )
          .map(
            (area: {
              city: string;
              area: string;
              pincode?: string;
              latitude?: number | string | null;
              longitude?: number | string | null;
              serviceRadiusKm?: number | string | null;
            }) => ({
              city: area.city.trim(),
              area: area.area.trim(),

              pincode: area.pincode?.trim() || null,

              latitude:
                area.latitude !== undefined &&
                area.latitude !== null &&
                area.latitude !== ""
                  ? Number(area.latitude)
                  : null,

              longitude:
                area.longitude !== undefined &&
                area.longitude !== null &&
                area.longitude !== ""
                  ? Number(area.longitude)
                  : null,

              serviceRadiusKm:
                area.serviceRadiusKm !== undefined &&
                area.serviceRadiusKm !== null &&
                area.serviceRadiusKm !== ""
                  ? Number(area.serviceRadiusKm)
                  : null,
            })
          )
      : [];

    /*
    |--------------------------------------------------------------------------
    | Clean Documents
    |--------------------------------------------------------------------------
    |
    | Every uploaded document starts as NOT VERIFIED.
    | Admin verification will be built separately.
    |--------------------------------------------------------------------------
    */

    const cleanedDocuments = Array.isArray(documents)
      ? documents
          .filter(
            (document: {
              documentType?: string;
              documentUrl?: string;
            }) =>
              document?.documentType?.trim() &&
              document?.documentUrl?.trim()
          )
          .map(
            (document: {
              documentType: string;
              documentUrl: string;
              documentNumber?: string | null;
            }) => ({
              documentType:
                document.documentType.trim(),

              documentUrl:
                document.documentUrl.trim(),

              documentNumber:
                typeof document.documentNumber ===
                  "string" &&
                document.documentNumber.trim()
                  ? document.documentNumber.trim()
                  : null,

              isVerified: false,
            })
          )
      : [];

    /*
    |--------------------------------------------------------------------------
    | Create Pandit + Related Records
    |--------------------------------------------------------------------------
    */

    const pandit = await prisma.pandit.create({
      data: {
        panditCode,

        name: name.trim(),
        mobile: mobile.trim(),

        email: email?.trim()
          ? email.trim().toLowerCase()
          : null,

        profileImage: profileImage?.trim() || null,

        gender: gender?.trim() || null,

        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,

        experienceYears:
          experienceYears !== undefined &&
          experienceYears !== null &&
          experienceYears !== ""
            ? Number(experienceYears)
            : 0,

        bio: bio?.trim() || null,

        city: city.trim(),
        state: state.trim(),

        country: country?.trim() || "India",

        address: address?.trim() || null,
        pincode: pincode?.trim() || null,

        latitude:
          latitude !== undefined &&
          latitude !== null &&
          latitude !== ""
            ? Number(latitude)
            : null,

        longitude:
          longitude !== undefined &&
          longitude !== null &&
          longitude !== ""
            ? Number(longitude)
            : null,

        /*
        New Pandits are never automatically verified.
        */

        verificationStatus: "PENDING",

        isActive: true,
        isOnline: false,

        acceptsImmediate:
          acceptsImmediate === undefined
            ? true
            : Boolean(acceptsImmediate),

        acceptsScheduled:
          acceptsScheduled === undefined
            ? true
            : Boolean(acceptsScheduled),

        /*
        Languages
        */

        languages:
          cleanedLanguages.length > 0
            ? {
                create: cleanedLanguages.map(
                  (language) => ({
                    language,
                  })
                ),
              }
            : undefined,

        /*
        Pooja Services
        */

        services:
          cleanedServices.length > 0
            ? {
                create: cleanedServices,
              }
            : undefined,

        /*
        Service Areas
        */

        serviceAreas:
          cleanedServiceAreas.length > 0
            ? {
                create: cleanedServiceAreas,
              }
            : undefined,

        /*
        Verification Documents
        */

        documents:
          cleanedDocuments.length > 0
            ? {
                create: cleanedDocuments,
              }
            : undefined,
      },

      include: {
        languages: true,
        services: true,
        serviceAreas: true,
        availability: true,
        documents: true,
      },
    });

    return NextResponse.json(
      {
        message: "Pandit registered successfully.",
        pandit,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to create Pandit:", error);

    return NextResponse.json(
      {
        message: "Failed to register Pandit.",
      },
      {
        status: 500,
      }
    );
  }
}