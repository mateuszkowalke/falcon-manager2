-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personalAddress" TEXT;

-- CreateIndex
CREATE INDEX "User_personalAddress_idx" ON "User"("personalAddress");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personalAddress_fkey" FOREIGN KEY ("personalAddress") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
