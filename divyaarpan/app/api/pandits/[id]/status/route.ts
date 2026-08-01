import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type StatusRequestBody = {
  action?: string;
  reason?: string;
  remarks?: string;
};

/*
|--------------------------------------------------------------------------
| PATCH - Activate / Deactivate Pandit
|--------------------------------------------------------------------------
|
| Route:
| PATCH /api/pandits/:id/status
|
| DEACTIVATE:
|
| {
|   "action": "DEACTIVATE",
|   "reason": "Devotee complaint",
|   "remarks": "Additional Admin remarks"
| }
|
| REACTIVATE:
|
| {
|   "action": "REACTIVATE"
| }
|
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: NextRequest,
  context: RouteContext
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
    | Read Request Body
    |--------------------------------------------------------------------------
    */

    const body =
      (await request.json()) as StatusRequestBody;

    const action =
      body.action?.trim().toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | Validate Action
    |--------------------------------------------------------------------------
    */

    if (
      action !== "DEACTIVATE" &&
      action !== "REACTIVATE"
    ) {
      return NextResponse.json(
        {
          message:
            "Action must be DEACTIVATE or REACTIVATE.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Pandit
    |--------------------------------------------------------------------------
    */

    const pandit =
      await prisma.pandit.findUnique({
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
          deactivationReason: true,
          deactivationRemarks: true,
          deactivatedAt: true,
          reactivatedAt: true,
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
    | DEACTIVATE
    |--------------------------------------------------------------------------
    */

    if (action === "DEACTIVATE") {
      /*
      |--------------------------------------------------------------------------
      | Already Inactive
      |--------------------------------------------------------------------------
      */

      if (!pandit.isActive) {
        return NextResponse.json(
          {
            message:
              "Pandit is already inactive.",
            pandit,
          },
          {
            status: 200,
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Validate Reason
      |--------------------------------------------------------------------------
      */

      const reason =
        body.reason?.trim() || "";

      const remarks =
        body.remarks?.trim() || null;

      if (!reason) {
        return NextResponse.json(
          {
            message:
              "A deactivation reason is required.",
          },
          {
            status: 400,
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Protect Against Extremely Large Input
      |--------------------------------------------------------------------------
      */

      if (reason.length > 150) {
        return NextResponse.json(
          {
            message:
              "Deactivation reason must not exceed 150 characters.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        remarks &&
        remarks.length > 1000
      ) {
        return NextResponse.json(
          {
            message:
              "Deactivation remarks must not exceed 1000 characters.",
          },
          {
            status: 400,
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Deactivate Pandit
      |--------------------------------------------------------------------------
      |
      | Important:
      |
      | isActive = false
      | isOnline = false
      |
      | We intentionally DO NOT change verificationStatus.
      |
      |--------------------------------------------------------------------------
      */

      const updatedPandit =
        await prisma.pandit.update({
          where: {
            id: panditId,
          },

          data: {
            isActive: false,

            /*
            | An inactive Pandit must never
            | remain online in marketplace.
            */
            isOnline: false,

            deactivationReason:
              reason,

            deactivationRemarks:
              remarks,

            deactivatedAt:
              new Date(),
          },

          select: {
            id: true,
            panditCode: true,
            name: true,

            verificationStatus: true,

            isActive: true,
            isOnline: true,

            deactivationReason: true,
            deactivationRemarks: true,
            deactivatedAt: true,
            reactivatedAt: true,
          },
        });

      return NextResponse.json({
        message:
          "Pandit deactivated successfully.",

        pandit: updatedPandit,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | REACTIVATE
    |--------------------------------------------------------------------------
    */

    if (pandit.isActive) {
      return NextResponse.json(
        {
          message:
            "Pandit is already active.",
          pandit,
        },
        {
          status: 200,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Reactivate Pandit
    |--------------------------------------------------------------------------
    |
    | Reactivation does NOT automatically make the Pandit online.
    |
    | isActive = true
    | isOnline remains false
    |
    |--------------------------------------------------------------------------
    */

    const updatedPandit =
      await prisma.pandit.update({
        where: {
          id: panditId,
        },

        data: {
          isActive: true,

          /*
          | Keep Pandit offline after
          | reactivation until they choose
          | to go online.
          */
          isOnline: false,

          /*
          | Clear the current inactive reason.
          */
          deactivationReason:
            null,

          deactivationRemarks:
            null,

          /*
          | Keep deactivatedAt as historical
          | information for now.
          */
          reactivatedAt:
            new Date(),
        },

        select: {
          id: true,
          panditCode: true,
          name: true,

          verificationStatus: true,

          isActive: true,
          isOnline: true,

          deactivationReason: true,
          deactivationRemarks: true,
          deactivatedAt: true,
          reactivatedAt: true,
        },
      });

    return NextResponse.json({
      message:
        "Pandit reactivated successfully.",

      pandit: updatedPandit,
    });
  } catch (error) {
    console.error(
      "Failed to update Pandit status:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update Pandit status.",
      },
      {
        status: 500,
      }
    );
  }
}