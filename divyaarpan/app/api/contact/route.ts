import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isPhone(value: string) {
  return /^\+?[0-9\s-]{10,20}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (!isEmail(email) || email.length > 120) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!isPhone(phone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid contact number." },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Message should be between 10 and 2000 characters." },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. We have received your message and will contact you soon.",
    });
  } catch (error) {
    console.error("CONTACT SUBMISSION ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to submit your message right now. Please try again." },
      { status: 500 }
    );
  }
}
