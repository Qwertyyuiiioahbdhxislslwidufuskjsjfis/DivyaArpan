import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

function getExtension(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const documentType = formData.get("documentType");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "Please select a document to upload.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof documentType !== "string" ||
      !documentType.trim()
    ) {
      return NextResponse.json(
        {
          message: "Document type is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | File Type Validation
    |--------------------------------------------------------------------------
    */

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Only PDF, JPG and PNG documents are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | File Size Validation
    |--------------------------------------------------------------------------
    */

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message:
            "Document size must not exceed 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          message: "The selected document is empty.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Safe Unique Filename
    |--------------------------------------------------------------------------
    */

    const extension = getExtension(file);

    const safeDocumentType = documentType
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueId = crypto.randomUUID();

    const fileName =
      `${safeDocumentType}-${uniqueId}${extension}`;

    /*
    |--------------------------------------------------------------------------
    | Development Upload Directory
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | This is suitable only for local development.
    |
    | Production KYC documents must later be moved to
    | private/protected storage.
    |
    */

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "pandits"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    /*
    |--------------------------------------------------------------------------
    | Save File
    |--------------------------------------------------------------------------
    */

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    /*
    |--------------------------------------------------------------------------
    | Return Temporary Development URL
    |--------------------------------------------------------------------------
    */

    const documentUrl =
      `/uploads/pandits/${fileName}`;

    return NextResponse.json(
      {
        message: "Document uploaded successfully.",
        documentUrl,
        fileName,
        documentType: documentType.trim(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Pandit document upload failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to upload document.",
      },
      {
        status: 500,
      }
    );
  }     
}