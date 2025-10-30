import { BookOpen, Headset } from "lucide-react";

export const docIcons = {
  bookOpen: BookOpen,
  headset: Headset
} as const;

export type DocIconName = keyof typeof docIcons;

export type DocNavItem = {
  slug: string;
  title: string;
  description?: string;
  icon: DocIconName;
};

export type DocNavSection = {
  title: string;
  items: DocNavItem[];
};

const docsData: DocNavSection[] = [
  {
    title: "Introduzione",
    items: [
      {
        slug: "introduzione",
        title: "Guida di ButterflyOS",
        description: "Presentazione della guida",
        icon: "bookOpen",
      },
    ],
  },
  {
    title: "Contatti",
    items: [
      {
        slug: "contatti",
        title: "Contatta l'assistenza",
        description: "Opzioni di contatto",
        icon: "headset",
      },
    ],
  },
];

export const docsNavigation = docsData;

export const docsIndex = docsNavigation
  .map((section) => section.items)
  .flat()
  .reduce<Record<string, DocNavItem>>((acc, item) => {
    acc[item.slug] = item;
    return acc;
  }, {});

export const defaultDocSlug =
  docsNavigation[0]?.items[0]?.slug ?? "introduzione";

export function getDocBySlug(slug: string) {
  return docsIndex[slug];
}
