import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { z } from 'zod';
import { extractPreloadData } from '../utils/json-processor';
import { sanitizeJsonString } from '../utils/json-sanitizer';

const siteMetaSchema = z.object({
  title: z.string().default('Kuma Mieru'),
  description: z.string().default('A beautiful and modern uptime monitoring dashboard'),
  icon: z.string().default('/icon.svg'),
});

const configSchema = z.object({
  baseUrl: z.string().url(),
  pageId: z.string(),
  siteMeta: siteMetaSchema,
  isPlaceholder: z.boolean().default(false),
  isEditThisPage: z.boolean().default(true),
  isShowStarButton: z.boolean().default(true),
});

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getBooleanEnvVar(name: string, defaultValue = true): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getOptionalEnvVar(name: string, defaultValue: string | null = null): string | null {
  const value = process.env[name];
  return value !== undefined ? value : defaultValue;
}

async function fetchSiteMeta(baseUrl: string, pageId: string) {
  const customTitle = getOptionalEnvVar('FEATURE_TITLE');
  const customDescription = getOptionalEnvVar('FEATURE_DESCRIPTION');
  const customIcon = getOptionalEnvVar('FEATURE_ICON');

  const hasAnyCustomValue = customTitle || customDescription || customIcon;

  const hasAllCustomValues = customTitle && customDescription && customIcon;

  if (hasAllCustomValues) {
    return siteMetaSchema.parse({
      title: customTitle,
      description: customDescription,
      icon: customIcon,
    });
  }

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

    // 合并自定义值，自定义优先级 > API
    return siteMetaSchema.parse({
      title: customTitle || preloadData.config.title || undefined, // 触发 zod 默认值
      description: customDescription || preloadData.config.description || undefined,
      icon: customIcon || preloadData.config.icon || undefined,
    });
  } catch (error) {
    console.error('Error fetching site meta:', error);

    if (hasAnyCustomValue) {
      return siteMetaSchema.parse({
        title: customTitle || undefined,
        description: customDescription || undefined,
        icon: customIcon || undefined,
      });
    }

    return siteMetaSchema.parse({});
  }
}

async function generateConfig() {
  try {
    const baseUrl = getRequiredEnvVar('UPTIME_KUMA_BASE_URL');
    const pageId = getRequiredEnvVar('PAGE_ID');

    // 获取并验证配置项
    try {
      new URL(baseUrl);
    } catch {
      throw new Error('UPTIME_KUMA_BASE_URL must be a valid URL');
    }

    const isEditThisPage = getBooleanEnvVar('FEATURE_EDIT_THIS_PAGE', false);
    const isShowStarButton = getBooleanEnvVar('FEATURE_SHOW_STAR_BUTTON', true);
    const siteMeta = await fetchSiteMeta(baseUrl, pageId);

    const config = configSchema.parse({
      baseUrl,
      pageId,
      siteMeta,
      isPlaceholder: false,
      isEditThisPage,
      isShowStarButton,
    });

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
