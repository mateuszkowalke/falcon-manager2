/*
  Warnings:

  - You are about to drop the column `rawFile` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `scanFile` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "rawFile",
DROP COLUMN "scanFile",
ADD COLUMN     "rawFile_filename" TEXT,
ADD COLUMN     "rawFile_filesize" INTEGER,
ADD COLUMN     "scanFile_filename" TEXT,
ADD COLUMN     "scanFile_filesize" INTEGER;
