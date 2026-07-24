import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch one temple
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const temple = await prisma.temple.findUnique({
      where: {
        slug,
      },
      include: {
        poojas: true,
        galleries: true,
        facilities: true,
      },
    });

    if (!temple) {
      return NextResponse.json(
        { message: "Temple not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(temple);
  } catch (error) {
    console.error("Failed to fetch temple:", error);

    return NextResponse.json(
      { message: "Failed to fetch temple" },
      { status: 500 }
    );
  }
}

// PUT - Update one temple
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();

    const {
      name,
      newSlug,
      city,
      state,
      address,
      description,
      openingTime,
      closingTime,
      mapUrl,
      featuredImage,
      isFeatured,
    } = body;

    const existingTemple = await prisma.temple.findUnique({
      where: {
        slug,
      },
    });

    if (!existingTemple) {
      return NextResponse.json(
        { message: "Temple not found" },
        { status: 404 }
      );
    }

    if (
      !name ||
      !newSlug ||
      !city ||
      !state ||
      !address ||
      !description ||
      !openingTime ||
      !closingTime ||
      !mapUrl ||
      !featuredImage
    ) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // If slug is changed, make sure another temple is not using it
    if (newSlug !== slug) {
      const slugExists = await prisma.temple.findUnique({
        where: {
          slug: newSlug,
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "Another temple is already using this slug." },
          { status: 409 }
        );
      }
    }

    const temple = await prisma.temple.update({
      where: {
        slug,
      },
      data: {
        name,
        slug: newSlug,
        city,
        state,
        address,
        description,
        openingTime,
        closingTime,
        mapUrl,
        featuredImage,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({
      message: "Temple updated successfully.",
      temple,
    });
  } catch (error) {
    console.error("Failed to update temple:", error);

    return NextResponse.json(
      { message: "Failed to update temple." },
      { status: 500 }
    );
  }
}