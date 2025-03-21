import type { Config } from '@/types/config';

const getConfig = (): Config => {
  // 仅在 Next.js 构建阶段使用占位符配置
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      baseUrl: 'https://demo.kuma-mieru.invalid',
      pageId: 'default',
      htmlEndpoint: 'https://demo.kuma-mieru.invalid/status/default',
      apiEndpoint: 'https://demo.kuma-mieru.invalid/api/status-page/heartbeat/default',
      isPlaceholder: true,
    };
  }

  if (typeof process.env.UPTIME_KUMA_BASE_URL !== 'string') {
    throw new Error('UPTIME_KUMA_BASE_URL environment variable is not configured');
  }

  if (typeof process.env.PAGE_ID !== 'string') {
    throw new Error('PAGE_ID environment variable is not configured');
  }

  const baseUrl = process.env.UPTIME_KUMA_BASE_URL;
  const pageId = process.env.PAGE_ID;

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