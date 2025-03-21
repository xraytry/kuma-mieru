import type { Config } from '@/types/config';

const getConfig = (): Config => {
  // 仅在 Next.js 构建阶段使用占位符配置
  if (process.env.BUILD_MODE === 'true') {
    return {
      baseUrl: 'https://demo.kuma-mieru.invalid',
      pageId: 'build-mode',
      htmlEndpoint: 'https://demo.kuma-mieru.invalid/status/build-mode',
      apiEndpoint: 'https://demo.kuma-mieru.invalid/api/status-page/heartbeat/build-mode',
      isPlaceholder: true,
    };
  }

  if (!process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL) {
    throw new Error('UPTIME_KUMA_BASE_URL environment variable is not configured');
  }

  if (!process.env.NEXT_PUBLIC_PAGE_ID) {
    throw new Error('PAGE_ID environment variable is not configured');
  }

  const baseUrl = process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL;
  const pageId = process.env.NEXT_PUBLIC_PAGE_ID;

  if (process.env.NODE_ENV === 'development') {
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
