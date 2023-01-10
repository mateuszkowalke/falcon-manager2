import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  select,
  integer,
} from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export enum Sex {
  Unknown = "UNKNOWN",
  Male = "MALE",
  Female = "FEMALE",
}

export const Falcon = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
    ring: text({ validation: { isRequired: true } }),
    sex: select({
      type: "enum",
      options: [
        { label: "unknown", value: Sex.Unknown },
        { label: "male", value: Sex.Male },
        { label: "female", value: Sex.Female },
      ],
      defaultValue: Sex.Unknown,
    }),
    birthDate: timestamp(),
    source: text({ validation: { isRequired: true } }),
    widthYoung: integer(),
    lengthYoung: integer(),
    weightYoung: integer(),
    widthOld: integer(),
    lengthOld: integer(),
    weightOld: integer(),
    notes: text({ validation: { isRequired: true } }),
    inPair: relationship({
        ref: "Pair",
        many: false
    }),
    parentPair: relationship({
        ref: "Pair.children"
    }),
    aviary: relationship({
      ref: "Aviary.falcons",
      many: false,
    }),
    owner: relationship({
      ref: "User.falcons",
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
