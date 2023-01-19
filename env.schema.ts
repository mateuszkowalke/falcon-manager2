import { z } from "zod";

const prodEnv = z.object({
  NODE_ENV: z.literal("production"),
  DATABASE_URL: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  ASSET_BASE_URL: z.string().min(1),
});

const devEnv = z.object({
  NODE_ENV: z.literal("development"),
  DATABASE_URL: z.string().min(1),
  ASSET_BASE_URL: z.string().min(1),
});

export const envSchema = z.union([prodEnv, devEnv]);

export type Env = z.infer<typeof envSchema>;

export type DevEnv = z.infer<typeof devEnv>;
export type ProdEnv = z.infer<typeof prodEnv>;
