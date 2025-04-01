import { resolveBrowserLocale, TranslationMessages } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";

const messages: { fr: TranslationMessages; en: TranslationMessages } = {
  fr: frenchMessages,
  en: englishMessages,
};

type LocaleKey = keyof typeof messages;

const i18nProvider = polyglotI18nProvider(
  (locale: string) => messages[locale as LocaleKey] || messages.en,
  resolveBrowserLocale()
);

export default i18nProvider;
