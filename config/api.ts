import type { Config } from '@/types/config';

const getConfig = (): Config => {
  const baseUrl = process.env.UPTIME_KUMA_BASE_URL || 'https://uptime.example.com';
  const pageId = process.env.PAGE_ID || 'demo';

  return {
    baseUrl,
    htmlEndpoint: `${baseUrl}/status/${pageId}`,
    apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
    isPlaceholder: !process.env.UPTIME_KUMA_BASE_URL,
  };
};

export const apiConfig = getConfig();

export type ApiConfig = Config;

export const isUsingPlaceholder = () => {
  return apiConfig.isPlaceholder === true;
};

export const validateConfig = () => {
  if (isUsingPlaceholder()) {
    throw new Error('Please configure UPTIME_KUMA_BASE_URL and PAGE_ID environment variables');
  }
}; 