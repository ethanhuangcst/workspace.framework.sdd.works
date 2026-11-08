-- CreateTable
CREATE TABLE "InviteToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "invitedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteToken_tokenHash_key" ON "InviteToken"("tokenHash");

-- CreateIndex
CREATE INDEX "InviteToken_email_idx" ON "InviteToken"("email");

-- CreateIndex
CREATE INDEX "InviteToken_invitedBy_idx" ON "InviteToken"("invitedBy");

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
