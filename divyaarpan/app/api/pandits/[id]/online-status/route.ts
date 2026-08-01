import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| PATCH - Change Pandit Online / Offline Status
|--------------------------------------------------------------------------
|
| PATCH /api/pandits/:id/online-status
|
| Body:
|
| {
|   "isOnline": true
| }
|
*/

export async function PATCH(
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

    if (
      !Number.isInteger(panditId) ||
      panditId <= 0
    ) {
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
    | Read Request
    |--------------------------------------------------------------------------
    */

    const body = await request.json();

    if (typeof body.isOnline !== "boolean") {
      return NextResponse.json(
        {
          message:
            "isOnline must be true or false.",
        },
        {
          status: 400,
        }
      );
    }

    const requestedOnlineStatus =
      body.isOnline;

    /*
    |--------------------------------------------------------------------------
    | Fetch Pandit
    |--------------------------------------------------------------------------
    */

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },

      select: {
        id: true,
        panditCode: true,
        name: true,
        isActive: true,
        isOnline: true,
        verificationStatus: true,
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
    | Going Online - Eligibility Checks
    |--------------------------------------------------------------------------
    |
    | Going Offline is always allowed.
    |
    */

    if (requestedOnlineStatus) {
      /*
      |--------------------------------------------------------------------------
      | Pandit Must Be Active
      |--------------------------------------------------------------------------
      */

      if (!pandit.isActive) {
        return NextResponse.json(
          {
            message:
              "Inactive Pandit cannot go online. Reactivate the Pandit first.",
          },
          {
            status: 403,
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Pandit Must Be Verified
      |--------------------------------------------------------------------------
      */

      if (
        pandit.verificationStatus !==
        "VERIFIED"
      ) {
        return NextResponse.json(
          {
            message:
              "Pandit must be verified before going online.",
          },
          {
            status: 403,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Update Online Status
    |--------------------------------------------------------------------------
    */

    const updatedPandit =
      await prisma.pandit.update({
        where: {
          id: panditId,
        },

        data: {
          isOnline:
            requestedOnlineStatus,
        },

        select: {
          id: true,
          panditCode: true,
          name: true,
          verificationStatus: true,
          isActive: true,
          isOnline: true,
          acceptsImmediate: true,
          acceptsScheduled: true,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message: updatedPandit.isOnline
        ? "Pandit is now online."
        : "Pandit is now offline.",

      pandit: updatedPandit,
    });
  } catch (error) {
    console.error(
      "Failed to update Pandit online status:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update Pandit online status.",
      },
      {
        status: 500,
      }
    );
  }
}