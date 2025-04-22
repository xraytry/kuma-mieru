import { createContext, runInNewContext } from 'node:vm';
import JSON5 from 'json5';
import type { PreloadData } from '../types/config';
import { ConfigError } from '../utils/errors';
import { decodeUnicodeEscapes } from './decoder';
import { validatePreloadData } from './json-sanitizer';

/**
 * 使用 `node:vm` 模块直接执行 JS 获取预加载数据，可免去手动解析 unicode / html 转义字符的烦恼。
 */
export const executePreloadScript = (script: string): unknown => {
  const ctx = createContext({ window: {} });

  try {
    runInNewContext(script, ctx);

    if (ctx.window?.preloadData) {
      return ctx.window.preloadData;
    }

    throw new Error("Can't find window.preloadData");
  } catch (error) {
    console.error('[executePreloadScript] Error:', error as Error);
    throw error;
  }
};

/**
 * 预处理 JSON 字符串，处理常见的非标准格式
 */
export const preprocessJson = (str: string): string => {
  // 移除 JavaScript 变量声明和结尾分号
  const processed = str
    .replace(/^\s*window\.preloadData\s*=\s*/, '')
    .replace(/;?\s*$/, '')
    .trim();

  try {
    const parsed = JSON5.parse(processed);
    return JSON.stringify(parsed);
  } catch (error) {
    console.debug('尝试使用 JSON5 解析失败，返回原始处理字符串', error);
    return processed;
  }
};

/**
 * 尝试从字符串中提取并解析预加载数据
 */
export const extractPreloadData = (jsonStr: string): PreloadData => {
  // 首先尝试 node:vm 方法
  try {
    const scriptWithContext = `window.preloadData = ${jsonStr};`;
    const result = executePreloadScript(scriptWithContext);

    if (validatePreloadData(result as PreloadData)) {
      console.debug('成功使用 node:vm 解析出 preload 数据');
      return result as PreloadData;
    }
  } catch (error) {
    console.debug('node:vm 解析 preload 数据失败，尝试其他方法', error);
  }

  // 尝试提取 JS 部分再使用 node:vm
  const scriptMatch = jsonStr.match(/window\.preloadData\s*=\s*({[\s\S]*?});?\s*$/);
  if (scriptMatch) {
    try {
      const script = `window.preloadData = ${scriptMatch[1]};`;
      const result = executePreloadScript(script);

      if (validatePreloadData(result as PreloadData)) {
        console.debug('通过提取 JS 并使用 VM 执行成功解析数据');
        return result as PreloadData;
      }
    } catch (error) {
      console.debug('提取 JS 并使用 VM 执行解析失败', error);
    }
  }

  // 如果 VM 执行失败，尝试传统解析方法
  try {
    const processedJson = preprocessJson(jsonStr);

    if (process.env.NODE_ENV === 'development') {
      console.debug('预处理后的 JSON:', processedJson.slice(0, 200));
    }

    // 使用标准 JSON 解析
    try {
      const parsed = JSON.parse(processedJson);
      if (validatePreloadData(parsed)) {
        return parsed;
      }
    } catch (jsonError) {
      console.debug('标准 JSON 解析失败，尝试 JSON5:', jsonError);

      // 尝试 JSON5 解析
      const parsed = JSON5.parse(processedJson);
      const decodedData = decodeUnicodeEscapes(parsed);

      if (validatePreloadData(decodedData)) {
        return decodedData;
      }
    }
  } catch (error) {
    console.debug('传统解析方法失败', error);
  }

  throw new ConfigError(`所有解析方法都失败\n清理后的数据: ${jsonStr.slice(0, 200)}...`);
};
