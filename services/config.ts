import type { GlobalConfig } from "@/types/config";
import { sanitizeJsonString } from "@/utils/json-sanitizer";
import { extractPreloadData } from "@/utils/json-processor";
import { ConfigError } from "@/utils/errors";
import * as cheerio from 'cheerio';
import { apiConfig } from "@/config/api";

export async function getPreloadData() {
  const htmlResponse = await fetch(apiConfig.htmlEndpoint);

  if (!htmlResponse.ok) {
    throw new ConfigError(
      `HTML 获取失败: ${htmlResponse.status} ${htmlResponse.statusText}`
    );
  }

  const html = await htmlResponse.text();
  const $ = cheerio.load(html);
  const preloadScript = $('#preload-data').text();

  if (!preloadScript) {
    throw new ConfigError('预加载数据脚本标签未找到');
  }

  // 调试日志
  if (process.env.NODE_ENV === 'development') {
    console.debug('原始预加载脚本内容:', preloadScript);
  }

  try {
    const jsonStr = sanitizeJsonString(preloadScript);

    if (process.env.NODE_ENV === 'development') {
      console.debug('清理后的 JSON 字符串:', jsonStr);
    }

    return extractPreloadData(jsonStr);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigError(
        `JSON 解析失败: ${error.message}\n预处理后的数据: ${preloadScript.slice(0, 100)}...`,
        error
      );
    }
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new ConfigError(`预加载数据解析失败: ${error instanceof Error ? error.message : '未知错误'}`, error);
  }
}

export async function getGlobalConfig(): Promise<GlobalConfig> {
  try {
    const preloadData = await getPreloadData();

    // 验证配置数据结构
    if (!preloadData.config) {
      throw new ConfigError('配置数据缺失');
    }

    const requiredFields = [
      'slug',
      'title',
      'description',
      'icon',
      'theme'
    ];

    for (const field of requiredFields) {
      if (!(field in preloadData.config)) {
        throw new ConfigError(`配置缺少必要字段: ${field}`);
      }
    }

    // 验证并转换主题设置
    if (typeof preloadData.config.theme !== 'string') {
      throw new ConfigError('主题设置必须是字符串类型');
    }

    // 将字符串主题转换为受支持的主题类型
    const theme = preloadData.config.theme === 'dark'
      ? 'dark'
      : preloadData.config.theme === 'light'
        ? 'light'
        : 'system';

    const config: GlobalConfig = {
      config: {
        ...preloadData.config,
        theme,
      },
      incident: preloadData.incident
    };

    return config;
  } catch (error) {
    console.error(
      '获取配置数据失败:',
      error instanceof ConfigError ? error.message : '未知错误',
      error
    );

    // 返回默认值
    return {
      config: {
        slug: "",
        title: "",
        description: "",
        icon: "/favicon.ico",
        theme: "system",
        published: true,
        showTags: true,
        customCSS: "",
        footerText: "",
        showPoweredBy: false,
        googleAnalyticsId: null,
        showCertificateExpiry: false
      }
    };
  }
} 