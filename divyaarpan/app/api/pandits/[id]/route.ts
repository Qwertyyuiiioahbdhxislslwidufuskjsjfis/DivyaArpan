import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| GET - Fetch Single Pandit
|--------------------------------------------------------------------------
*/

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const panditId = Number(id);

    if (!Number.isInteger(panditId) || panditId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid Pandit ID.",
        },
        {
          status: 400,
        }
      );
    }

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },

      include: {
        languages: {
          orderBy: {
            id: "asc",
          },
        },

        services: {
          orderBy: {
            id: "asc",
          },
        },

        serviceAreas: {
          orderBy: {
            id: "asc",
          },
        },

        availability: {
          orderBy: {
            id: "asc",
          },
        },

        documents: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!pandit) {
      return NextResponse.json(
        {
          message: "Pandit not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      pandit,
    });
  } catch (error) {
    console.error("Failed to fetch Pandit:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch Pandit details.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PUT - Update Pandit
|--------------------------------------------------------------------------
|
| Updates:
| - Personal information
| - Location
| - Languages
| - Services
| - Service areas
| - Booking preferences
| - Active / online status
|
| Existing verification documents are NOT deleted here.
|--------------------------------------------------------------------------
*/

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const panditId = Number(id);

    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (!Number.isInteger(panditId) || panditId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid Pandit ID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Pandit Exists
    |--------------------------------------------------------------------------
    */

    const existingPandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },
      select: {
        id: true,
      },
    });

    if (!existingPandit) {
      return NextResponse.json(
        {
          message: "Pandit not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Read Request Body
    |--------------------------------------------------------------------------
    */

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

      isActive,
      isOnline,
      acceptsImmediate,
      acceptsScheduled,

      languages,
      services,
      serviceAreas,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          message: "Pandit name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mobile || !String(mobile).trim()) {
      return NextResponse.json(
        {
          message: "Mobile number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!city || !String(city).trim()) {
      return NextResponse.json(
        {
          message: "City is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!state || !String(state).trim()) {
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
    | Validate Languages
    |--------------------------------------------------------------------------
    */

    const cleanLanguages = Array.isArray(languages)
      ? languages
          .map((language: unknown) =>
            String(language).trim()
          )
          .filter(Boolean)
      : [];

    if (cleanLanguages.length === 0) {
      return NextResponse.json(
        {
          message: "At least one language is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Services
    |--------------------------------------------------------------------------
    */

    const cleanServices = Array.isArray(services)
      ? services
          .filter(
            (service: {
              serviceName?: string;
            }) =>
              service?.serviceName &&
              String(service.serviceName).trim()
          )
          .map(
            (service: {
              serviceName: string;
              basePrice?: number | null;
              durationMinutes?: number | null;
              isActive?: boolean;
            }) => ({
              serviceName: String(
                service.serviceName
              ).trim(),

              basePrice:
                service.basePrice === null ||
                service.basePrice === undefined ||
                service.basePrice === ("" as unknown)
                  ? null
                  : Number(service.basePrice),

              durationMinutes:
                service.durationMinutes === null ||
                service.durationMinutes === undefined ||
                service.durationMinutes === ("" as unknown)
                  ? null
                  : Number(service.durationMinutes),

              isActive:
                service.isActive !== false,
            })
          )
      : [];

    if (cleanServices.length === 0) {
      return NextResponse.json(
        {
          message: "At least one Pooja service is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Service Areas
    |--------------------------------------------------------------------------
    */

    const cleanServiceAreas = Array.isArray(serviceAreas)
      ? serviceAreas
          .filter(
            (area: {
              city?: string;
              area?: string;
            }) =>
              area?.city &&
              String(area.city).trim() &&
              area?.area &&
              String(area.area).trim()
          )
          .map(
            (area: {
              city: string;
              area: string;
              pincode?: string | null;
              latitude?: number | null;
              longitude?: number | null;
              serviceRadiusKm?: number | null;
            }) => ({
              city: String(area.city).trim(),

              area: String(area.area).trim(),

              pincode: area.pincode
                ? String(area.pincode).trim()
                : null,

              latitude:
                area.latitude === null ||
                area.latitude === undefined ||
                area.latitude === ("" as unknown)
                  ? null
                  : Number(area.latitude),

              longitude:
                area.longitude === null ||
                area.longitude === undefined ||
                area.longitude === ("" as unknown)
                  ? null
                  : Number(area.longitude),

              serviceRadiusKm:
                area.serviceRadiusKm === null ||
                area.serviceRadiusKm === undefined ||
                area.serviceRadiusKm === ("" as unknown)
                  ? null
                  : Number(area.serviceRadiusKm),
            })
          )
      : [];

    /*
    |--------------------------------------------------------------------------
    | Update Using Transaction
    |--------------------------------------------------------------------------
    |
    | Languages, services and service areas are replaced with the values
    | submitted by the Edit Pandit form.
    |
    | Documents are deliberately untouched.
    |--------------------------------------------------------------------------
    */

    const updatedPandit = await prisma.$transaction(
      async (tx) => {
        /*
        |--------------------------------------------------------------------------
        | Remove Existing Related Editable Data
        |--------------------------------------------------------------------------
        */

        await tx.panditLanguage.deleteMany({
          where: {
            panditId,
          },
        });

        await tx.panditService.deleteMany({
          where: {
            panditId,
          },
        });

        await tx.panditServiceArea.deleteMany({
          where: {
            panditId,
          },
        });

        /*
        |--------------------------------------------------------------------------
        | Update Pandit + Recreate Relations
        |--------------------------------------------------------------------------
        */

        return tx.pandit.update({
          where: {
            id: panditId,
          },

          data: {
            name: String(name).trim(),

            mobile: String(mobile).trim(),

            email:
              email && String(email).trim()
                ? String(email).trim()
                : null,

            profileImage:
              profileImage &&
              String(profileImage).trim()
                ? String(profileImage).trim()
                : null,

            gender:
              gender && String(gender).trim()
                ? String(gender).trim()
                : null,

            dateOfBirth: dateOfBirth
              ? new Date(dateOfBirth)
              : null,

            experienceYears:
              experienceYears === null ||
              experienceYears === undefined ||
              experienceYears === ""
                ? 0
                : Number(experienceYears),

            bio:
              bio && String(bio).trim()
                ? String(bio).trim()
                : null,

            city: String(city).trim(),

            state: String(state).trim(),

            country:
              country && String(country).trim()
                ? String(country).trim()
                : "India",

            address:
              address && String(address).trim()
                ? String(address).trim()
                : null,

            pincode:
              pincode && String(pincode).trim()
                ? String(pincode).trim()
                : null,

            latitude:
              latitude === null ||
              latitude === undefined ||
              latitude === ""
                ? null
                : Number(latitude),

            longitude:
              longitude === null ||
              longitude === undefined ||
              longitude === ""
                ? null
                : Number(longitude),

            isActive:
              typeof isActive === "boolean"
                ? isActive
                : true,

            isOnline:
              typeof isOnline === "boolean"
                ? isOnline
                : false,

            acceptsImmediate:
              typeof acceptsImmediate === "boolean"
                ? acceptsImmediate
                : true,

            acceptsScheduled:
              typeof acceptsScheduled === "boolean"
                ? acceptsScheduled
                : true,

            /*
            |--------------------------------------------------------------------------
            | Recreate Languages
            |--------------------------------------------------------------------------
            */

            languages: {
              create: cleanLanguages.map(
                (language: string) => ({
                  language,
                })
              ),
            },

            /*
            |--------------------------------------------------------------------------
            | Recreate Services
            |--------------------------------------------------------------------------
            */

            services: {
              create: cleanServices,
            },

            /*
            |--------------------------------------------------------------------------
            | Recreate Service Areas
            |--------------------------------------------------------------------------
            */

            serviceAreas: {
              create: cleanServiceAreas,
            },
          },

          include: {
            languages: {
              orderBy: {
                id: "asc",
              },
            },

            services: {
              orderBy: {
                id: "asc",
              },
            },

            serviceAreas: {
              orderBy: {
                id: "asc",
              },
            },

            availability: {
              orderBy: {
                id: "asc",
              },
            },

            documents: {
              orderBy: {
                id: "asc",
              },
            },
          },
        });
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message: "Pandit updated successfully.",
      pandit: updatedPandit,
    });
  } catch (error) {
    console.error("Failed to update Pandit:", error);

    /*
    |--------------------------------------------------------------------------
    | Prisma Unique Constraint
    |--------------------------------------------------------------------------
    |
    | Usually duplicate mobile or email.
    |--------------------------------------------------------------------------
    */

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "Another Pandit is already registered with this mobile number or email address.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update Pandit.",
      },
      {
        status: 500,
      }
    );
  }
}