import * as PrismaModule from ".prisma/client";
import { getContext } from "@keystone-6/core/context";
import { resetDatabase } from "@keystone-6/core/testing";
import path from "path";
import baseConfig from "../keystone";

const dbUrl = `postgresql://testuser:testpass@localhost:5432/falcon_manager?schema=${process.env.JEST_WORKER_ID}`;
const prismaSchemaPath = path.join(__dirname, "..", "schema.prisma");
const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

beforeEach(async () => {
  await resetDatabase(dbUrl, prismaSchemaPath);
});

const context = getContext(config, PrismaModule);
const prisma = context.prisma;

describe("Aviary", () => {
  describe("Creating aviary", () => {
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

    it("Should create aviary and nested breeding project and address with owner set to session user id", async () => {
      const aviaryData = {
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
      };

      const aviary = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Aviary.createOne({
          data: {
            ...aviaryData,
          },
        });

      const aviaryFinal = await prisma.aviary.findUnique({
        where: { id: aviary.id },
        include: {
          breedingProject: {
            include: {
              address: true,
            },
          },
        },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(aviaryFinal.ownerId).toBe(noAdmin.id);
      expect(aviaryFinal.breedingProject.ownerId).toBe(noAdmin.id);
      expect(aviaryFinal.breedingProject.address.ownerId).toBe(noAdmin.id);
    });

    it("Should not allow to create aviary with capacity less than 0", async () => {
      const aviaryData = {
        name: "testAviary",
        capacity: -4,
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
      };

      try {
        await context
          .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
          .query.Aviary.createOne({
            data: {
              ...aviaryData,
            },
          });
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });
});
