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
var import_core10 = require("@keystone-6/core");

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
  list: list10
}) {
  return session2?.data.isAdmin ? true : list10 === "User" ? { id: { equals: session2?.data.id } } : { owner: { id: { equals: session2?.data.id } } };
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
var sharedResourceAccess = {
  operation: {
    create: isAdmin,
    query: import_access.allowAll,
    update: isAdmin,
    delete: isAdmin
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
    pairs: (0, import_fields.relationship)({
      ref: "Pair.owner",
      many: true
    }),
    documents: (0, import_fields.relationship)({
      ref: "Document.owner",
      many: true
    }),
    offices: (0, import_fields.relationship)({
      ref: "Office.owner",
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
    offices: (0, import_fields2.relationship)({ ref: "Office.breedingProject" }),
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
    office: (0, import_fields4.relationship)({
      ref: "Office.address",
      many: false
    }),
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
    species: (0, import_fields5.relationship)({ ref: "Species", many: false }),
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
    inPair: (0, import_fields5.relationship)({
      ref: "Pair",
      many: false
    }),
    parentPair: (0, import_fields5.relationship)({
      ref: "Pair.children"
    }),
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

// models/pair.model.ts
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var Pair = (0, import_core6.list)({
  access: defaultAccess,
  fields: {
    name: (0, import_fields6.text)({ validation: { isRequired: true } }),
    notes: (0, import_fields6.text)(),
    male: (0, import_fields6.relationship)({
      ref: "Falcon",
      many: false
    }),
    female: (0, import_fields6.relationship)({
      ref: "Falcon",
      many: false
    }),
    children: (0, import_fields6.relationship)({
      ref: "Falcon.parentPair",
      many: true
    }),
    owner: (0, import_fields6.relationship)({
      ref: "User.pairs",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    putTogether: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    }),
    split: (0, import_fields6.timestamp)(),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  }
});

// models/species.model.ts
var import_core7 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var Species = (0, import_core7.list)({
  access: sharedResourceAccess,
  fields: {
    name: (0, import_fields7.text)({ validation: { isRequired: true } }),
    latin: (0, import_fields7.text)({ validation: { isRequired: true } })
  },
  graphql: {
    plural: "FalconSpecies"
  }
});

// models/document.model.ts
var import_core8 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var DocumentType = (0, import_core8.list)({
  access: sharedResourceAccess,
  fields: {
    name: (0, import_fields8.text)({ validation: { isRequired: true } })
  }
});
var Document = (0, import_core8.list)({
  access: defaultAccess,
  fields: {
    falcon: (0, import_fields8.relationship)({ ref: "Falcon" }),
    documentType: (0, import_fields8.relationship)({ ref: "DocumentType" }),
    documentNumber: (0, import_fields8.text)(),
    scanFile: (0, import_fields8.file)({ storage: "documentsStorage" }),
    rawFile: (0, import_fields8.file)({ storage: "documentsStorage" }),
    owner: (0, import_fields8.relationship)({
      ref: "User.documents",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    resolveInput: attachSessionUser
  }
});

// models/office.model.ts
var import_core9 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var OfficeType = (0, import_core9.list)({
  access: sharedResourceAccess,
  fields: {
    name: (0, import_fields9.text)({ validation: { isRequired: true } })
  }
});
var Office = (0, import_core9.list)({
  access: defaultAccess,
  fields: {
    officeType: (0, import_fields9.relationship)({ ref: "OfficeType" }),
    name: (0, import_fields9.text)({ validation: { isRequired: true } }),
    accountNo: (0, import_fields9.text)(),
    notes: (0, import_fields9.text)(),
    breedingProject: (0, import_fields9.relationship)({
      ref: "BreedingProject.offices",
      many: false
    }),
    address: (0, import_fields9.relationship)({
      ref: "Address.office",
      many: false
    }),
    owner: (0, import_fields9.relationship)({
      ref: "User.offices",
      ui: { hideCreate: true, createView: { fieldMode: "hidden" } },
      many: false
    }),
    createdAt: (0, import_fields9.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields9.timestamp)({
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
  Falcon,
  Pair,
  Species,
  Document,
  DocumentType,
  Office,
  OfficeType
};

// storage.ts
function getStorageConfig(env) {
  if (env.NODE_ENV === "development") {
    return getLocalStorageConfig(env);
  }
  return getS3StorageConfig(env);
}
function getLocalStorageConfig(env) {
  const localDocumentsStorage = {
    kind: "local",
    type: "file",
    storagePath: "public/documents",
    serverRoute: {
      path: "documents"
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/documents${path}`
  };
  const localImagesStorage = {
    kind: "local",
    type: "image",
    storagePath: "public/images",
    serverRoute: {
      path: "images"
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/images${path}`
  };
  return {
    documentsStorage: {
      ...localDocumentsStorage
    },
    imagesStorage: {
      ...localImagesStorage
    }
  };
}
function getS3StorageConfig(env) {
  const localDocumentsStorage = {
    kind: "local",
    type: "file",
    storagePath: "public/documents",
    serverRoute: {
      path: "documents"
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/documents${path}`
  };
  const localImagesStorage = {
    kind: "local",
    type: "image",
    storagePath: "public/images",
    serverRoute: {
      path: "images"
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/images${path}`
  };
  return {
    documentsStorage: {
      ...localDocumentsStorage
    },
    imagesStorage: {
      ...localImagesStorage
    }
  };
}

// env.schema.ts
var import_zod = require("zod");
var prodEnv = import_zod.z.object({
  NODE_ENV: import_zod.z.literal("production"),
  DATABASE_URL: import_zod.z.string().min(1),
  ASSET_BASE_URL: import_zod.z.string().min(1)
});
var devEnv = import_zod.z.object({
  NODE_ENV: import_zod.z.literal("development"),
  DATABASE_URL: import_zod.z.string().min(1),
  ASSET_BASE_URL: import_zod.z.string().min(1)
});
var envSchema = import_zod.z.union([prodEnv, devEnv]);

// keystone.ts
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://testuser:testpass@localhost:5432/falcon_manager";
}
if (!process.env.ASSET_BASE_URL) {
  process.env.ASSET_BASE_URL = "http://localhost:3000";
}
var parsedEnv = envSchema.parse(process.env);
var keystone_default = withAuth(
  (0, import_core10.config)({
    db: {
      provider: "postgresql",
      url: parsedEnv.DATABASE_URL,
      useMigrations: true
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.set("trust proxy", true);
      }
    },
    lists,
    session,
    storage: getStorageConfig(parsedEnv)
  })
);
