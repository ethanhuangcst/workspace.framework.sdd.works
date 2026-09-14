import en from "../../messages/en.json";
import zhHans from "../../messages/zh-Hans.json";
import zhHant from "../../messages/zh-Hant.json";
import type { Locale } from "./t";

export type MessageCatalog = Record<string, string>;

export const messages: Record<Locale, MessageCatalog> = {
  en: en as MessageCatalog,
  "zh-Hans": zhHans as MessageCatalog,
  "zh-Hant": zhHant as MessageCatalog,
};

export { en, zhHans, zhHant };
