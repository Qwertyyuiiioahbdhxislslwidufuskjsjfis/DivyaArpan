import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";


export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const { id } = await context.params;


    const booking =
      await prisma.booking.findUnique({

        where: {
          bookingId: id,
        },

      });


    if (!booking) {

      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json({

      success: true,

      booking,

    });


  } catch (error) {

    console.error("Fetch Booking Error:", error);


    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch booking",
      },
      {
        status: 500,
      }
    );

  }

}
