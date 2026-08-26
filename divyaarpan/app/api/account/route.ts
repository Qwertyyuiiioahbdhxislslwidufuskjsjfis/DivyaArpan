import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "DEVOTEE") {
    return NextResponse.json(
      { success: false, error: "Devotee authentication required." },
      { status: 401 }
    );
  }

  const devotee = user.devoteeId
    ? await prisma.devotee.findUnique({ where: { id: user.devoteeId } })
    : null;

  return NextResponse.json({
    success: true,
    account: {
      name: devotee?.name || user.name,
      email: devotee?.email || user.email,
      mobile: devotee?.mobile || user.phone || "Not provided",
      city: devotee?.city || null,
      state: devotee?.state || null,
      country: devotee?.country || "India",
      isActive: devotee?.isActive ?? true,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "DEVOTEE" || !user.devoteeId) {
    return NextResponse.json(
      { success: false, error: "Devotee authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : null;
    const state = typeof body.state === "string" && body.state.trim() ? body.state.trim() : null;
    const country = typeof body.country === "string" && body.country.trim() ? body.country.trim() : "India";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, error: "Enter your full name." }, { status: 400 });
    }
    if (!/^\+?[0-9]{10,15}$/.test(mobile)) {
      return NextResponse.json({ success: false, error: "Enter a valid mobile number." }, { status: 400 });
    }

    const duplicate = await prisma.devotee.findFirst({
      where: { mobile, id: { not: user.devoteeId } },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "That mobile number is already in use." },
        { status: 409 }
      );
    }

    const devotee = await prisma.$transaction(async (transaction) => {
      await transaction.user.update({ where: { id: user.id }, data: { name, phone: mobile } });
      return transaction.devotee.update({
        where: { id: user.devoteeId! },
        data: { name, mobile, city, state, country },
      });
    });

    return NextResponse.json({
      success: true,
      account: {
        name: devotee.name,
        email: devotee.email || user.email,
        mobile: devotee.mobile,
        city: devotee.city,
        state: devotee.state,
        country: devotee.country,
        isActive: devotee.isActive,
      },
    });
  } catch (error) {
    console.error("ACCOUNT UPDATE ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to update your profile right now." }, { status: 500 });
  }
}