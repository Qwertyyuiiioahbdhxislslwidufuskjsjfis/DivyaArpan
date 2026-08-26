import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "../../lib/auth";

// GET - Fetch all devotees
export async function GET(request: Request) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const status = url.searchParams.get("status");
    const devotees = await prisma.devotee.findMany({
      where: {
        ...(status === "active" ? { isActive: true } : {}),
        ...(status === "inactive" ? { isActive: false } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { mobile: { contains: search } },
            { email: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { state: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: { _count: { select: { bookings: true, panditBookings: true, astrologyBookings: true } } },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      devotees,
    });
  } catch (error) {
    console.error("Failed to fetch devotees:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch devotees.",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new devotee
export async function POST(request: Request) {
  try {
    if (!(await requireRole("ADMIN"))) {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const mobile =
      typeof body.mobile === "string" ? body.mobile.trim() : "";

    const email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim().toLowerCase()
        : null;

    const city =
      typeof body.city === "string" && body.city.trim()
        ? body.city.trim()
        : null;

    const state =
      typeof body.state === "string" && body.state.trim()
        ? body.state.trim()
        : null;

    const country =
      typeof body.country === "string" && body.country.trim()
        ? body.country.trim()
        : "India";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Devotee name is required.",
        },
        { status: 400 }
      );
    }

    if (!mobile) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required.",
        },
        { status: 400 }
      );
    }

    const existingMobile = await prisma.devotee.findUnique({
      where: {
        mobile,
      },
    });

    if (existingMobile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A devotee with this mobile number already exists.",
        },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.devotee.findUnique({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A devotee with this email address already exists.",
          },
          { status: 409 }
        );
      }
    }

    const devotee = await prisma.devotee.create({
      data: {
        name,
        mobile,
        email,
        city,
        state,
        country,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Devotee created successfully.",
        devotee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create devotee:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create devotee.",
      },
      { status: 500 }
    );
  }
}