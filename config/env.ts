import { z } from 'zod';

const envSchema = z.object({
  UPTIME_KUMA_BASE_URL: z.string().url(),
  PAGE_ID: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = {
  UPTIME_KUMA_BASE_URL: process.env.UPTIME_KUMA_BASE_URL,
  PAGE_ID: process.env.PAGE_ID,
  NODE_ENV: process.env.NODE_ENV,
};

export type ServerEnv = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof envSchema>;
