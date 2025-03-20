import configJson from './generated-config.json';

interface Config {
  baseUrl: string;
  htmlEndpoint: string;
  apiEndpoint: string;
  isPlaceholder: boolean;
}

export const apiConfig = configJson as Config;

export type ApiConfig = Config;

export const isUsingPlaceholder = () => {
  return apiConfig.isPlaceholder === true;
};

export const validateConfig = () => {
  if (isUsingPlaceholder()) {
    throw new Error('Please configure UPTIME_KUMA_BASE_URL and PAGE_ID environment variables');
  }
}; 