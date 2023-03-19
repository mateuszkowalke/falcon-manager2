import { list } from "@keystone-6/core";
import { text, relationship, timestamp } from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const BreedingProject = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
    vetRegNo: text({ validation: { isRequired: true } }),
    address: relationship({ ref: "Address.breedingProject" }),
    aviaries: relationship({ ref: "Aviary.breedingProject", many: true }),
    offices: relationship({ ref: "Office.breedingProject", many: true }),
    owner: relationship({
      ref: "User.breedingProjects",
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
});
