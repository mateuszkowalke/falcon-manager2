import { list } from "@keystone-6/core";
import { isAdmin, defaultAccess, attachSessionUser } from "./auth/auth";

import {
  text,
  relationship,
  password,
  timestamp,
  checkbox,
  integer,
} from "@keystone-6/core/fields";

import type { Lists } from ".keystone/types";

export const lists: Lists = {
  User: list({
    access: defaultAccess,

    fields: {
      firstName: text({ validation: { isRequired: true } }),
      lastName: text({ validation: { isRequired: true } }),
      email: text({
        access: {
          update: isAdmin,
        },
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({ validation: { isRequired: true } }),
      isAdmin: checkbox({
        access: {
          update: isAdmin,
        },
      }),
      breedingProjects: relationship({
        ref: "BreedingProject.owner",
        many: true,
      }),
      addresses: relationship({
        ref: "Address.owner",
        many: true,
      }),
      aviaries: relationship({
        ref: "Aviary.owner",
        many: true,
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },

    ui: {
      labelField: "firstName",
    },
  }),

  BreedingProject: list({
    access: defaultAccess,

    fields: {
      name: text({ validation: { isRequired: true } }),
      vetRegNo: text({ validation: { isRequired: true } }),
      address: relationship({ ref: "Address.breedingProject" }),
      aviaries: relationship({ ref: "Aviary.breedingProject" }),
      owner: relationship({
        ref: "User.breedingProjects",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },

    hooks: {
      resolveInput: attachSessionUser,
    },
  }),

  Aviary: list({
    access: defaultAccess,

    fields: {
      name: text({ validation: { isRequired: true } }),
      capacity: integer({ validation: { isRequired: true, min: 0 }, defaultValue: 0 }),
      lastCleaned: timestamp(),
      breedingProject: relationship({
        ref: "BreedingProject.aviaries",
        many: false,
      }),
      owner: relationship({
        ref: "User.aviaries",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },

    hooks: {
      resolveInput: attachSessionUser,
    },
  }),

  Address: list({
    access: defaultAccess,

    fields: {
      street: text({ validation: { isRequired: true } }),
      no: text({ validation: { isRequired: true } }),
      zipCode: text({ validation: { isRequired: true } }),
      city: text({ validation: { isRequired: true } }),
      country: text({ validation: { isRequired: true } }),
      breedingProject: relationship({ ref: "BreedingProject.address" }),
      owner: relationship({
        ref: "User.addresses",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },

    hooks: {
      resolveInput: attachSessionUser,
    },

    ui: {
      labelField: "city",
    },
  }),
};
