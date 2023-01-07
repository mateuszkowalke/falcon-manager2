import { list } from "@keystone-6/core";
import { text, relationship, timestamp } from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const Address = list({
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
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false,
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
});
