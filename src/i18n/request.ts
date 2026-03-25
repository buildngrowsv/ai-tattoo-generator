/**
 * next-intl request configuration — loads JSON messages per locale.
 *
 * Called by the next-intl plugin on each request. Keeps translations on disk
 * so marketers can extend ES copy without touching TSX.
 */
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
