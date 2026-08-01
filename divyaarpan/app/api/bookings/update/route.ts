import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(request: Request) {

  try {

    const body = await request.json();


    const booking = await prisma.booking.update({

      where: {
        bookingId: body.bookingId,
      },


      data: {

        status: "Confirmed",

      },

    });


    return NextResponse.json({

      success: true,

      booking,

    });


  } catch (error) {


    console.error(error);


    return NextResponse.json(

      {
        success: false,
        error: "Unable to update booking",
      },

      {
        status: 500,
      }

    );

  } 

}