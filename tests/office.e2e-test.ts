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
const prisma: PrismaModule.PrismaClient = context.prisma;

describe("Office", () => {
  describe("Creating office", () => {
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

    it("Should create office with owner set to session user id", async () => {
      const officeTypeData = {
        name: "office type name",
      };

      const officeType = await prisma.officeType.create({
        data: {
          ...officeTypeData,
        },
      });

      const officeData = {
        officeType: {
          connect: { id: officeType.id},
        },
        name: "test office name",
      };

      const office = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Office.createOne({
          data: {
            ...officeData,
          },
        });

      const officeFinal = await prisma.office.findUnique({
        where: { id: office.id },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(officeFinal?.ownerId).toBe(noAdmin.id);
    });

    it("Should create office with nested breeding project", async () => {
      const breedingProjectData = {
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
      };

      const officeTypeData = {
        name: "office type name",
      };

      const officeType = await prisma.officeType.create({
        data: {
          ...officeTypeData,
        },
      });

      const officeData = {
        officeType: {
          connect: { id: officeType.id},
        },
        name: "test office name",
        breedingProject: {
          create: { ...breedingProjectData },
        },
      };
      const office = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Office.createOne({
          data: {
            ...officeData,
          },
        });

      const officeFinal = await prisma.office.findUnique({
        where: { id: office.id },
        include: { breedingProject: true },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(officeFinal?.ownerId).toBe(noAdmin.id);
      expect(officeFinal?.breedingProject?.name).toBe(breedingProjectData.name);
    });
  });
});
