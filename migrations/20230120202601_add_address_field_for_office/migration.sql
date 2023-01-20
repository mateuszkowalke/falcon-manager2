/*
  Warnings:

  - A unique constraint covering the columns `[office]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "office" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Address_office_key" ON "Address"("office");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_office_fkey" FOREIGN KEY ("office") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
