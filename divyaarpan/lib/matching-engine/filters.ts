import { PanditBookingType, PanditVerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface FilterParams {
  bookingId: number;
  city: string;
  pincode: string | null;
  service: string;
  language: string;
  bookingType: PanditBookingType;
  date: string;
  time: string;
}

function isAvailableForScheduledBooking(
  availability: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[],
  date: string,
  time: string
) {
  if (availability.length === 0) return true;
  const scheduledDate = new Date(`${date}T00:00:00`);
  const match = time.match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i);
  if (Number.isNaN(scheduledDate.getTime()) || !match) return false;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const requestedMinutes = hours * 60 + minutes;
  const toMinutes = (value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  };

  return availability.some((slot) =>
    slot.isAvailable &&
    slot.dayOfWeek === scheduledDate.getDay() &&
    requestedMinutes >= toMinutes(slot.startTime) &&
    requestedMinutes <= toMinutes(slot.endTime)
  );
}

export async function findEligiblePandits({
  bookingId,
  city,
  pincode,
  service,
  language,
  bookingType,
  date,
  time,
}: FilterParams) {
  console.log("======================================");
  console.log("DIVYAARPAN SMART MATCH ENGINE");
  console.log("Searching Eligible Pandits...");
  console.log("Booking ID:", bookingId);
  console.log("City:", city);
  console.log("Service:", service);
  console.log("Language:", language);
  console.log("Booking Type:", bookingType);
  console.log("======================================");

  // Pandits who have already received an offer for this booking
  // must not be selected again in a later matching round.
  const previouslyOffered = await prisma.panditBookingOffer.findMany({
    where: {
      bookingId,
    },
    select: {
      panditId: true,
    },
  });

  const excludedPanditIds = previouslyOffered.map(
    (offer) => offer.panditId
  );

  console.log(
    "Previously offered Pandits:",
    excludedPanditIds.length
  );

  const pandits = await prisma.pandit.findMany({
    where: {
      id: {
        notIn: excludedPanditIds,
      },

      city: {
        equals: city,
        mode: "insensitive",
      },

      isActive: true,

      verificationStatus: PanditVerificationStatus.VERIFIED,

      ...(bookingType === "IMMEDIATE"
        ? {
            isOnline: true,
            acceptsImmediate: true,
          }
        : {
            acceptsScheduled: true,
          }),

      services: {
        some: {
          serviceName: {
            equals: service,
            mode: "insensitive",
          },
          isActive: true,
        },
      },

      languages: {
        some: {
          language: {
            equals: language,
            mode: "insensitive",
          },
        },
      },

      serviceAreas: {
        some: {
          city: { equals: city, mode: "insensitive" },
          ...(pincode ? { pincode } : {}),
        },
      },
    },

    include: {
      services: true,
      languages: true,
      availability: true,
      serviceAreas: true,
    },

    orderBy: {
      rating: "desc",
    },
  });

  console.log(
    `✅ ${pandits.length} New Eligible Pandits Found`
  );

  return bookingType === "SCHEDULED"
    ? pandits.filter((pandit) => isAvailableForScheduledBooking(pandit.availability, date, time))
    : pandits;
}
