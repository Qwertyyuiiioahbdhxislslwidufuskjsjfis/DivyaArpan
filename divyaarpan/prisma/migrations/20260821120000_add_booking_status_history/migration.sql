CREATE TABLE "BookingStatusHistory" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "actorRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PanditBookingStatusHistory" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "fromStatus" "PanditBookingStatus",
    "toStatus" "PanditBookingStatus" NOT NULL,
    "actorRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PanditBookingStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookingStatusHistory_bookingId_createdAt_idx" ON "BookingStatusHistory"("bookingId", "createdAt");
CREATE INDEX "PanditBookingStatusHistory_bookingId_createdAt_idx" ON "PanditBookingStatusHistory"("bookingId", "createdAt");

ALTER TABLE "BookingStatusHistory" ADD CONSTRAINT "BookingStatusHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PanditBookingStatusHistory" ADD CONSTRAINT "PanditBookingStatusHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "PanditBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;