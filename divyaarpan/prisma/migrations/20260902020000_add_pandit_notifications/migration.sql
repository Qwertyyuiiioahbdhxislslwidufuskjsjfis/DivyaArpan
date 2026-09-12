-- CreateTable
CREATE TABLE "PanditNotification" (
    "id" SERIAL NOT NULL,
    "panditId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "eventKey" TEXT NOT NULL,
    "bookingId" INTEGER,
    "offerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PanditNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PanditNotification_eventKey_key" ON "PanditNotification"("eventKey");
CREATE INDEX "PanditNotification_panditId_idx" ON "PanditNotification"("panditId");
CREATE INDEX "PanditNotification_panditId_isRead_idx" ON "PanditNotification"("panditId", "isRead");
CREATE INDEX "PanditNotification_createdAt_idx" ON "PanditNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "PanditNotification" ADD CONSTRAINT "PanditNotification_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
