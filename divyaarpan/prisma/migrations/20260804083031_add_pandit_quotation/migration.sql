-- AlterTable
ALTER TABLE "PanditBooking" ADD COLUMN     "discount" INTEGER DEFAULT 0,
ADD COLUMN     "poojaCharges" INTEGER,
ADD COLUMN     "quotationRemarks" TEXT,
ADD COLUMN     "quotationSentAt" TIMESTAMP(3),
ADD COLUMN     "samagriCharges" INTEGER,
ADD COLUMN     "travelCharges" INTEGER;
