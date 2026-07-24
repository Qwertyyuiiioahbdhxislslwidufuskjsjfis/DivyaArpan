import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all poojas
export async function GET() {
  try {
    const poojas = await prisma.pooja.findMany({
      include: {
        temple: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(poojas);
  } catch (error) {
    console.error("Failed to fetch poojas:", error);

    return NextResponse.json(
      { message: "Failed to fetch poojas." },
      { status: 500 }
    );
  }
}

// POST - Create a new pooja
export async function POST(request: Request) {
  try {
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

    const pooja = await prisma.pooja.create({
      data: {
        templeId: Number(templeId),
        name,
        description,
        duration,
        price,
        image: image || "",
        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      },
      include: {
        temple: true,
      },
    });

    return NextResponse.json(
      {
        message: "Pooja created successfully.",
        pooja,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create pooja:", error);

    return NextResponse.json(
      { message: "Failed to create pooja." },
      { status: 500 }
    );
  }
}