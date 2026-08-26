-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "devoteeId" INTEGER;

-- CreateIndex
CREATE INDEX "Booking_devoteeId_idx" ON "Booking"("devoteeId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_devoteeId_fkey" FOREIGN KEY ("devoteeId") REFERENCES "Devotee"("id") ON DELETE SET NULL ON UPDATE CASCADE;