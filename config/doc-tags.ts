import { FALLBACK_LANGUAGE } from "@/config/docs";

type TagColors = {
  lightBg: string;
  lightText: string;
  darkBg: string;
  darkText: string;
  ring?: string;
  hoverBorder?: string;
  darkHoverBorder?: string;
  textAccent?: string;
  darkTextAccent?: string;
  hoverText?: string;
  darkHoverText?: string;
};

type DocTagConfig = {
  translations: Record<string, string>;
  colors: TagColors;
  image?: string;
};

const defaultColors: TagColors = {
  lightBg: "bg-primary/10",
  lightText: "text-primary",
  darkBg: "dark:bg-primary/20",
  darkText: "dark:text-primary",
  ring: "ring-1 ring-primary/20 dark:ring-primary/40",
  hoverBorder: "hover:border-primary/60",
  darkHoverBorder: "dark:hover:border-primary/50",
  textAccent: "text-primary",
  darkTextAccent: "dark:text-primary",
  hoverText: "hover:text-primary",
  darkHoverText: "dark:hover:text-primary",
};

export const docTags: Record<string, DocTagConfig> = {
  introduzione: {
    image: "/logo.png",
    translations: {
      it: "Introduzione",
      en: "Introduction",
    },
    colors: {
      lightBg: "bg-orange-100",
      lightText: "text-orange-900",
      darkBg: "dark:bg-orange-900",
      darkText: "dark:text-orange-100",
      hoverBorder: "hover:border-orange-400",
      darkHoverBorder: "dark:hover:border-orange-300",
      hoverText: "hover:text-orange-900",
      darkHoverText: "dark:hover:text-orange-100",
    },
  },
  contatti: {
    image: "/icon_contacts.png",
    translations: {
      it: "Contatti",
      en: "Contacts",
    },
    colors: {
      lightBg: "bg-yellow-800",
      lightText: "text-yellow-100",
      darkBg: "dark:bg-yellow-950",
      darkText: "dark:text-yellow-100",
      hoverBorder: "hover:border-yellow-900",
      darkHoverBorder: "dark:hover:border-yellow-900",
      hoverText: "hover:text-yellow-950",
      darkHoverText: "dark:hover:text-yellow-800",
    },
  },
  mail: {
    image: "/icon_mail.png",
    translations: {
      it: "Posta",
      en: "Mail",
    },
    colors: {
      lightBg: "bg-sky-100",
      lightText: "text-sky-900",
      darkBg: "dark:bg-sky-900",
      darkText: "dark:text-sky-100",
      hoverBorder: "hover:border-sky-400",
      darkHoverBorder: "dark:hover:border-sky-300",
      hoverText: "hover:text-sky-900",
      darkHoverText: "dark:hover:text-sky-100",
    },
  },
  note: {
    image: "/icon_notes.png",
    translations: {
      it: "Note",
      en: "Notes",
    },
    colors: {
      lightBg: "bg-yellow-100",
      lightText: "text-yellow-900",
      darkBg: "dark:bg-yellow-900",
      darkText: "dark:text-yellow-100",
      hoverBorder: "hover:border-yellow-400",
      darkHoverBorder: "dark:hover:border-yellow-300",
      hoverText: "hover:text-yellow-900",
      darkHoverText: "dark:hover:text-yellow-100",
    },
  },
  todo: {
    image: "/icon_todo.png",
    translations: {
      it: "Promemoria",
      en: "To Do",
    },
    colors: {
      lightBg: "bg-purple-100",
      lightText: "text-purple-900",
      darkBg: "dark:bg-purple-900",
      darkText: "dark:text-purple-100",
      hoverBorder: "hover:border-purple-400",
      darkHoverBorder: "dark:hover:border-purple-300",
      hoverText: "hover:text-purple-900",
      darkHoverText: "dark:hover:text-purple-100",
    },
  },
  contattaci: {
    image: "/logo.png",
    translations: {
      it: "Contattaci",
      en: "Contact us",
    },
    colors: {
      lightBg: "bg-purple-100",
      lightText: "text-purple-900",
      darkBg: "dark:bg-purple-900",
      darkText: "dark:text-purple-100",
      hoverBorder: "hover:border-purple-400",
      darkHoverBorder: "dark:hover:border-purple-300",
      hoverText: "hover:text-purple-900",
      darkHoverText: "dark:hover:text-purple-100",
    },
  },
};

const buildColorClasses = (colors: TagColors) =>
  [
    colors.lightBg,
    colors.lightText,
    colors.darkBg,
    colors.darkText,
    colors.ring,
  ]
    .filter(Boolean)
    .join(" ");

export const getTagLabel = (tagKey: string, lang?: string) => {
  const tag = docTags[tagKey];
  if (!tag) return tagKey;

  if (lang && tag.translations[lang]) {
    return tag.translations[lang];
  }

  if (tag.translations[FALLBACK_LANGUAGE]) {
    return tag.translations[FALLBACK_LANGUAGE];
  }

  const [firstTranslation] = Object.values(tag.translations);
  return firstTranslation ?? tagKey;
};

export const getTagClasses = (tagKey: string) => {
  const tag = docTags[tagKey];
  return buildColorClasses(tag?.colors ?? defaultColors);
};

export const getTagHoverBorderClasses = (tagKey: string) => {
  const tag = docTags[tagKey];
  const colors = tag?.colors ?? defaultColors;
  return [colors.hoverBorder, colors.darkHoverBorder].filter(Boolean).join(" ");
};

export const getTagTextAccentClasses = (tagKey: string) => {
  const tag = docTags[tagKey];
  const colors = tag?.colors ?? defaultColors;
  return [colors.textAccent ?? colors.lightText, colors.darkTextAccent ?? colors.darkText]
    .filter(Boolean)
    .join(" ");
};

export const getTagHoverTextClasses = (tagKey: string) => {
  const tag = docTags[tagKey];
  const colors = tag?.colors ?? defaultColors;
  return [colors.hoverText, colors.darkHoverText]
    .filter(Boolean)
    .join(" ");
};

export const getTagImage = (tagKey: string) => {
  const tag = docTags[tagKey];
  return tag?.image ?? "/logo.png";
};
