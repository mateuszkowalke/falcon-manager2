import { list } from "@keystone-6/core";
import {
    text,
    relationship,
    timestamp,
} from "@keystone-6/core/fields";

import { defaultAccess, attachSessionUser } from "../auth/auth";

export const Pair = list({
    access: defaultAccess,

    fields: {
        name: text({ validation: { isRequired: true } }),
        notes: text(),
        male: relationship({
            ref: "Falcon",
            many: false
        }),
        female: relationship({
            ref: "Falcon",
            many: false
        }),
        children: relationship({
            ref: "Falcon.parentPair",
            many: true,
        }),
        owner: relationship({
            ref: "User.pairs",
            ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
            many: false,
        }),
        putTogether: timestamp({
            defaultValue: { kind: "now" },
        }),
        split: timestamp(),
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
