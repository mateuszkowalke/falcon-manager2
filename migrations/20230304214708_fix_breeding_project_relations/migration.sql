/*
  Warnings:

  - You are about to drop the column `offices` on the `BreedingProject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BreedingProject" DROP CONSTRAINT "BreedingProject_offices_fkey";

-- DropIndex
DROP INDEX "Aviary_breedingProject_key";

-- DropIndex
DROP INDEX "BreedingProject_offices_key";

-- AlterTable
ALTER TABLE "BreedingProject" DROP COLUMN "offices";

-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "breedingProject" TEXT;

-- CreateIndex
CREATE INDEX "Aviary_breedingProject_idx" ON "Aviary"("breedingProject");

-- CreateIndex
CREATE INDEX "Office_breedingProject_idx" ON "Office"("breedingProject");

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_breedingProject_fkey" FOREIGN KEY ("breedingProject") REFERENCES "BreedingProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
