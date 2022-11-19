import path from "path";

import * as PrismaModule from ".prisma/client";
import { getContext } from "@keystone-6/core/context";
import { resetDatabase } from "@keystone-6/core/testing";
import { Client } from "pg";

import baseConfig from "../keystone";

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
      await client.query(`DROP SCHEMA ${client.escapeIdentifier(schema)} CASCADE`);
    } catch (err) {
      console.error(`Error removing test schema:\n${err}`);
    }
    await client.end();
  }
});

const context = getContext(config, PrismaModule);
const prisma = context.prisma;

describe("User", () => {
  describe("Creating user", () => {
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

    it("Should allow admin to create a new user", async () => {
      const newUserData = {
        firstName: "created",
        lastName: "in",
        email: "test@falcon-manager.com",
        password: "secret1234",
        isAdmin: false,
      };
      const newUser = await context
        .withSession({ data: { id: admin.id, isAdmin: admin.isAdmin } })
        .query.User.createOne({
          data: {
            ...newUserData,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(newUser.firstName).toBe(newUserData.firstName);
      expect(newUser.lastName).toBe(newUserData.lastName);
      expect(newUser.email).toBe(newUserData.email);
      expect(newUser.isAdmin).toBe(newUserData.isAdmin);
      expect(newUser.password.isSet).toBe(true);
    });

    it("Should prevent a regular user from creating a new user", async () => {
      const newUserData = {
        firstName: "created",
        lastName: "in",
        email: "test@falcon-manager.com",
        password: "secret1234",
        isAdmin: false,
      };
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `mutation createUser($user: UserCreateInput!) {
                    createUser(data: $user) {
                      id
                    }
                  }`,
          variables: { user: newUserData },
        });
      expect((data as { createUser: unknown }).createUser).toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
      // additionally check if user hasn't been created in db
      const newUserInDB = await prisma.user.findUnique({
        where: {
          email: newUserData.email,
        },
      });
      expect(newUserInDB).toBeNull();
    });
  });

  describe("Viewing users", () => {
    let admin: any;
    let noAdmin: any;
    beforeEach(async () => {
      await resetDatabase(dbUrl, prismaSchemaPath);
      admin = await prisma.user.create({
        data: {
          firstName: "admin",
          lastName: "test",
          email: "admin@falcon-manager.com",
          password: "secret1324",
          isAdmin: true,
        },
      });

      noAdmin = await prisma.user.create({
        data: {
          firstName: "noAdmin",
          lastName: "test",
          email: "noAdmin@falcon-manager.com",
          password: "secret1324",
          isAdmin: false,
        },
      });
    });

    it("Should allow user to view it's data", async () => {
      const noAdminUserData = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.User.findOne({
          where: {
            id: noAdmin.id,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData.id).toBe(noAdmin.id);
      expect(noAdminUserData.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData.email).toBe(noAdmin.email);
      expect(noAdminUserData.isAdmin).toBe(noAdmin.isAdmin);
    });

    it("Should prevent user from viewing other user's data", async () => {
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `query user($input: UserWhereUniqueInput!) {
                    user(where: $input) {
                      id
                    }
                  }`,
          variables: { input: { id: admin.id } },
        });
      // there are no errors, just empty dataset for query operation
      // even when querying for specific user
      expect((data as { user: unknown }).user).toBeNull();
      expect(errors).toBeUndefined();
    });

    it("Should allow admin to view all users' data", async () => {
      const noAdminUserData = await context
        .withSession({ data: { id: admin.id, isAdmin: admin.isAdmin } })
        .query.User.findOne({
          where: {
            id: noAdmin.id,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData.id).toBe(noAdmin.id);
      expect(noAdminUserData.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData.email).toBe(noAdmin.email);
      expect(noAdminUserData.isAdmin).toBe(noAdmin.isAdmin);
    });
  });

  describe("Updading users", () => {
    let admin: any;
    let noAdmin: any;
    beforeEach(async () => {
      await resetDatabase(dbUrl, prismaSchemaPath);
      admin = await prisma.user.create({
        data: {
          firstName: "admin",
          lastName: "test",
          email: "admin@falcon-manager.com",
          password: "secret1324",
          isAdmin: true,
        },
      });

      noAdmin = await prisma.user.create({
        data: {
          firstName: "noAdmin",
          lastName: "test",
          email: "noAdmin@falcon-manager.com",
          password: "secret1324",
          isAdmin: false,
        },
      });
    });

    it("Should allow user to update it's data", async () => {
      noAdmin.firstName = "newFirstName";
      const noAdminUserData = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.User.updateOne({
          where: {
            id: noAdmin.id,
          },
          data: {
            firstName: noAdmin.firstName,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData.id).toBe(noAdmin.id);
      expect(noAdminUserData.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData.email).toBe(noAdmin.email);
      expect(noAdminUserData.isAdmin).toBe(noAdmin.isAdmin);
    });

    it("Should prevent user from updating it's email", async () => {
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `mutation updateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
                    updateUser(where: $where, data: $data) {
                      id
                      email
                    }
                  }`,
          variables: {
            where: { id: noAdmin.id },
            data: { email: "newEmail@smthng.com" },
          },
        });
      expect((data as { updateUser: unknown }).updateUser).toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
    });

    it("Should prevent regular user from giving itself a admin status", async () => {
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `mutation updateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
                    updateUser(where: $where, data: $data) {
                      id
                      isAdmin
                    }
                  }`,
          variables: {
            where: { id: noAdmin.id },
            data: { isAdmin: true },
          },
        });
      expect((data as { updateUser: unknown }).updateUser).toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
    });

    it("Should allow admin to change other users' admin status", async () => {
      noAdmin.isAdmin = true;
      const noAdminUserData = await context
        .withSession({ data: { id: admin.id, isAdmin: admin.isAdmin } })
        .query.User.updateOne({
          where: {
            id: noAdmin.id,
          },
          data: {
            isAdmin: noAdmin.isAdmin,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData.id).toBe(noAdmin.id);
      expect(noAdminUserData.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData.email).toBe(noAdmin.email);
      expect(noAdminUserData.isAdmin).toBe(noAdmin.isAdmin);
    });

    it("Should prevent user from updating other user's data", async () => {
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `mutation updateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
                    updateUser(where: $where, data: $data) {
                      id
                      firstName
                    }
                  }`,
          variables: {
            where: { id: admin.id },
            data: { firstName: "newName" },
          },
        });
      expect((data as { updateUser: unknown }).updateUser).toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
    });
  });

  describe("Deleting users", () => {
    let admin: any;
    let noAdmin: any;
    beforeEach(async () => {
      await resetDatabase(dbUrl, prismaSchemaPath);
      admin = await prisma.user.create({
        data: {
          firstName: "admin",
          lastName: "test",
          email: "admin@falcon-manager.com",
          password: "secret1324",
          isAdmin: true,
        },
      });

      noAdmin = await prisma.user.create({
        data: {
          firstName: "noAdmin",
          lastName: "test",
          email: "noAdmin@falcon-manager.com",
          password: "secret1324",
          isAdmin: false,
        },
      });
    });

    it("Should allow user to delete it's account", async () => {
      const noAdminUserData = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .query.User.deleteOne({
          where: {
            id: noAdmin.id,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData?.id).toBe(noAdmin.id);
      expect(noAdminUserData?.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData?.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData?.email).toBe(noAdmin.email);
      expect(noAdminUserData?.isAdmin).toBe(noAdmin.isAdmin);

      // additionally check if user has been deleted in DB
      const deletedUserInDB = await prisma.user.findUnique({
        where: {
          email: noAdmin.email,
        },
      });
      expect(deletedUserInDB).toBeNull();
    });

    it("Should prevent user from deleting other user's account", async () => {
      const { data, errors } = await context
        .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
        .graphql.raw({
          query: `mutation deleteUser($where: UserWhereUniqueInput!) {
                    deleteUser(where: $where) {
                      id
                    }
                  }`,
          variables: { where: { id: admin.id } },
        });
      expect((data as { deleteUser: unknown }).deleteUser).toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
    });

    it("Should allow admin to delete any account", async () => {
      const noAdminUserData = await context
        .withSession({ data: { id: admin.id, isAdmin: admin.isAdmin } })
        .query.User.deleteOne({
          where: {
            id: noAdmin.id,
          },
          query: "id firstName lastName email isAdmin password { isSet }",
        });
      expect(noAdminUserData?.id).toBe(noAdmin.id);
      expect(noAdminUserData?.firstName).toBe(noAdmin.firstName);
      expect(noAdminUserData?.lastName).toBe(noAdmin.lastName);
      expect(noAdminUserData?.email).toBe(noAdmin.email);
      expect(noAdminUserData?.isAdmin).toBe(noAdmin.isAdmin);
    });
  });
});
