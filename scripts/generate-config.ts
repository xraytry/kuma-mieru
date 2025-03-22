import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { GeneratedConfig } from '../config/types';
import { extractPreloadData } from '../utils/json-processor';
import { sanitizeJsonString } from '../utils/json-sanitizer';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

async function fetchSiteMeta(baseUrl: string, pageId: string) {
  try {
    const response = await fetch(`${baseUrl}/status/${pageId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch site meta: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const preloadScript = $('#preload-data').text();

    if (!preloadScript) {
      throw new Error('Preload data script tag not found');
    }

    const jsonStr = sanitizeJsonString(preloadScript);
    const preloadData = extractPreloadData(jsonStr);

    return {
      title: preloadData.config.title || 'Kuma Mieru',
      description:
        preloadData.config.description || 'A beautiful and modern uptime monitoring dashboard',
      icon: preloadData.config.icon || '/favicon.ico',
    };
  } catch (error) {
    console.error('Error fetching site meta:', error);
    return {
      title: 'Kuma Mieru',
      description: 'A beautiful and modern uptime monitoring dashboard',
      icon: '/favicon.ico',
    };
  }
}

async function generateConfig() {
  try {
    const baseUrl = getRequiredEnvVar('UPTIME_KUMA_BASE_URL');
    const pageId = getRequiredEnvVar('PAGE_ID');

    try {
      new URL(baseUrl);
    } catch {
      throw new Error('UPTIME_KUMA_BASE_URL must be a valid URL');
    }

    const siteMeta = await fetchSiteMeta(baseUrl, pageId);

    const config: GeneratedConfig = {
      baseUrl,
      pageId,
      siteMeta,
      isPlaceholder: false,
    };

    const configPath = path.join(process.cwd(), 'config', 'generated-config.json');

    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    console.log('✅ Configuration file generated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error generating configuration file:', error.message);
    } else {
      console.error('❌ Unknown error generating configuration file');
    }
    process.exit(1);
  }
}

generateConfig().catch(console.error);
