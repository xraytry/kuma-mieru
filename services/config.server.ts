import { apiConfig } from '@/config/api';
import type { GlobalConfig } from '@/types/config';
import { ConfigError } from '@/utils/errors';
import { extractPreloadData } from '@/utils/json-processor';
import { sanitizeJsonString } from '@/utils/json-sanitizer';
import * as cheerio from 'cheerio';
import { cache } from 'react';

export const getGlobalConfig = cache(async (): Promise<GlobalConfig> => {
  try {
    const preloadData = await getPreloadData();

    if (!preloadData.config) {
      throw new ConfigError('配置数据缺失');
    }

    const requiredFields = ['slug', 'title', 'description', 'icon', 'theme'];

    for (const field of requiredFields) {
      if (!(field in preloadData.config)) {
        throw new ConfigError(`配置缺少必要字段: ${field}`);
      }
    }

    if (typeof preloadData.config.theme !== 'string') {
      throw new ConfigError('主题设置必须是字符串类型');
    }

    const theme =
      preloadData.config.theme === 'dark'
        ? 'dark'
        : preloadData.config.theme === 'light'
          ? 'light'
          : 'system';

    const config: GlobalConfig = {
      config: {
        ...preloadData.config,
        theme,
      },
      incident: preloadData.incident,
    };

    return config;
  } catch (error) {
    console.error(
      '获取配置数据失败:',
      error instanceof ConfigError ? error.message : '未知错误',
      error,
    );

    return {
      config: {
        slug: '',
        title: '',
        description: '',
        icon: '/favicon.ico',
        theme: 'system',
        published: true,
        showTags: true,
        customCSS: '',
        footerText: '',
        showPoweredBy: false,
        googleAnalyticsId: null,
        showCertificateExpiry: false,
      },
    };
  }
});

export async function getPreloadData() {
  const htmlResponse = await fetch(apiConfig.htmlEndpoint);

  if (!htmlResponse.ok) {
    throw new ConfigError(`HTML 获取失败: ${htmlResponse.status} ${htmlResponse.statusText}`);
  }

  const html = await htmlResponse.text();
  const $ = cheerio.load(html);
  const preloadScript = $('#preload-data').text();

  if (!preloadScript) {
    throw new ConfigError('预加载数据脚本标签未找到');
  }

  try {
    const jsonStr = sanitizeJsonString(preloadScript);
    return extractPreloadData(jsonStr);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigError(
        `JSON 解析失败: ${error.message}\n预处理后的数据: ${preloadScript.slice(0, 100)}...`,
        error,
      );
    }
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new ConfigError(
      `预加载数据解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
      error,
    );
  }
}
