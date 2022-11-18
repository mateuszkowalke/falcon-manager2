import { randomBytes } from "crypto";
import { createAuth } from "@keystone-6/auth";
import { allowAll } from "@keystone-6/core/access";
import { statelessSessions } from "@keystone-6/core/session";
import { KeystoneContext } from "@keystone-6/core/types";

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = randomBytes(32).toString("hex");
}

export type Session = {
  data: {
    id: string;
    isAdmin: boolean;
  };
};

export type AccessArgs = {
  session: Session;
  context: KeystoneContext;
  listKey: string;
  operation: any;
};

export function isAdmin({ session }: AccessArgs) {
  return session?.data.isAdmin;
}

export function allowAdminAndCurrentUser({
  session,
  list,
}: {
  session: Session;
  list: string;
}) {
  return session?.data.isAdmin
    ? true
    : list === "User"
    ? { id: { equals: session?.data.id } }
    : { owner: { id: { equals: session?.data.id } } };
}

// this function is supposed to be used in resolveInput list hook
// parameter type is left as 'any' as it is very complicated and upractical to define
export function attachSessionUser({ operation, context, resolvedData }: any) {
  if (operation === "create") {
    resolvedData = {
      ...resolvedData,
      owner: {
        connect: {
          id: context.session.data.id,
        },
      },
    };
  }
  return resolvedData;
}

// dafault access is tested in users e2e test suite, so no need to retest lists
// using the same pattern
export const defaultAccess = {
  operation: {
    create: ({ session, context, listKey, operation }: AccessArgs) =>
      listKey === "User"
        ? isAdmin({ session, context, listKey, operation })
        : allowAll(),
    query: allowAll,
    update: allowAll,
    delete: allowAll,
  },
  filter: {
    query: allowAdminAndCurrentUser,
    update: allowAdminAndCurrentUser,
    delete: allowAdminAndCurrentUser,
  },
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: "id isAdmin",
  secretField: "password",
  initFirstItem:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          fields: ["firstName", "lastName", "email", "password"],
        },
});

const sessionMaxAge = 60 * 60 * 24 * 30;

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { withAuth, session };
