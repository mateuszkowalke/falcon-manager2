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
  const {
    S3_BUCKET_NAME: bucketName,
    S3_REGION: region,
    S3_ACCESS_KEY_ID: accessKeyId,
    S3_SECRET_ACCESS_KEY: secretAccessKey,
  } = env;
  const s3DocumentsStorage: StorageConfig = {
    kind: "s3",
    type: "file",
    bucketName,
    region,
    accessKeyId,
    secretAccessKey,
    signed: { expiry: 5000 },
  };

  const s3ImagesStorage: StorageConfig = {
    kind: "s3",
    type: "image",
    bucketName,
    region,
    accessKeyId,
    secretAccessKey,
    signed: { expiry: 5000 },
  };

  return {
    documentsStorage: {
      ...s3DocumentsStorage,
    },
    imagesStorage: {
      ...s3ImagesStorage,
    },
  };
}
