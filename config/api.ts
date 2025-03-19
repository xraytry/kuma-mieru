const {
  UPTIME_KUMA_BASE_URL: baseUrl = "",
  PAGE_ID: pageId = "",
} = process.env;

export const apiConfig = {
  baseUrl: baseUrl,
  htmlEndpoint: `${baseUrl}/status/${pageId}`,
  apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
} as const;

console.log("API Config:", apiConfig);

export type ApiConfig = typeof apiConfig; 