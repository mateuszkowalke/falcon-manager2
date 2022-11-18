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

describe("Address", () => {
  describe("Creating address", () => {
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

    it("Should create address with owner set to session user id", async () => {
      const addressData = {
        street: "testStreet",
        no: "0",
        zipCode: "00-000",
        city: "testCity",
        country: "testCountry",
      };

      const address = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.Address.createOne({
          data: {
            ...addressData,
          },
        });

      const addressFinal = await prisma.address.findUnique({
        where: { id: address.id },
      });

      // need to check in db as afterOperation hook doesn't change returned data
      expect(addressFinal.ownerId).toBe(noAdmin.id);
    });
  });
});
