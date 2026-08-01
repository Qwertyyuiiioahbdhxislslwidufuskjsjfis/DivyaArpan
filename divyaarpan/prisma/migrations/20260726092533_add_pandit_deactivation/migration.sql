-- AlterTable
ALTER TABLE "Pandit" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivationReason" TEXT,
ADD COLUMN     "deactivationRemarks" TEXT,
ADD COLUMN     "reactivatedAt" TIMESTAMP(3);
