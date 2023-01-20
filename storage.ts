import { StorageConfig } from "@keystone-6/core/types";
import { DevEnv, Env, ProdEnv } from "./env.schema";

type Storage = {
  documentsStorage: StorageConfig;
  imagesStorage: StorageConfig;
};

export function getStorageConfig(env: Env): Storage {
  if (env.NODE_ENV === "development") {
    return getLocalStorageConfig(env);
  }

  return getS3StorageConfig(env);
}

function getLocalStorageConfig(env: DevEnv) {
  const localDocumentsStorage: StorageConfig = {
    kind: "local",
    type: "file",
    storagePath: "public/documents",
    serverRoute: {
      path: "documents",
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/documents${path}`,
  };

  const localImagesStorage: StorageConfig = {
    kind: "local",
    type: "image",
    storagePath: "public/images",
    serverRoute: {
      path: "images",
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/images${path}`,
  };

  return {
    documentsStorage: {
      ...localDocumentsStorage,
    },
    imagesStorage: {
      ...localImagesStorage,
    },
  };
}

function getS3StorageConfig(env: ProdEnv) {
  const localDocumentsStorage: StorageConfig = {
    kind: "local",
    type: "file",
    storagePath: "public/documents",
    serverRoute: {
      path: "documents",
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/documents${path}`,
  };

  const localImagesStorage: StorageConfig = {
    kind: "local",
    type: "image",
    storagePath: "public/images",
    serverRoute: {
      path: "images",
    },
    generateUrl: (path) => `${env.ASSET_BASE_URL}/images${path}`,
  };

  return {
    documentsStorage: {
      ...localDocumentsStorage,
    },
    imagesStorage: {
      ...localImagesStorage,
    },
  };
}
