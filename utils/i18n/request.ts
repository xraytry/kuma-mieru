import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";
import { defaultLocale } from "./config";

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || defaultLocale;
  return {
    locale,
    formats: {
      dateTime: {
        normal: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        },
      },
    },
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
