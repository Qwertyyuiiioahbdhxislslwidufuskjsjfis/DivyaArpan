import { useLanguage } from "./LanguageProvider";

export function useTranslation() {
  const {
    t,
    language,
    languageCode,
    ready,
    setLanguage,
  } = useLanguage();

  return {
    t,
    language,
    languageCode,
    ready,
    setLanguage,
  };
}
