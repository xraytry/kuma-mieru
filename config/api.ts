import type { Config } from '@/types/config';
import { env } from './env';

export const getConfig = (): Config => {
  if (!env.UPTIME_KUMA_BASE_URL || !env.PAGE_ID) {
    throw new Error('Missing required environment variables');
  }

  const baseUrl = env.UPTIME_KUMA_BASE_URL;
  const pageId = env.PAGE_ID;

  if (env.NODE_ENV === 'development') {
    const config = {
      baseUrl,
      pageId,
    };

    console.log('config', config);
  }

  return {
    baseUrl,
    pageId,
    htmlEndpoint: `${baseUrl}/status/${pageId}`,
    apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
    isPlaceholder: false,
  };
};

export const apiConfig = getConfig();

export type ApiConfig = Config;

export const validateConfig = () => {
  return true;
};
