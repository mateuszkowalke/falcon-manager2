"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core6 = require("@keystone-6/core");

// models/user.model.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");

// auth/auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_access = require("@keystone-6/core/access");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && true) {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
function isAdmin({ session: session2 }) {
  return session2?.data.isAdmin;
}
function allowAdminAndCurrentUser({
  session: session2,
  list: list6
}) {
  return session2?.data.isAdmin ? true : list6 === "User" ? { id: { equals: session2?.data.id } } : { owner: { id: { equals: session2?.data.id } } };
}
function attachSessionUser({ operation, context, resolvedData }) {
  if (operation === "create") {
    resolvedData = {
      ...resolvedData,
      owner: {
        connect: {
          id: context.session.data.id
        }
      }
    };
  }
  return resolvedData;
}
var defaultAccess = {
  operation: {
    create: ({ session: session2, context, listKey, operation }) => listKey === "User" ? isAdmin({ session: session2, context, listKey, operation }) : (0, import_access.allowAll)(),
    query: import_access.allowAll,
    update: import_access.allowAll,
    delete: import_access.allowAll
  },
  filter: {
    query: allowAdminAndCurrentUser,
    update: allowAdminAndCurrentUser,
    delete: allowAdminAndCurrentUser
  }
};
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "id isAdmin",
  secretField: "password",
  initFirstItem: false ? void 0 : {
    fields: ["firstName", "lastName", "email", "password"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// models/user.model.ts
var User = (0, import_core.list)({
  access: defaultAccess,
  fields: {
    firstName: (0, import_fields.text)({ validation: { isRequired: true } }),
    lastName: (0, import_fields.text)({ validation: { isRequired: true } }),
    email: (0, import_fields.text)({
      access: {
        update: isAdmin
      },
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields.password)({ validation: { isRequired: true } }),
    isAdmin: (0, import_fields.checkbox)({
      access: {
        update: isAdmin
      }
    }),
    falcons: (0, import_fields.relationship)({ ref: "Falcon.owner" }),
    breedingProjects: (0, import_fields.relationship)({
      ref: "BreedingProject.owner",
      many: true
    }),
    addresses: (0, import_fields.relationship)({
      ref: "Address.owner",
      many: true
    }),
    aviaries: (0, import_fields.relationship)({
      ref: "Aviary.owner",
      many: true
    }),
    createdAt: (0, import_fields.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  ui: {
    labelField: "firstName"
  }
});

// models/breeding-project.model.ts
var import_core2 = require("@keystone-6/core");
var import_fields2 = require("@keystone-6/core/fields");
var BreedingProject = (0, import_core2.list)({
  access: defaultAccess,
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    vetRegNo: (0, import_fields2.text)({ validation: { isRequired: true } }),
    address: (0, import_fields2.relationship)({ ref: "Address.breedingProject" }),
    aviaries: (0, import_fields2.relationship)({ ref: "Aviary.breedingProject" }),
    owner: (0, import_fields2.relationship)({
      ref: "User.breedingProjects",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields2.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields2.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  }
});

// models/aviary.model.ts
var import_core3 = require("@keystone-6/core");
var import_fields3 = require("@keystone-6/core/fields");
var Aviary = (0, import_core3.list)({
  access: defaultAccess,
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    capacity: (0, import_fields3.integer)({
      validation: { isRequired: true, min: 0 },
      defaultValue: 0
    }),
    falcons: (0, import_fields3.relationship)({ ref: "Falcon.aviary" }),
    lastCleaned: (0, import_fields3.timestamp)(),
    breedingProject: (0, import_fields3.relationship)({
      ref: "BreedingProject.aviaries",
      many: false
    }),
    owner: (0, import_fields3.relationship)({
      ref: "User.aviaries",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  }
});

// models/address.model.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var Address = (0, import_core4.list)({
  access: defaultAccess,
  fields: {
    street: (0, import_fields4.text)({ validation: { isRequired: true } }),
    no: (0, import_fields4.text)({ validation: { isRequired: true } }),
    zipCode: (0, import_fields4.text)({ validation: { isRequired: true } }),
    city: (0, import_fields4.text)({ validation: { isRequired: true } }),
    country: (0, import_fields4.text)({ validation: { isRequired: true } }),
    breedingProject: (0, import_fields4.relationship)({ ref: "BreedingProject.address" }),
    owner: (0, import_fields4.relationship)({
      ref: "User.addresses",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  },
  ui: {
    labelField: "city"
  }
});

// models/falcon.model.ts
var import_core5 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var Falcon = (0, import_core5.list)({
  access: defaultAccess,
  fields: {
    name: (0, import_fields5.text)({ validation: { isRequired: true } }),
    ring: (0, import_fields5.text)({ validation: { isRequired: true } }),
    sex: (0, import_fields5.select)({
      type: "enum",
      options: [
        { label: "unknown", value: "UNKNOWN" /* Unknown */ },
        { label: "male", value: "MALE" /* Male */ },
        { label: "female", value: "FEMALE" /* Female */ }
      ],
      defaultValue: "UNKNOWN" /* Unknown */
    }),
    birthDate: (0, import_fields5.timestamp)(),
    source: (0, import_fields5.text)({ validation: { isRequired: true } }),
    widthYoung: (0, import_fields5.integer)(),
    lengthYoung: (0, import_fields5.integer)(),
    weightYoung: (0, import_fields5.integer)(),
    widthOld: (0, import_fields5.integer)(),
    lengthOld: (0, import_fields5.integer)(),
    weightOld: (0, import_fields5.integer)(),
    notes: (0, import_fields5.text)({ validation: { isRequired: true } }),
    aviary: (0, import_fields5.relationship)({
      ref: "Aviary.falcons",
      many: false
    }),
    owner: (0, import_fields5.relationship)({
      ref: "User.falcons",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields5.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields5.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  }
});

// schema.ts
var lists = {
  User,
  BreedingProject,
  Aviary,
  Address,
  Falcon
};

// keystone.ts
var keystone_default = withAuth(
  (0, import_core6.config)({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL || "postgresql://testuser:testpass@localhost:5432/falcon_manager"
    },
    lists,
    session
  })
);
