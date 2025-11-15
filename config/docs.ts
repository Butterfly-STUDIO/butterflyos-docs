import { BookOpen, Headset, MessageCircleHeart, Send, UserRoundSearch, SquarePlus, CirclePlus } from "lucide-react";

export const docIcons = {
  bookOpen: BookOpen,
  headset: Headset,
  messageCircleHeart: MessageCircleHeart,
  send: Send,
  userRoundSearch: UserRoundSearch,
  squarePlus: SquarePlus,
  circlePlus: CirclePlus,
} as const;

export type DocIconName = keyof typeof docIcons;

export type DocNavItem = {
  slug: string;
  title: string;
  description?: string;
  icon: DocIconName;
  lang: string;
  order: number;
};

export type DocNavSection = {
  title: string;
  order: number;
  items: DocNavItem[];
};

export const FALLBACK_LANGUAGE = "it";
