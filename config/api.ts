import type { Config } from '@/types/config';
import { env } from './env';

export const getConfig = (): Config => {
  // 仅在 Next.js 构建阶段使用占位符配置
  if (env.BUILD_MODE === 'true') {
    return {
      baseUrl: 'https://demo.kuma-mieru.invalid',
      pageId: 'build-mode',
      htmlEndpoint: 'https://demo.kuma-mieru.invalid/status/build-mode',
      apiEndpoint: 'https://demo.kuma-mieru.invalid/api/status-page/heartbeat/build-mode',
      isPlaceholder: true,
    };
  }

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
