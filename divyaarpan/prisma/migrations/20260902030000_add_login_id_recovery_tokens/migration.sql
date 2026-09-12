-- CreateTable
CREATE TABLE "LoginIdRecoveryToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginIdRecoveryToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginIdRecoveryToken_tokenHash_key" ON "LoginIdRecoveryToken"("tokenHash");
CREATE INDEX "LoginIdRecoveryToken_userId_idx" ON "LoginIdRecoveryToken"("userId");
CREATE INDEX "LoginIdRecoveryToken_expiresAt_idx" ON "LoginIdRecoveryToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "LoginIdRecoveryToken" ADD CONSTRAINT "LoginIdRecoveryToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
