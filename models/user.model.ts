import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  password,
  timestamp,
  checkbox,
} from "@keystone-6/core/fields";

import { isAdmin, defaultAccess } from "../auth/auth";

export const User = list({
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
    falcons: relationship({ ref: "Falcon.owner" }),
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
    pairs: relationship({
      ref: "Pair.owner",
      many: true,
    }),
    documents: relationship({
      ref: "Document.owner",
      many: true,
    }),
    offices: relationship({
      ref: "Office.owner",
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
});
