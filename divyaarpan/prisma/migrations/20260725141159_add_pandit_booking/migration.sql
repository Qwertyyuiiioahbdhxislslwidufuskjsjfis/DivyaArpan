-- CreateTable
CREATE TABLE "PanditBooking" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "sankalp" TEXT,
    "devoteeName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Payment Pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "panditId" INTEGER,
    "panditName" TEXT,
    "amount" INTEGER,
    "paymentId" TEXT,
    "paymentOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanditBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PanditBooking_bookingId_key" ON "PanditBooking"("bookingId");
