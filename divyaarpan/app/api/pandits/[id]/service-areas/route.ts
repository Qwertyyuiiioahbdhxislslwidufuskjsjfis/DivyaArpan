import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| GET - Fetch Pandit's Service Areas
|--------------------------------------------------------------------------
|
| GET /api/pandits/:id/service-areas
|
*/

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const panditId = Number(id);

    /*
    |--------------------------------------------------------------------------
    | Validate Pandit ID
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

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },

      select: {
        id: true,
        name: true,
        panditCode: true,
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

    /*
    |--------------------------------------------------------------------------
    | Fetch Service Areas
    |--------------------------------------------------------------------------
    */

    const serviceAreas = await prisma.panditServiceArea.findMany({
      where: {
        panditId,
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

    return NextResponse.json({
      pandit,
      serviceAreas,
    });
  } catch (error) {
    console.error(
      "Failed to fetch Pandit service areas:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch Pandit service areas.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Add Service Area
|--------------------------------------------------------------------------
|
| POST /api/pandits/:id/service-areas
|
*/

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const panditId = Number(id);

    /*
    |--------------------------------------------------------------------------
    | Validate Pandit ID
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
    | Read Request Body
    |--------------------------------------------------------------------------
    */

    const body = await request.json();

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

    const serviceRadiusKm =
      body.serviceRadiusKm === null ||
      body.serviceRadiusKm === undefined ||
      body.serviceRadiusKm === ""
        ? null
        : Number(body.serviceRadiusKm);

    /*
    |--------------------------------------------------------------------------
    | Validate Required Fields
    |--------------------------------------------------------------------------
    */

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

    if (!area) {
      return NextResponse.json(
        {
          message: "Area / locality is required.",
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

    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          message: "Please enter a valid 6-digit pincode.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Service Radius
    |--------------------------------------------------------------------------
    */

    if (
      serviceRadiusKm !== null &&
      (!Number.isFinite(serviceRadiusKm) ||
        serviceRadiusKm <= 0)
    ) {
      return NextResponse.json(
        {
          message:
            "Service radius must be greater than 0 km.",
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

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },

      select: {
        id: true,
        name: true,
        panditCode: true,
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

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Service Area
    |--------------------------------------------------------------------------
    */

    const existingServiceAreas =
      await prisma.panditServiceArea.findMany({
        where: {
          panditId,
        },

        select: {
          id: true,
          city: true,
          area: true,
          pincode: true,
        },
      });

    const duplicate = existingServiceAreas.find(
      (existing) =>
        existing.city.trim().toLowerCase() ===
          city.toLowerCase() &&
        existing.area.trim().toLowerCase() ===
          area.toLowerCase() &&
        (existing.pincode || "") === pincode
    );

    if (duplicate) {
      return NextResponse.json(
        {
          message:
            "This service area has already been added for this Pandit.",
        },
        {
          status: 409,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Service Area
    |--------------------------------------------------------------------------
    */

    const serviceArea =
      await prisma.panditServiceArea.create({
        data: {
          panditId,

          city,

          area,

          pincode: pincode || null,

          serviceRadiusKm,

          latitude: null,

          longitude: null,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        message: "Service area added successfully.",

        serviceArea,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to add Pandit service area:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to add service area.",
      },
      {
        status: 500,
      }
    );
  }
}