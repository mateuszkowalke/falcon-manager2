import { config } from "@keystone-6/core";

import { lists } from "./schema";

import { withAuth, session } from "./auth/auth";
import { getStorageConfig } from "./storage";
import { envSchema } from "./env.schema";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://testuser:testpass@localhost:5432/falcon_manager";
}

if (!process.env.ASSET_BASE_URL) {
  process.env.ASSET_BASE_URL = "http://localhost:3000";
}

const parsedEnv = envSchema.parse(process.env);

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: parsedEnv.DATABASE_URL,
      useMigrations: true,
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.set("trust proxy", true);
      },
    },
    lists,
    session,
    storage: getStorageConfig(parsedEnv),
  })
);
