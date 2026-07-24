import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// DELETE - Delete one facility
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const facilityId = Number(id);

    if (!Number.isInteger(facilityId) || facilityId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid facility ID.",
        },
        { status: 400 }
      );
    }

    const existingFacility =
      await prisma.facility.findUnique({
        where: {
          id: facilityId,
        },
      });

    if (!existingFacility) {
      return NextResponse.json(
        {
          success: false,
          message: "Facility not found.",
        },
        { status: 404 }
      );
    }

    await prisma.facility.delete({
      where: {
        id: facilityId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Facility deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete facility:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete facility.",
      },
      { status: 500 }
    );
  }
}