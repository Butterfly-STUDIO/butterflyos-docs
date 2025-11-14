import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

import {
  FALLBACK_LANGUAGE,
  docIcons,
  type DocIconName,
  type DocNavItem,
  type DocNavSection,
} from "@/config/docs";
import { createSlugger, normalizeHeadingText } from "@/lib/slugify";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

type DocFrontmatter = {
  slug: string;
  lang: string;
  title: string;
  description?: string;
  icon?: string;
  hero?: string;
  section: string;
  sectionOrder?: number;
  order?: number;
  tag?: string;
};

export type LoadedDoc = DocNavItem & {
  hero?: string;
  tag: string;
  lang: string;
  section: string;
  sectionOrder: number;
  content: string;
  filename: string;
  headings: DocHeading[];
};

export type DocHeading = {
  depth: number;
  text: string;
  id: string;
};

const parseIcon = (icon?: string): DocIconName => {
  if (!icon) return "bookOpen";
  return Object.prototype.hasOwnProperty.call(docIcons, icon)
    ? (icon as DocIconName)
    : "bookOpen";
};

const readDocs = cache(() => {
  if (!fs.existsSync(DOCS_DIR)) return [];

  const entries = fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((filename) => {
      const absolute = path.join(DOCS_DIR, filename);
      const raw = fs.readFileSync(absolute, "utf8");
      const { data, content } = matter(raw);
      const meta = data as Partial<DocFrontmatter>;

      if (!meta.slug) {
        throw new Error(`Missing "slug" in ${filename}`);
      }
      if (!meta.lang) {
        throw new Error(`Missing "lang" in ${filename}`);
      }
      if (!meta.title) {
        throw new Error(`Missing "title" in ${filename}`);
      }
      if (!meta.section) {
        throw new Error(`Missing "section" in ${filename}`);
      }

      const lang = meta.lang.toLowerCase();
      const sectionOrder =
        typeof meta.sectionOrder === "number" ? meta.sectionOrder : 99;
      const order = typeof meta.order === "number" ? meta.order : 99;

      return {
        slug: meta.slug,
        lang,
        title: meta.title,
        description: meta.description ?? "",
        icon: parseIcon(meta.icon),
        hero: meta.hero ?? "",
        tag: (meta.tag ?? meta.slug).toString().toLowerCase(),
        section: meta.section,
        sectionOrder,
        order,
        content,
        filename,
        headings: extractHeadings(content),
      } satisfies LoadedDoc;
    })
    .sort((a, b) => {
      if (a.sectionOrder !== b.sectionOrder) {
        return a.sectionOrder - b.sectionOrder;
      }
      if (a.section !== b.section) {
        return a.section.localeCompare(b.section);
      }
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });

  return entries;
});

export const getAllDocs = () => readDocs();

export const getAllLanguages = () => {
  const languages = new Set(
    getAllDocs().map((doc) => doc.lang ?? FALLBACK_LANGUAGE)
  );
  return Array.from(languages).sort();
};

export const getDocBySlugAndLang = (slug?: string, lang?: string) => {
  if (!slug) return null;
  const docs = getAllDocs();
  const normalizedLang = (lang ?? FALLBACK_LANGUAGE).toLowerCase();

  return (
    docs.find(
      (doc) => doc.slug === slug && doc.lang === normalizedLang
    ) ??
    docs.find(
      (doc) => doc.slug === slug && doc.lang === FALLBACK_LANGUAGE
    ) ??
    null
  );
};

export const getDocNavigation = (lang: string): DocNavSection[] => {
  const docs = getAllDocs();
  const normalizedLang = (lang ?? FALLBACK_LANGUAGE).toLowerCase();
  const entries = docs.filter((doc) => doc.lang === normalizedLang);

  const source = entries.length > 0 ? entries : docs.filter(
    (doc) => doc.lang === FALLBACK_LANGUAGE
  );

  const sections = new Map<string, DocNavSection>();

  source.forEach((doc) => {
    if (!sections.has(doc.section)) {
      sections.set(doc.section, {
        title: doc.section,
        order: doc.sectionOrder,
        items: [],
      });
    }

    const section = sections.get(doc.section)!;
    section.items.push({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
      lang: doc.lang,
      order: doc.order,
    });
  });

  return Array.from(sections.values())
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    })
    .map((section) => ({
      ...section,
      items: section.items.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      }),
    }));
};

export const getDefaultDocSlug = (lang: string) => {
  const sections = getDocNavigation(lang);
  return (
    sections[0]?.items[0]?.slug ??
    getDocNavigation(FALLBACK_LANGUAGE)[0]?.items[0]?.slug ??
    "introduzione"
  );
};

export const getDocParams = () =>
  getAllDocs().map((doc) => ({
    slug: doc.slug,
    lang: doc.lang,
  }));

export const getLanguagesForSlug = (slug: string) => {
  const docs = getAllDocs().filter((doc) => doc.slug === slug);
  return Array.from(new Set(docs.map((doc) => doc.lang))).sort();
};

function extractHeadings(content: string): DocHeading[] {
  const slugger = createSlugger();
  const headings: DocHeading[] = [];
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const match = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const depth = match[1].length;
    const rawText = match[2] ?? "";
    const text = normalizeHeadingText(rawText);
    if (!text) continue;
    const id = slugger(text);
    headings.push({ depth, text, id });
  }

  return headings;
}
