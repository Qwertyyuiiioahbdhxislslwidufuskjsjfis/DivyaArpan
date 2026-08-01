import { NextRequest, NextResponse } from "next/server";
import {
  PanditVerificationStatus,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| PATCH - Final Admin Approval
|--------------------------------------------------------------------------
|
| Route:
| PATCH /api/pandits/:id/approve
|
| This endpoint performs the final Admin approval after document
| verification has been completed.
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
    | Fetch Pandit With Documents
    |--------------------------------------------------------------------------
    */

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: panditId,
      },

      include: {
        documents: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Pandit Not Found
    |--------------------------------------------------------------------------
    */

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
    | Already Verified
    |--------------------------------------------------------------------------
    */

    if (
      pandit.verificationStatus ===
      PanditVerificationStatus.VERIFIED
    ) {
      return NextResponse.json(
        {
          message: "Pandit is already verified.",
          pandit,
        },
        {
          status: 200,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Required Documents
    |--------------------------------------------------------------------------
    |
    | For the current DivyaArpan onboarding flow we require:
    |
    | 1. Government Photo ID
    | 2. PAN Card
    | 3. Address Proof
    |
    |--------------------------------------------------------------------------
    */

    const requiredDocumentTypes = [
      "GOVERNMENT_ID",
      "PAN_CARD",
      "ADDRESS_PROOF",
    ];

    /*
    |--------------------------------------------------------------------------
    | Check Missing Required Documents
    |--------------------------------------------------------------------------
    */

    const missingDocuments =
      requiredDocumentTypes.filter(
        (requiredType) =>
          !pandit.documents.some(
            (document) =>
              document.documentType ===
              requiredType
          )
      );

    if (missingDocuments.length > 0) {
      return NextResponse.json(
        {
          message:
            "Pandit cannot be approved because required documents are missing.",

          missingDocuments,
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Unverified Required Documents
    |--------------------------------------------------------------------------
    */

    const unverifiedDocuments =
      requiredDocumentTypes.filter(
        (requiredType) => {
          const document =
            pandit.documents.find(
              (item) =>
                item.documentType ===
                requiredType
            );

          return (
            !document ||
            !document.isVerified
          );
        }
      );

    if (
      unverifiedDocuments.length > 0
    ) {
      return NextResponse.json(
        {
          message:
            "All required documents must be verified before approving the Pandit.",

          unverifiedDocuments,
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Final Admin Approval
    |--------------------------------------------------------------------------
    */

    const approvedPandit =
      await prisma.pandit.update({
        where: {
          id: panditId,
        },

        data: {
          verificationStatus:
            PanditVerificationStatus.VERIFIED,
        },

        include: {
          languages: true,
          services: true,
          serviceAreas: true,
          availability: true,
          documents: true,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message:
        "Pandit approved successfully.",

      pandit: approvedPandit,
    });
  } catch (error) {
    console.error(
      "Failed to approve Pandit:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to approve Pandit.",
      },
      {
        status: 500,
      }
    );
  }
}