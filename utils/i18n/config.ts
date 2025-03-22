export type Locale = (typeof locales)[number]["key"];
export const defaultLocale: Locale = "zh-CN";
export const locales = [
  {
    key: "zh-CN",
    name: "简体中文",
  },
  {
    key: "en-US",
    name: "English",
  },
];
