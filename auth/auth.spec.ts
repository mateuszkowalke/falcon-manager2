import {
  isAdmin,
  allowAdminAndCurrentUser,
  AccessArgs,
  attachSessionUser,
} from "./auth";

describe("isAdmin", () => {
  it("Should return true if current session user is admin", () => {
    const session = {
      data: {
        id: "someId",
        isAdmin: true,
      },
    };
    expect(isAdmin({ session } as AccessArgs)).toBe(true);
  });

  it("Should return false if current session user is not admin", () => {
    const session = {
      data: {
        id: "someId",
        isAdmin: false,
      },
    };
    expect(isAdmin({ session } as AccessArgs)).toBe(false);
  });
});

describe("allowAdminAndCurrentUser", () => {
  it("Should return true if current session user is admin", () => {
    const session = {
      data: {
        id: "someId",
        isAdmin: true,
      },
    };
    expect(allowAdminAndCurrentUser({ session, list: "User" })).toBe(true);
  });

  it("Should return appropriate filtering rule if current session user is not admin and resource is user", () => {
    const session = {
      data: {
        id: "someId",
        isAdmin: false,
      },
    };
    const filterRule = {
      id: {
        equals: session.data.id,
      },
    };
    expect(
      allowAdminAndCurrentUser({ session, list: "User" })
    ).toStrictEqual({ ...filterRule });
  });

  it("Should return appropriate filtering rule if current session user is not admin and resource is not user", () => {
    const session = {
      data: {
        id: "someId",
        isAdmin: false,
      },
    };
    const filterRule = {
      owner: {
        id: {
          equals: session.data.id,
        },
      },
    };
    expect(
      allowAdminAndCurrentUser({ session, list: "address" })
    ).toStrictEqual({ ...filterRule });
  });
});

describe("attachSessionUser", () => {
  it("Should properly assign 'owner' property to resolvedData when creating new entity", () => {
    const operation = "create";
    const context = {
      session: { data: { id: "someId" } },
    };
    const resolvedData = { someProp: "x" };

    const processedResolvedData = attachSessionUser({
      operation,
      context,
      resolvedData,
    });

    expect(processedResolvedData).toHaveProperty("someProp");
    expect(processedResolvedData.someProp).toBe("x");
    expect(processedResolvedData).toHaveProperty("owner");
    expect(processedResolvedData.owner).toEqual({
      connect: { id: context.session.data.id },
    });
  });

  it("Should do nothing when operation is different than 'create'", () => {
    const operation = "update";
    const context = {
      session: { data: { id: "someId" } },
    };
    const resolvedData = { someProp: "x" };

    const processedResolvedData = attachSessionUser({
      operation,
      context,
      resolvedData,
    });

    expect(processedResolvedData).toHaveProperty("someProp");
    expect(processedResolvedData.someProp).toBe("x");
    expect(processedResolvedData).not.toHaveProperty("owner");
  });
});
