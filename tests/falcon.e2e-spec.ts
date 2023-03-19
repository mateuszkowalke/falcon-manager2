import path from "path";

import * as PrismaModule from ".prisma/client";
import { getContext } from "@keystone-6/core/context";
import { resetDatabase } from "@keystone-6/core/testing";
import { Client } from "pg";

import baseConfig from "../keystone";
import { Sex } from "../models/falcon.model";

const schema = process.env.JEST_WORKER_ID;
const dbUrl = `postgresql://testuser:testpass@localhost:5432/falcon_manager?schema=${schema}`;
const prismaSchemaPath = path.join(__dirname, "..", "schema.prisma");
const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

beforeEach(async () => {
  await resetDatabase(dbUrl, prismaSchemaPath);
});

afterAll(async () => {
  if (schema) {
    const client = new Client({
      connectionString: dbUrl,
    });
    await client.connect();
    try {
      await client.query(
        `DROP SCHEMA ${client.escapeIdentifier(schema)} CASCADE`
      );
    } catch (err) {
      console.error(`Error removing test schema:\n${err}`);
    }
    await client.end();
  }
});

const context = getContext(config, PrismaModule);
const prisma = context.prisma;

describe("Falcon", () => {
  describe("Creating falcon", () => {
    let admin: any;
    let noAdmin: any;
    beforeEach(async () => {
      await resetDatabase(dbUrl, prismaSchemaPath);
      admin = await prisma.user.create({
        data: {
          firstName: "admin",
          lastName: "test",
          email: "admin@falcon-manager.com",
          password: "secret1234",
          isAdmin: true,
        },
      });

      noAdmin = await prisma.user.create({
        data: {
          firstName: "noAdmin",
          lastName: "test",
          email: "noAdmin@falcon-manager.com",
          password: "secret1234",
          isAdmin: false,
        },
      });
    });

    it("Should create falcon and nested breeding project and address with owner set to session user id", async () => {
      const falconData = {
        name: "testFalconName",
        ring: "1234",
        sex: Sex.Unknown,
        birthDate: new Date(),
        accquiredDate: new Date(),
        source: "testFalocnSource",
        aviary: {
          create: {
            name: "testAviary",
            capacity: 4,
            lastCleaned: new Date(),
            breedingProject: {
              create: {
                name: "testBreedingProjectName",
                vetRegNo: "1234",
                address: {
                  create: {
                    street: "testStreet",
                    no: "0",
                    zipCode: "00-000",
                    city: "testCity",
                    country: "testCountry",
                  },
                },
              },
            },
          },
        },
        widthYoung: 14,
        lengthYoung: 14,
        weightYoung: 800,
        widthOld: 14,
        lengthOld: 14,
        weightOld: 800,
        notes: "someTestNotes",
      };

      const falcon = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Falcon.createOne({
          data: {
            ...falconData,
          },
        });

      const falconFinal = await prisma.falcon.findUnique({
        where: { id: falcon.id },
        include: {
          aviary: {
            include: {
              breedingProject: {
                include: {
                  address: true,
                },
              },
            },
          },
        },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(falconFinal.ownerId).toBe(noAdmin.id);
      expect(falconFinal.aviary.ownerId).toBe(noAdmin.id);
      expect(falconFinal.aviary.breedingProject.ownerId).toBe(noAdmin.id);
      expect(falconFinal.aviary.breedingProject.address.ownerId).toBe(
        noAdmin.id
      );
    });
  });
});
