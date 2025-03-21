import { z } from 'zod';

const serverEnvSchema = z.object({
  UPTIME_KUMA_BASE_URL: z.string().url(),
  PAGE_ID: z.string().min(1),
  BUILD_MODE: z.enum(['true', 'false']).optional().default('false'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_UPTIME_KUMA_BASE_URL: z.string().url(),
  NEXT_PUBLIC_PAGE_ID: z.string().min(1),
});

export const env = {
  UPTIME_KUMA_BASE_URL: process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL,
  PAGE_ID: process.env.NEXT_PUBLIC_PAGE_ID,
  BUILD_MODE: process.env.BUILD_MODE,
  NODE_ENV: process.env.NODE_ENV,
};

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
