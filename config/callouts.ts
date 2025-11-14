import {
  Bug,
  CheckCircle2,
  FlaskConical,
  Info,
  Lightbulb,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { FALLBACK_LANGUAGE } from "@/config/docs";

type CalloutColors = {
  border: string;
  background: string;
  title: string;
  body: string;
};

export type CalloutConfig = {
  icon: LucideIcon;
  translations: Record<string, string>;
  light: CalloutColors;
  dark: CalloutColors;
};

const baseGray: CalloutColors = {
  border: "border-border dark:border-border",
  background: "bg-muted/60 dark:bg-muted/40",
  title: "text-foreground dark:text-foreground",
  body: "text-muted-foreground dark:text-muted-foreground",
};

export const calloutPresets: Record<string, CalloutConfig> = {
  info: {
    icon: Info,
    translations: {
      it: "Info",
      en: "Info",
    },
    light: {
      border: "border-blue-300",
      background: "bg-blue-50",
      title: "text-blue-900",
      body: "text-blue-800",
    },
    dark: {
      border: "dark:border-blue-500/50",
      background: "dark:bg-blue-950/40",
      title: "dark:text-blue-200",
      body: "dark:text-blue-100/80",
    },
  },
  warning: {
    icon: TriangleAlert,
    translations: {
      it: "Attenzione",
      en: "Warning",
    },
    light: {
      border: "border-orange-300",
      background: "bg-orange-50",
      title: "text-orange-900",
      body: "text-orange-800",
    },
    dark: {
      border: "dark:border-orange-500/50",
      background: "dark:bg-orange-950/30",
      title: "dark:text-orange-200",
      body: "dark:text-orange-100/80",
    },
  },
  error: {
    icon: OctagonX,
    translations: {
      it: "Errore",
      en: "Error",
    },
    light: {
      border: "border-red-300",
      background: "bg-red-50",
      title: "text-red-900",
      body: "text-red-800",
    },
    dark: {
      border: "dark:border-red-500/60",
      background: "dark:bg-red-950/40",
      title: "dark:text-red-200",
      body: "dark:text-red-100/80",
    },
  },
  tip: {
    icon: Lightbulb,
    translations: {
      it: "Suggerimento",
      en: "Tip",
    },
    light: {
      border: "border-yellow-300",
      background: "bg-yellow-50",
      title: "text-yellow-900",
      body: "text-yellow-800",
    },
    dark: {
      border: "dark:border-yellow-500/60",
      background: "dark:bg-yellow-950/40",
      title: "dark:text-yellow-200",
      body: "dark:text-yellow-100/80",
    },
  },
  solution: {
    icon: CheckCircle2,
    translations: {
      it: "Soluzione",
      en: "Solution",
    },
    light: {
      border: "border-green-300",
      background: "bg-green-50",
      title: "text-green-900",
      body: "text-green-800",
    },
    dark: {
      border: "dark:border-green-500/50",
      background: "dark:bg-green-950/40",
      title: "dark:text-green-200",
      body: "dark:text-green-100/80",
    },
  },
  bug: {
    icon: Bug,
    translations: {
      it: "Bug",
      en: "Bug",
    },
    light: {
      border: "border-rose-300",
      background: "bg-rose-50",
      title: "text-rose-900",
      body: "text-rose-800",
    },
    dark: {
      border: "dark:border-rose-500/60",
      background: "dark:bg-rose-950/40",
      title: "dark:text-rose-200",
      body: "dark:text-rose-100/80",
    },
  },
  beta: {
    icon: FlaskConical,
    translations: {
      it: "Funzionalità Beta",
      en: "Beta Experiment",
    },
    light: {
      border: "border-violet-300",
      background: "bg-violet-50",
      title: "text-violet-900",
      body: "text-violet-800",
    },
    dark: {
      border: "dark:border-violet-500/60",
      background: "dark:bg-violet-950/40",
      title: "dark:text-violet-200",
      body: "dark:text-violet-100/80",
    },
  },
};

const normalizeLabel = (label: string) =>
  label.trim().toLowerCase().replace(/\s+/g, " ");

const calloutLabelMap = new Map<string, string>();

Object.entries(calloutPresets).forEach(([key, config]) => {
  calloutLabelMap.set(normalizeLabel(key), key);
  Object.values(config.translations).forEach((translation) => {
    calloutLabelMap.set(normalizeLabel(translation), key);
  });
});

export const defaultCallout = {
  icon: Info,
  translations: {
    it: "Nota",
    en: "Note",
  },
  light: baseGray,
  dark: baseGray,
} satisfies CalloutConfig;

export const resolveCalloutKey = (label?: string) => {
  if (!label) return null;
  const normalized = normalizeLabel(label);
  return calloutLabelMap.get(normalized) ?? null;
};

export const getCalloutConfig = (key?: string) => {
  if (!key) {
    return defaultCallout;
  }

  return calloutPresets[key] ?? defaultCallout;
};

export const getCalloutTitle = (
  config: CalloutConfig,
  lang?: string,
) => {
  if (lang && config.translations[lang]) {
    return config.translations[lang];
  }

  if (config.translations[FALLBACK_LANGUAGE]) {
    return config.translations[FALLBACK_LANGUAGE];
  }

  const [firstTranslation] = Object.values(config.translations);
  return firstTranslation ?? "Nota";
};
