export type LanguageCode =
  | "en"
  | "hi"
  | "mr"
  | "gu"
  | "bn"
  | "te"
  | "ta"
  | "kn";

export type AppLanguage = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  shortLabel: string;
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const APP_LANGUAGES: AppLanguage[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिंदी",
    shortLabel: "हि",
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    shortLabel: "म",
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    shortLabel: "ગુ",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    shortLabel: "বা",
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    shortLabel: "తె",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    shortLabel: "த",
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    shortLabel: "ಕ",
  },
];

export function getLanguage(
  code: LanguageCode
): AppLanguage {
  return (
    APP_LANGUAGES.find(
      (language) => language.code === code
    ) ?? APP_LANGUAGES[0]
  );
}
