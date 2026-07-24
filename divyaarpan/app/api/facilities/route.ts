import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET - Fetch all facilities
export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        temple: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      facilities,
    });
  } catch (error) {
    console.error("Failed to fetch facilities:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch facilities.",
      },
      { status: 500 }
    );
  }
}

// POST - Add a facility
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const templeId = Number(body.templeId);
    const facility =
      typeof body.facility === "string"
        ? body.facility.trim()
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

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility name is required.",
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

    const newFacility = await prisma.facility.create({
      data: {
        templeId,
        facility,
      },
      include: {
        temple: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Facility added successfully.",
        facility: newFacility,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add facility:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add facility.",
      },
      { status: 500 }
    );
  }
}