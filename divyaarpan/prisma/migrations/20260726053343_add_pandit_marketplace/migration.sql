/*
  Warnings:

  - The `status` column on the `PanditBooking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `PanditBooking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PanditVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PanditBookingType" AS ENUM ('IMMEDIATE', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "PanditUrgency" AS ENUM ('ASAP', 'WITHIN_1_HOUR', 'WITHIN_2_HOURS', 'WITHIN_4_HOURS', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "PanditBookingStatus" AS ENUM ('REQUESTED', 'SEARCHING', 'PANDIT_ASSIGNED', 'AWAITING_PAYMENT', 'CONFIRMED', 'PANDIT_ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_PANDIT_AVAILABLE');

-- CreateEnum
CREATE TYPE "PanditPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PanditOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "PanditBooking" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "bookingType" "PanditBookingType" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "devoteeId" INTEGER,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "searchStartedAt" TIMESTAMP(3),
ADD COLUMN     "state" TEXT,
ADD COLUMN     "urgency" "PanditUrgency" NOT NULL DEFAULT 'SCHEDULED',
DROP COLUMN "status",
ADD COLUMN     "status" "PanditBookingStatus" NOT NULL DEFAULT 'REQUESTED',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PanditPaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Pandit" (
    "id" SERIAL NOT NULL,
    "panditCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "address" TEXT,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "verificationStatus" "PanditVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "acceptsImmediate" BOOLEAN NOT NULL DEFAULT true,
    "acceptsScheduled" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pandit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditLanguage" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PanditLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditService" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "basePrice" INTEGER,
    "durationMinutes" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanditService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditServiceArea" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "serviceRadiusKm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PanditServiceArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditAvailability" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanditAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditDocument" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanditDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanditBookingOffer" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "panditId" INTEGER NOT NULL,
    "status" "PanditOfferStatus" NOT NULL DEFAULT 'PENDING',
    "dispatchRound" INTEGER NOT NULL DEFAULT 1,
    "offeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanditBookingOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pandit_panditCode_key" ON "Pandit"("panditCode");

-- CreateIndex
CREATE UNIQUE INDEX "Pandit_mobile_key" ON "Pandit"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Pandit_email_key" ON "Pandit"("email");

-- CreateIndex
CREATE INDEX "Pandit_city_idx" ON "Pandit"("city");

-- CreateIndex
CREATE INDEX "Pandit_state_idx" ON "Pandit"("state");

-- CreateIndex
CREATE INDEX "Pandit_isOnline_idx" ON "Pandit"("isOnline");

-- CreateIndex
CREATE INDEX "Pandit_isActive_idx" ON "Pandit"("isActive");

-- CreateIndex
CREATE INDEX "Pandit_verificationStatus_idx" ON "Pandit"("verificationStatus");

-- CreateIndex
CREATE INDEX "Pandit_city_isOnline_isActive_verificationStatus_idx" ON "Pandit"("city", "isOnline", "isActive", "verificationStatus");

-- CreateIndex
CREATE INDEX "PanditLanguage_language_idx" ON "PanditLanguage"("language");

-- CreateIndex
CREATE UNIQUE INDEX "PanditLanguage_panditId_language_key" ON "PanditLanguage"("panditId", "language");

-- CreateIndex
CREATE INDEX "PanditService_serviceName_idx" ON "PanditService"("serviceName");

-- CreateIndex
CREATE INDEX "PanditService_isActive_idx" ON "PanditService"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PanditService_panditId_serviceName_key" ON "PanditService"("panditId", "serviceName");

-- CreateIndex
CREATE INDEX "PanditServiceArea_city_idx" ON "PanditServiceArea"("city");

-- CreateIndex
CREATE INDEX "PanditServiceArea_area_idx" ON "PanditServiceArea"("area");

-- CreateIndex
CREATE INDEX "PanditServiceArea_pincode_idx" ON "PanditServiceArea"("pincode");

-- CreateIndex
CREATE INDEX "PanditServiceArea_panditId_city_idx" ON "PanditServiceArea"("panditId", "city");

-- CreateIndex
CREATE INDEX "PanditAvailability_panditId_idx" ON "PanditAvailability"("panditId");

-- CreateIndex
CREATE INDEX "PanditAvailability_dayOfWeek_idx" ON "PanditAvailability"("dayOfWeek");

-- CreateIndex
CREATE INDEX "PanditDocument_panditId_idx" ON "PanditDocument"("panditId");

-- CreateIndex
CREATE INDEX "PanditDocument_isVerified_idx" ON "PanditDocument"("isVerified");

-- CreateIndex
CREATE INDEX "PanditBookingOffer_bookingId_idx" ON "PanditBookingOffer"("bookingId");

-- CreateIndex
CREATE INDEX "PanditBookingOffer_panditId_idx" ON "PanditBookingOffer"("panditId");

-- CreateIndex
CREATE INDEX "PanditBookingOffer_status_idx" ON "PanditBookingOffer"("status");

-- CreateIndex
CREATE INDEX "PanditBookingOffer_panditId_status_idx" ON "PanditBookingOffer"("panditId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PanditBookingOffer_bookingId_panditId_key" ON "PanditBookingOffer"("bookingId", "panditId");

-- CreateIndex
CREATE INDEX "Booking_mobile_idx" ON "Booking"("mobile");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Devotee_city_idx" ON "Devotee"("city");

-- CreateIndex
CREATE INDEX "Devotee_isActive_idx" ON "Devotee"("isActive");

-- CreateIndex
CREATE INDEX "Facility_templeId_idx" ON "Facility"("templeId");

-- CreateIndex
CREATE INDEX "Gallery_templeId_idx" ON "Gallery"("templeId");

-- CreateIndex
CREATE INDEX "PanditBooking_devoteeId_idx" ON "PanditBooking"("devoteeId");

-- CreateIndex
CREATE INDEX "PanditBooking_panditId_idx" ON "PanditBooking"("panditId");

-- CreateIndex
CREATE INDEX "PanditBooking_city_idx" ON "PanditBooking"("city");

-- CreateIndex
CREATE INDEX "PanditBooking_service_idx" ON "PanditBooking"("service");

-- CreateIndex
CREATE INDEX "PanditBooking_language_idx" ON "PanditBooking"("language");

-- CreateIndex
CREATE INDEX "PanditBooking_bookingType_idx" ON "PanditBooking"("bookingType");

-- CreateIndex
CREATE INDEX "PanditBooking_urgency_idx" ON "PanditBooking"("urgency");

-- CreateIndex
CREATE INDEX "PanditBooking_status_idx" ON "PanditBooking"("status");

-- CreateIndex
CREATE INDEX "PanditBooking_paymentStatus_idx" ON "PanditBooking"("paymentStatus");

-- CreateIndex
CREATE INDEX "PanditBooking_createdAt_idx" ON "PanditBooking"("createdAt");

-- CreateIndex
CREATE INDEX "PanditBooking_city_service_language_status_idx" ON "PanditBooking"("city", "service", "language", "status");

-- CreateIndex
CREATE INDEX "Pooja_templeId_idx" ON "Pooja"("templeId");

-- CreateIndex
CREATE INDEX "Pooja_name_idx" ON "Pooja"("name");

-- CreateIndex
CREATE INDEX "Pooja_isActive_idx" ON "Pooja"("isActive");

-- CreateIndex
CREATE INDEX "Temple_city_idx" ON "Temple"("city");

-- CreateIndex
CREATE INDEX "Temple_state_idx" ON "Temple"("state");

-- CreateIndex
CREATE INDEX "Temple_isFeatured_idx" ON "Temple"("isFeatured");

-- AddForeignKey
ALTER TABLE "PanditLanguage" ADD CONSTRAINT "PanditLanguage_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditService" ADD CONSTRAINT "PanditService_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditServiceArea" ADD CONSTRAINT "PanditServiceArea_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditAvailability" ADD CONSTRAINT "PanditAvailability_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditDocument" ADD CONSTRAINT "PanditDocument_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditBooking" ADD CONSTRAINT "PanditBooking_devoteeId_fkey" FOREIGN KEY ("devoteeId") REFERENCES "Devotee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditBooking" ADD CONSTRAINT "PanditBooking_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditBookingOffer" ADD CONSTRAINT "PanditBookingOffer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "PanditBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanditBookingOffer" ADD CONSTRAINT "PanditBookingOffer_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
