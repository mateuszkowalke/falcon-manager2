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

describe("Pair", () => {
    describe("Creating pair", () => {
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

        it("Should create pair and nested falcon entities with owner set to session user id", async () => {
            const fatherData = {
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

            const motherData = {
                name: "mother",
                ring: "1234",
                sex: Sex.Female,
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

            const childData = {
                name: "child",
                ring: "1234",
                sex: Sex.Unknown,
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

            const pairData = {
                name: "pairName",
                notes: "someTestNotes",
                male: {
                    create: { ...fatherData }
                },
                female: {
                    create: { ...motherData }
                },
                children: { create: [{ ...childData }] },
                putTogether: new Date()
            }

            const pair = await context
                .withSession({ data: { id: noAdmin.id, isAdmin: noAdmin.isAdmin } })
                .query.Pair.createOne({
                    data: {
                        ...pairData
                    },
                });

            const pairFinal = await prisma.pair.findUnique({
                where: { id: pair.id },
                include: {
                    male: true,
                    female: true,
                    children: true
                },
            });

            // need to check in db as afterOperation hook doesn't change returned data
            expect(pairFinal.ownerId).toBe(noAdmin.id);
            expect(pairFinal.male.name).toBe(fatherData.name);
            expect(pairFinal.female.name).toBe(motherData.name);
            expect(pairFinal.children[0].name).toBe(childData.name);
        });
    });
});
