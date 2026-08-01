import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    id: string;
    documentId: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| PATCH - Verify / Unverify Pandit Document
|--------------------------------------------------------------------------
|
| Route:
| PATCH /api/pandits/:id/documents/:documentId
|
| Body:
| {
|   "isVerified": true
| }
|
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id, documentId } = await context.params;

    const panditId = Number(id);
    const panditDocumentId = Number(documentId);

    /*
    |--------------------------------------------------------------------------
    | Validate IDs
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

    if (
      !Number.isInteger(panditDocumentId) ||
      panditDocumentId <= 0
    ) {
      return NextResponse.json(
        {
          message: "Invalid document ID.",
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

    const { isVerified } = body;

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        {
          message:
            "isVerified must be true or false.",
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
    | Check Document Exists AND Belongs To This Pandit
    |--------------------------------------------------------------------------
    */

    const existingDocument =
      await prisma.panditDocument.findFirst({
        where: {
          id: panditDocumentId,
          panditId,
        },
      });

    if (!existingDocument) {
      return NextResponse.json(
        {
          message:
            "Document not found for this Pandit.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Verification Status
    |--------------------------------------------------------------------------
    */

    const document =
      await prisma.panditDocument.update({
        where: {
          id: panditDocumentId,
        },

        data: {
          isVerified,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Count Documents
    |--------------------------------------------------------------------------
    */

    const totalDocuments =
      await prisma.panditDocument.count({
        where: {
          panditId,
        },
      });

    const verifiedDocuments =
      await prisma.panditDocument.count({
        where: {
          panditId,
          isVerified: true,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      message: isVerified
        ? "Document verified successfully."
        : "Document verification removed.",

      document,

      verificationSummary: {
        totalDocuments,
        verifiedDocuments,
        allDocumentsVerified:
          totalDocuments > 0 &&
          totalDocuments === verifiedDocuments,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update document verification:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update document verification.",
      },
      {
        status: 500,
      }
    );
  }
}