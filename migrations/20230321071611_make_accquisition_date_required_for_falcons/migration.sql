/*
  Warnings:

  - Made the column `accquiredDate` on table `Falcon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Falcon" ALTER COLUMN "birthDate" DROP DEFAULT,
ALTER COLUMN "accquiredDate" SET NOT NULL;
