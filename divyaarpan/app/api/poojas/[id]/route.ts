import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch one pooja
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pooja = await prisma.pooja.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        temple: true,
      },
    });

    if (!pooja) {
      return NextResponse.json(
        { message: "Pooja not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(pooja);
  } catch (error) {
    console.error("Failed to fetch pooja:", error);

    return NextResponse.json(
      { message: "Failed to fetch pooja." },
      { status: 500 }
    );
  }
}

// PUT - Update one pooja
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      templeId,
      name,
      description,
      duration,
      price,
      image,
      isActive,
    } = body;

    if (
      !templeId ||
      !name ||
      !description ||
      !duration ||
      !price
    ) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const existingPooja = await prisma.pooja.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingPooja) {
      return NextResponse.json(
        { message: "Pooja not found." },
        { status: 404 }
      );
    }

    const temple = await prisma.temple.findUnique({
      where: {
        id: Number(templeId),
      },
    });

    if (!temple) {
      return NextResponse.json(
        { message: "Selected temple was not found." },
        { status: 404 }
      );
    }

    const pooja = await prisma.pooja.update({
      where: {
        id: Number(id),
      },
      data: {
        templeId: Number(templeId),
        name,
        description,
        duration,
        price: String(price),
        image: image || "",
        isActive: Boolean(isActive),
      },
      include: {
        temple: true,
      },
    });

    return NextResponse.json({
      message: "Pooja updated successfully.",
      pooja,
    });
  } catch (error) {
    console.error("Failed to update pooja:", error);

    return NextResponse.json(
      { message: "Failed to update pooja." },
      { status: 500 }
    );
  }
}

// DELETE - Delete one pooja
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingPooja = await prisma.pooja.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingPooja) {
      return NextResponse.json(
        { message: "Pooja not found." },
        { status: 404 }
      );
    }

    await prisma.pooja.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Pooja deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete pooja:", error);

    return NextResponse.json(
      { message: "Failed to delete pooja." },
      { status: 500 }
    );
  }
}