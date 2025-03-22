import { z } from 'zod';
import generatedConfig from './generated-config.json';
import type { GeneratedConfig } from './types';

const config = generatedConfig as GeneratedConfig;

const envSchema = z.object({
  UPTIME_KUMA_BASE_URL: z.string().url().default(config.baseUrl),
  PAGE_ID: z.string().default(config.pageId),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = {
  UPTIME_KUMA_BASE_URL: config.baseUrl,
  PAGE_ID: config.pageId,
  NODE_ENV: process.env.NODE_ENV,
} satisfies z.infer<typeof envSchema>;

export type ServerEnv = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof envSchema>;
