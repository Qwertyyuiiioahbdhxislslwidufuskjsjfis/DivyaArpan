import { prisma } from "@/lib/prisma";
import { findEligiblePandits } from "./filters";
import { rankPandits } from "./ranking";
import { dispatchBookingOffers } from "./dispatcher";

export async function runMatchingEngine(bookingId: number) {
  console.log("");
  console.log("======================================");
  console.log("DIVYAARPAN SMART MATCH ENGINE STARTED");
  console.log("======================================");

  return prisma.$transaction(
    async (tx) => {
      /*
       * Serialize matching rounds for this booking.
       *
       * pg_advisory_xact_lock is held only for this transaction and
       * automatically released on commit/rollback.
       *
       * Using a two-integer advisory-lock key gives the matching engine
       * its own namespace while bookingId identifies the individual
       * booking.
       */
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(
          CAST(4441 AS integer),
          CAST(${bookingId} AS integer)
        )
      `;

      /*
       * IMPORTANT:
       * Re-read the booking only AFTER acquiring the lock.
       * Another matching request may have completed while this request
       * was waiting for the advisory lock.
       */
      const booking = await tx.panditBooking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!booking) {
        throw new Error("Booking not found.");
      }

      console.log("Booking ID:", booking.bookingId);

      if (booking.panditId) {
        console.log(
          "Booking already assigned. Matching stopped."
        );
        return [];
      }

      /*
       * Do not start another round while an active offer from the
       * current round still exists.
       *
       * This is especially important when reject/expire/polling
       * requests arrive at nearly the same time.
       */
      const pendingOffers =
        await tx.panditBookingOffer.count({
          where: {
            bookingId: booking.id,
            status: "PENDING",
          },
        });

      if (pendingOffers > 0) {
        console.log(
          `Matching stopped. ${pendingOffers} pending offer(s) still active.`
        );
        return [];
      }

      const eligiblePandits = await findEligiblePandits({
        tx,
        bookingId: booking.id,
        city: booking.city,
        pincode: booking.pincode,
        service: booking.service,
        language: booking.language,
        bookingType: booking.bookingType,
        date: booking.date,
        time: booking.time,
      });

      if (eligiblePandits.length === 0) {
        console.log(
          "❌ No new eligible Pandits found."
        );

        if (booking.status !== "NO_PANDIT_AVAILABLE") {
          await tx.panditBooking.update({
            where: {
              id: booking.id,
            },
            data: {
              status: "NO_PANDIT_AVAILABLE",
            },
          });

          await tx.panditBookingStatusHistory.create({
            data: {
              bookingId: booking.id,
              fromStatus: booking.status,
              toStatus: "NO_PANDIT_AVAILABLE",
              actorRole: "SYSTEM",
            },
          });
        }

        return [];
      }

      const rankedPandits =
        rankPandits(eligiblePandits);

      const offers =
        await dispatchBookingOffers(
          tx,
          booking.id,
          rankedPandits
        );

      if (offers.length === 0) {
        if (booking.status !== "NO_PANDIT_AVAILABLE") {
          await tx.panditBooking.update({
            where: {
              id: booking.id,
            },
            data: {
              status: "NO_PANDIT_AVAILABLE",
            },
          });

          await tx.panditBookingStatusHistory.create({
            data: {
              bookingId: booking.id,
              fromStatus: booking.status,
              toStatus: "NO_PANDIT_AVAILABLE",
              actorRole: "SYSTEM",
            },
          });
        }

        return [];
      }

      if (booking.status !== "SEARCHING") {
        await tx.panditBooking.update({
          where: {
            id: booking.id,
          },
          data: {
            status: "SEARCHING",
            searchStartedAt:
              booking.searchStartedAt ?? new Date(),
          },
        });
      }

      console.log("======================================");
      console.log("MATCHING COMPLETED");
      console.log("Offers Created:", offers.length);
      console.log("======================================");

      return offers;
    },
    {
      maxWait: 10000,
      timeout: 30000,
    }
  );
}
