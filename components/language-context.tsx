'use client';

import React from "react";

import { FALLBACK_LANGUAGE } from "@/config/docs";

export type LanguageState = {
  lang: string;
  slug: string;
  availableLangs: string[];
};

type LanguageContextValue = LanguageState & {
  setLanguageState: React.Dispatch<React.SetStateAction<LanguageState>>;
};

const defaultState: LanguageState = {
  lang: FALLBACK_LANGUAGE,
  slug: "",
  availableLangs: [FALLBACK_LANGUAGE],
};

const LanguageContext = React.createContext<LanguageContextValue>({
  ...defaultState,
  setLanguageState: () => {},
});

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setLanguageState] =
    React.useState<LanguageState>(defaultState);

  const value = React.useMemo(
    () => ({
      ...state,
      setLanguageState,
    }),
    [state],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () =>
  React.useContext(LanguageContext);

export function LanguageHydrator({
  lang,
  slug,
  availableLangs,
}: LanguageState) {
  const { setLanguageState } = useLanguage();

  React.useEffect(() => {
    setLanguageState({
      lang: lang || FALLBACK_LANGUAGE,
      slug,
      availableLangs:
        availableLangs.length > 0
          ? availableLangs
          : [FALLBACK_LANGUAGE],
    });
  }, [lang, slug, availableLangs, setLanguageState]);

  return null;
}
