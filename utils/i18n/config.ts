export type Locale = (typeof locales)[number]['key'];
export const defaultLocale: Locale = 'zh-CN';
export const locales = [
  {
    key: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳',
  },
  {
    key: 'zh-TW',
    name: '繁體中文 (台灣)',
    flag: '🇹🇼',
  },
  {
    key: 'zh-HK',
    name: '繁體中文 (香港)',
    flag: '🇭🇰',
  },
  {
    key: 'en-US',
    name: 'English',
    flag: '🇺🇸',
  },
  {
    key: 'ja-JP',
    name: '日本語',
    flag: '🇯🇵',
  },
] as const;
