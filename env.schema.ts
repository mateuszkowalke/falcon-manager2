import { z } from "zod";

const prodEnv = z.object({
  NODE_ENV: z.literal("production"),
  DATABASE_URL: z.string().min(1),
  ASSET_BASE_URL: z.string().min(1),
});

const devEnv = z.object({
  NODE_ENV: z.literal("development"),
  DATABASE_URL: z.string().min(1),
  ASSET_BASE_URL: z.string().min(1),
});

const testEnv = z.object({
  NODE_ENV: z.literal("test"),
  DATABASE_URL: z.string().min(1),
  ASSET_BASE_URL: z.string().min(1),
});

export const envSchema = z.union([prodEnv, devEnv, testEnv]);

export type Env = z.infer<typeof envSchema>;

export type DevEnv = z.infer<typeof devEnv>;
export type ProdEnv = z.infer<typeof prodEnv>;
