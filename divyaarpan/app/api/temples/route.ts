import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all temples
export async function GET() {
  try {
    const temples = await prisma.temple.findMany({
      include: {
        poojas: true,
        galleries: true,
        facilities: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(temples);
  } catch (error) {
    console.error("Failed to fetch temples:", error);

    return NextResponse.json(
      { message: "Failed to fetch temples" },
      { status: 500 }
    );
  }
}

// POST - Add a new temple
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
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

    if (
      !name ||
      !slug ||
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

    const existingTemple = await prisma.temple.findUnique({
      where: {
        slug,
      },
    });

    if (existingTemple) {
      return NextResponse.json(
        { message: "A temple with this slug already exists." },
        { status: 409 }
      );
    }

    const temple = await prisma.temple.create({
      data: {
        name,
        slug,
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

    return NextResponse.json(
      {
        message: "Temple created successfully.",
        temple,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create temple:", error);

    return NextResponse.json(
      { message: "Failed to create temple." },
      { status: 500 }
    );
  }
}