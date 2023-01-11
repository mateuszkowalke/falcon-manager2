import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  integer,
} from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const DocumentType = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
  },
});

export const Document = list({
  access: defaultAccess,

  fields: {
    falcon: relationship({ ref: "Falcon" }),
    documentType: relationship({ ref: "DocumentType" }),
    documentNumber: text(),
    scanFile: text(),
    rawFile: text(),
    owner: relationship({
      ref: "User.documents",
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
