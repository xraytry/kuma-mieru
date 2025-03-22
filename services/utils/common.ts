import packageJson from '@/package.json';

export const customFetchOptions = {
  headers: {
    'User-Agent': `Kuma-Mieru/${packageJson.version} (https://github.com/Alice39s/kuma-mieru)`,
    Accept: 'text/html,application/json,*/*',
  },
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
};
