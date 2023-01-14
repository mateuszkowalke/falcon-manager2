import { config } from "@keystone-6/core";

import { lists } from "./schema";

import { withAuth, session } from "./auth/auth";

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url:
        process.env.DATABASE_URL ||
        "postgresql://testuser:testpass@localhost:5432/falcon_manager",
      useMigrations: true
    },
    lists,
    session,
  })
);
