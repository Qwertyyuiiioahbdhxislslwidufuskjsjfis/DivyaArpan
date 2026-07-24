import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// DELETE - Delete one gallery image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = Number(id);

    if (!Number.isInteger(galleryId) || galleryId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery image ID.",
        },
        { status: 400 }
      );
    }

    const existingGallery = await prisma.gallery.findUnique({
      where: {
        id: galleryId,
      },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image not found.",
        },
        { status: 404 }
      );
    }

    await prisma.gallery.delete({
      where: {
        id: galleryId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete gallery image:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery image.",
      },
      { status: 500 }
    );
  }
}