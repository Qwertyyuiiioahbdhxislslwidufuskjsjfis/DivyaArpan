CREATE TABLE "AstrologyBooking" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "consultationMode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthTime" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Payment Pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "paymentOrderId" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "devoteeId" INTEGER,

    CONSTRAINT "AstrologyBooking_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AstrologyBooking_bookingId_key" ON "AstrologyBooking"("bookingId");
CREATE INDEX "AstrologyBooking_devoteeId_idx" ON "AstrologyBooking"("devoteeId");
CREATE INDEX "AstrologyBooking_status_idx" ON "AstrologyBooking"("status");
CREATE INDEX "AstrologyBooking_createdAt_idx" ON "AstrologyBooking"("createdAt");

ALTER TABLE "AstrologyBooking" ADD CONSTRAINT "AstrologyBooking_devoteeId_fkey" FOREIGN KEY ("devoteeId") REFERENCES "Devotee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
