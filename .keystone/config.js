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
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");

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
  list: list2
}) {
  return session2?.data.isAdmin ? true : list2 === "User" ? { id: { equals: session2?.data.id } } : { owner: { id: { equals: session2?.data.id } } };
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

// schema.ts
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
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
  }),
  BreedingProject: (0, import_core.list)({
    access: defaultAccess,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      vetRegNo: (0, import_fields.text)({ validation: { isRequired: true } }),
      address: (0, import_fields.relationship)({ ref: "Address.breedingProject" }),
      aviaries: (0, import_fields.relationship)({ ref: "Aviary.breedingProject" }),
      owner: (0, import_fields.relationship)({
        ref: "User.breedingProjects",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    hooks: {
      resolveInput: attachSessionUser
    }
  }),
  Aviary: (0, import_core.list)({
    access: defaultAccess,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      capacity: (0, import_fields.integer)({ validation: { isRequired: true } }),
      lastCleaned: (0, import_fields.timestamp)(),
      breedingProject: (0, import_fields.relationship)({
        ref: "BreedingProject.aviaries",
        many: false
      }),
      owner: (0, import_fields.relationship)({
        ref: "User.aviaries",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    hooks: {
      resolveInput: attachSessionUser
    }
  }),
  Address: (0, import_core.list)({
    access: defaultAccess,
    fields: {
      street: (0, import_fields.text)({ validation: { isRequired: true } }),
      no: (0, import_fields.text)({ validation: { isRequired: true } }),
      zipCode: (0, import_fields.text)({ validation: { isRequired: true } }),
      city: (0, import_fields.text)({ validation: { isRequired: true } }),
      country: (0, import_fields.text)({ validation: { isRequired: true } }),
      breedingProject: (0, import_fields.relationship)({ ref: "BreedingProject.address" }),
      owner: (0, import_fields.relationship)({
        ref: "User.addresses",
        ui: { hideCreate: true },
        many: false
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    hooks: {
      resolveInput: attachSessionUser
    },
    ui: {
      labelField: "city"
    }
  })
};

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL || "postgresql://testuser:testpass@localhost:5432/falcon_manager"
    },
    lists,
    session
  })
);
