import { PanditVerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface FilterParams {
  city: string;
  service: string;
  language: string;
}

export async function findEligiblePandits({
  city,
  service,
  language,
}: FilterParams) {
  console.log("======================================");
  console.log("DIVYAARPAN SMART MATCH ENGINE");
  console.log("Searching Eligible Pandits...");
  console.log("City:", city);
  console.log("Service:", service);
  console.log("Language:", language);
  console.log("======================================");

  const pandits = await prisma.pandit.findMany({
    where: {
      city: {
        equals: city,
        mode: "insensitive",
      },

      isActive: true,

      isOnline: true,

      verificationStatus: PanditVerificationStatus.VERIFIED,

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

  console.log(`✅ ${pandits.length} Eligible Pandits Found`);

  return pandits;
}