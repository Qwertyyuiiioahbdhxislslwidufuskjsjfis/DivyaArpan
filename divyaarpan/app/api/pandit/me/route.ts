import { NextResponse } from "next/server";

import {
  getCurrentUserFromRequest,
} from "../../../lib/auth";
import { addMobileCors } from "../../../lib/mobile-cors";
import { prisma } from "@/app/lib/prisma";

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, { status: 204 })
  );
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user || user.role !== "PANDIT" || !user.panditId) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            error: "Unauthorized.",
          },
          { status: 401 }
        )
      );
    }

    const pandit = await prisma.pandit.findUnique({
      where: {
        id: user.panditId,
      },
      select: {
        id: true,
        panditCode: true,
        name: true,
        email: true,
        mobile: true,
        city: true,
        state: true,
        country: true,
        verificationStatus: true,
        isActive: true,
        isOnline: true,
        experienceYears: true,
        bio: true,
      },
    });

    if (!pandit) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            error: "Pandit profile not found.",
          },
          { status: 404 }
        )
      );
    }

    return addMobileCors(
      NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        pandit,
      })
    );
  } catch (error) {
    console.error("PANDIT ME ERROR:", error);

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          error: "Unable to load Pandit profile.",
        },
        { status: 500 }
      )
    );
  }
}
