import AsyncStorage from
  "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LANGUAGE,
  getLanguage,
  type AppLanguage,
  type LanguageCode,
} from "./languages";
import {
  translations,
  type TranslationKey,
} from "./translations";

const STORAGE_KEY =
  "divyaarpan_customer_language";

type LanguageContextValue = {
  languageCode: LanguageCode;
  language: AppLanguage;
  ready: boolean;
  setLanguage: (
    code: LanguageCode
  ) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

function isLanguageCode(
  value: string | null
): value is LanguageCode {
  return [
    "en",
    "hi",
    "mr",
    "gu",
    "bn",
    "te",
    "ta",
    "kn",
  ].includes(value ?? "");
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [languageCode, setLanguageCode] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreLanguage() {
      try {
        const stored =
          await AsyncStorage.getItem(STORAGE_KEY);

        if (
          active &&
          isLanguageCode(stored)
        ) {
          setLanguageCode(stored);
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    void restoreLanguage();

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback(
    async (code: LanguageCode) => {
      setLanguageCode(code);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        code
      );
    },
    []
  );

  const t = useCallback(
    (key: TranslationKey) =>
      translations[languageCode][key] ??
      translations.en[key],
    [languageCode]
  );

  const value = useMemo(
    () => ({
      languageCode,
      language: getLanguage(languageCode),
      ready,
      setLanguage,
      t,
    }),
    [
      languageCode,
      ready,
      setLanguage,
      t,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
