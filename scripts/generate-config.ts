import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const {
  UPTIME_KUMA_BASE_URL: baseUrl = "",
  PAGE_ID: pageId = "",
} = process.env;

const config = {
  baseUrl,
  htmlEndpoint: `${baseUrl}/status/${pageId}`,
  apiEndpoint: `${baseUrl}/api/status-page/heartbeat/${pageId}`,
} as const;

const configPath = join(process.cwd(), 'config', 'generated-config.json');
writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('Config generated successfully:', configPath); 