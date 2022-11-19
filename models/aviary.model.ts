import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  integer,
} from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const Aviary = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
    capacity: integer({
      validation: { isRequired: true, min: 0 },
      defaultValue: 0,
    }),
    lastCleaned: timestamp(),
    breedingProject: relationship({
      ref: "BreedingProject.aviaries",
      many: false,
    }),
    owner: relationship({
      ref: "User.aviaries",
      ui: { hideCreate: true },
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
