import { NextResponse } from "next/server";

import { addMobileCors } from "@/app/lib/mobile-cors";
import { prisma } from "@/lib/prisma";

function mobileJson(
  body: unknown,
  init?: ResponseInit
) {
  return addMobileCors(
    NextResponse.json(body, init)
  );
}

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, { status: 204 })
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const mobile =
      typeof body.mobile === "string"
        ? body.mobile.replace(/\D/g, "")
        : "";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return mobileJson(
        {
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return mobileJson(
        {
          message:
            "Please enter a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    /*
     * Registration creates both a User and a Pandit.
     * Check every table that can make final registration reject
     * the email/mobile so Personal Details gives the answer early.
     */
    const [
      userEmailExists,
      panditEmailExists,
      panditMobileExists,
      userMobileExists,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { id: true },
      }),

      prisma.pandit.findUnique({
        where: { email },
        select: { id: true },
      }),

      prisma.pandit.findUnique({
        where: { mobile },
        select: { id: true },
      }),

      prisma.user.findFirst({
        where: { phone: mobile },
        select: { id: true },
      }),
    ]);

    return mobileJson({
      emailAvailable:
        !userEmailExists && !panditEmailExists,

      mobileAvailable:
        !panditMobileExists && !userMobileExists,
    });
  } catch (error) {
    console.error(
      "Pandit registration availability check failed:",
      error
    );

    return mobileJson(
      {
        message:
          "Unable to validate email and mobile number.",
      },
      { status: 500 }
    );
  }
}
