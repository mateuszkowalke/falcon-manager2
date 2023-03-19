-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "documentType" TEXT;

-- CreateIndex
CREATE INDEX "Office_documentType_idx" ON "Office"("documentType");

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_documentType_fkey" FOREIGN KEY ("documentType") REFERENCES "DocumentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
