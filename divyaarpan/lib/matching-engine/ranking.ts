import { Pandit } from "@prisma/client";

export interface RankedPandit extends Pandit {
  matchingScore: number;
}

export function rankPandits(pandits: Pandit[]): RankedPandit[] {
  console.log("Calculating Matching Scores...");

  const ranked = pandits.map((pandit) => {
    let score = 0;

    // Verified
    if (pandit.verificationStatus === "VERIFIED") {
      score += 50;
    }

    // Online
    if (pandit.isOnline) {
      score += 30;
    }

    // Active
    if (pandit.isActive) {
      score += 20;
    }

    // Customer Rating
    score += Number(pandit.rating) * 10;

    // Experience
    score += pandit.experienceYears * 2;

    // Completed Bookings
    score += Math.min(pandit.totalBookings, 100);

    console.log(
      `${pandit.name} → Score: ${score}`
    );

    return {
      ...pandit,
      matchingScore: score,
    };
  });

  ranked.sort((a, b) => b.matchingScore - a.matchingScore);

  console.log("Ranking Completed");

  return ranked;
}