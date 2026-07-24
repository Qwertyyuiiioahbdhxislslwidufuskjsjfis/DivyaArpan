import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET - Fetch all gallery images
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        temple: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      galleries,
    });
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery images.",
      },
      { status: 500 }
    );
  }
}

// POST - Add a gallery image
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const templeId = Number(body.templeId);
    const imageUrl =
      typeof body.imageUrl === "string"
        ? body.imageUrl.trim()
        : "";

    if (!Number.isInteger(templeId) || templeId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid temple.",
        },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    const temple = await prisma.temple.findUnique({
      where: {
        id: templeId,
      },
    });

    if (!temple) {
      return NextResponse.json(
        {
          success: false,
          message: "Temple not found.",
        },
        { status: 404 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        templeId,
        imageUrl,
      },
      include: {
        temple: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image added successfully.",
        gallery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add gallery image:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add gallery image.",
      },
      { status: 500 }
    );
  }
}