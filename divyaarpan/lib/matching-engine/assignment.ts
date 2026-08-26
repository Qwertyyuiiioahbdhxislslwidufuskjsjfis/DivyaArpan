import { PanditBookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function assignBooking(
  bookingId: number,
  panditId: number
) {
  console.log("======================================");
  console.log("DIVYAARPAN SMART MATCH ENGINE");
  console.log("Assigning Booking...");
  console.log("======================================");

  // Check booking
  const booking = await prisma.panditBooking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Prevent double assignment
  if (booking.panditId) {
    console.log("Booking already assigned.");
    return booking;
  }

  // Assign booking
  const updatedBooking = await prisma.panditBooking.update({
    where: {
      id: bookingId,
    },
    data: {
      panditId,
      status: PanditBookingStatus.PANDIT_ASSIGNED,
      assignedAt: new Date(),
    },
  });

  console.log(`✅ Booking assigned to Pandit ID: ${panditId}`);

  // Expire all remaining pending offers
  await prisma.panditBookingOffer.updateMany({
    where: {
      bookingId,
      panditId: {
        not: panditId,
      },
      status: "PENDING",
    },
    data: {
      status: "EXPIRED",
    },
  });

  console.log("Remaining offers expired.");

  return updatedBooking;
}