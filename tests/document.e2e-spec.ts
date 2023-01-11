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

describe("Document", () => {
  describe("Creating document", () => {
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

    it("Should create document with owner set to session user id", async () => {
      const documentTypeData = {
        name: "document type name",
      };

      const documentData = {
        documentType: {
          create: { ...documentTypeData },
        },
        scanFile: "scan file url",
        rawFile: "raw file url",
      };
      const document = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Document.createOne({
          data: {
            ...documentData,
          },
        });

      const documentFinal = await prisma.document.findUnique({
        where: { id: document.id },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(documentFinal.ownerId).toBe(noAdmin.id);
    });

    it("Should create document assigned to falcon", async () => {
      const falconData = {
        name: "father",
        ring: "1234",
        sex: Sex.Male,
        birthDate: new Date(),
        source: "testFalocnSource",
        widthYoung: 14,
        lengthYoung: 14,
        weightYoung: 800,
        widthOld: 14,
        lengthOld: 14,
        weightOld: 800,
        notes: "someTestNotes",
      };

      const documentTypeData = {
        name: "document type name",
      };

      const documentData = {
        falcon: {
          create: { ...falconData },
        },
        documentType: {
          create: { ...documentTypeData },
        },
        scanFile: "scan file url",
        rawFile: "raw file url",
      };
      const document = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Document.createOne({
          data: {
            ...documentData,
          },
        });

      const documentFinal = await prisma.document.findUnique({
        where: { id: document.id },
        include: { falcon: true },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(documentFinal.ownerId).toBe(noAdmin.id);
      expect(documentFinal.falcon.name).toBe(falconData.name);
    });
  });
});
