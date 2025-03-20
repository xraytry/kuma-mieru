import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const {
  UPTIME_KUMA_BASE_URL: baseUrl = "https://uptime.example.com",
  PAGE_ID: pageId = "demo",
} = process.env;

const config = {
  baseUrl,
  htmlEndpoint: `${baseUrl}/status/${pageId}`,
  apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
  isPlaceholder: !process.env.UPTIME_KUMA_BASE_URL,
} as const;

const configPath = join(process.cwd(), 'config', 'generated-config.json');
writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('Config generated successfully:', configPath); 