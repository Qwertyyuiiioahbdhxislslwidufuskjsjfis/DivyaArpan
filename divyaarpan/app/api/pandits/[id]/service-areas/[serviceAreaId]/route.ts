import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| DELETE - Remove Pandit Service Area
|--------------------------------------------------------------------------
|
| DELETE /api/pandits/:id/service-areas/:serviceAreaId
|
*/

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
      serviceAreaId: string;
    }>;
  }
) {
  try {
    const { id, serviceAreaId } = await context.params;

    const panditId = Number(id);
    const areaId = Number(serviceAreaId);

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
    | Validate Service Area ID
    |--------------------------------------------------------------------------
    */

    if (!Number.isInteger(areaId) || areaId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid Service Area ID.",
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
    | Find Service Area
    |--------------------------------------------------------------------------
    |
    | We check both the service area ID and Pandit ID.
    | This prevents an area belonging to another Pandit
    | from being removed accidentally.
    |
    */

    const serviceArea =
      await prisma.panditServiceArea.findFirst({
        where: {
          id: areaId,
          panditId,
        },
      });

    if (!serviceArea) {
      return NextResponse.json(
        {
          message:
            "Service area not found for this Pandit.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Service Area
    |--------------------------------------------------------------------------
    */

    await prisma.panditServiceArea.delete({
      where: {
        id: areaId,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message: "Service area removed successfully.",

      removedServiceArea: {
        id: serviceArea.id,
        city: serviceArea.city,
        area: serviceArea.area,
        pincode: serviceArea.pincode,
      },
    });
  } catch (error) {
    console.error(
      "Failed to remove Pandit service area:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to remove service area.",
      },
      {
        status: 500,
      }
    );
  }
}