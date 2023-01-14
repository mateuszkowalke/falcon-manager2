-- CreateEnum
CREATE TYPE "FalconSexType" AS ENUM ('UNKNOWN', 'MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreedingProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "vetRegNo" TEXT NOT NULL DEFAULT '',
    "offices" TEXT,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BreedingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aviary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "falcons" TEXT,
    "lastCleaned" TIMESTAMP(3),
    "breedingProject" TEXT,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aviary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL DEFAULT '',
    "no" TEXT NOT NULL DEFAULT '',
    "zipCode" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "breedingProject" TEXT,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Falcon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "ring" TEXT NOT NULL DEFAULT '',
    "species" TEXT,
    "sex" "FalconSexType" DEFAULT 'UNKNOWN',
    "birthDate" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT '',
    "widthYoung" INTEGER,
    "lengthYoung" INTEGER,
    "weightYoung" INTEGER,
    "widthOld" INTEGER,
    "lengthOld" INTEGER,
    "weightOld" INTEGER,
    "notes" TEXT NOT NULL DEFAULT '',
    "inPair" TEXT,
    "parentPair" TEXT,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Falcon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "male" TEXT,
    "female" TEXT,
    "owner" TEXT,
    "putTogether" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "split" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "latin" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "falcon" TEXT,
    "documentType" TEXT,
    "documentNumber" TEXT NOT NULL DEFAULT '',
    "scanFile" TEXT NOT NULL DEFAULT '',
    "rawFile" TEXT NOT NULL DEFAULT '',
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "officeType" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "OfficeType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BreedingProject_offices_key" ON "BreedingProject"("offices");

-- CreateIndex
CREATE INDEX "BreedingProject_owner_idx" ON "BreedingProject"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Aviary_falcons_key" ON "Aviary"("falcons");

-- CreateIndex
CREATE UNIQUE INDEX "Aviary_breedingProject_key" ON "Aviary"("breedingProject");

-- CreateIndex
CREATE INDEX "Aviary_owner_idx" ON "Aviary"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Address_breedingProject_key" ON "Address"("breedingProject");

-- CreateIndex
CREATE INDEX "Address_owner_idx" ON "Address"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Falcon_owner_key" ON "Falcon"("owner");

-- CreateIndex
CREATE INDEX "Falcon_species_idx" ON "Falcon"("species");

-- CreateIndex
CREATE INDEX "Falcon_inPair_idx" ON "Falcon"("inPair");

-- CreateIndex
CREATE INDEX "Falcon_parentPair_idx" ON "Falcon"("parentPair");

-- CreateIndex
CREATE INDEX "Pair_male_idx" ON "Pair"("male");

-- CreateIndex
CREATE INDEX "Pair_female_idx" ON "Pair"("female");

-- CreateIndex
CREATE INDEX "Pair_owner_idx" ON "Pair"("owner");

-- CreateIndex
CREATE INDEX "Document_falcon_idx" ON "Document"("falcon");

-- CreateIndex
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");

-- CreateIndex
CREATE INDEX "Document_owner_idx" ON "Document"("owner");

-- CreateIndex
CREATE INDEX "Office_officeType_idx" ON "Office"("officeType");

-- CreateIndex
CREATE INDEX "Office_owner_idx" ON "Office"("owner");

-- AddForeignKey
ALTER TABLE "BreedingProject" ADD CONSTRAINT "BreedingProject_offices_fkey" FOREIGN KEY ("offices") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreedingProject" ADD CONSTRAINT "BreedingProject_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviary" ADD CONSTRAINT "Aviary_falcons_fkey" FOREIGN KEY ("falcons") REFERENCES "Falcon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviary" ADD CONSTRAINT "Aviary_breedingProject_fkey" FOREIGN KEY ("breedingProject") REFERENCES "BreedingProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviary" ADD CONSTRAINT "Aviary_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_breedingProject_fkey" FOREIGN KEY ("breedingProject") REFERENCES "BreedingProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Falcon" ADD CONSTRAINT "Falcon_species_fkey" FOREIGN KEY ("species") REFERENCES "Species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Falcon" ADD CONSTRAINT "Falcon_inPair_fkey" FOREIGN KEY ("inPair") REFERENCES "Pair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Falcon" ADD CONSTRAINT "Falcon_parentPair_fkey" FOREIGN KEY ("parentPair") REFERENCES "Pair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Falcon" ADD CONSTRAINT "Falcon_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_male_fkey" FOREIGN KEY ("male") REFERENCES "Falcon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_female_fkey" FOREIGN KEY ("female") REFERENCES "Falcon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_falcon_fkey" FOREIGN KEY ("falcon") REFERENCES "Falcon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_documentType_fkey" FOREIGN KEY ("documentType") REFERENCES "DocumentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_officeType_fkey" FOREIGN KEY ("officeType") REFERENCES "OfficeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
