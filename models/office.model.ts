import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  integer,
} from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const OfficeType = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
  },
});

export const Office = list({
  access: defaultAccess,

  fields: {
    officeType: relationship({ ref: "OfficeType" }),
    name: text(),
    breedingProject: relationship({
      ref: "BreedingProject.offices",
      many: false,
    }),
    owner: relationship({
      ref: "User.offices",
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
