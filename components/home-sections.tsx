import Link from "next/link";

import { LanguageHydrator } from "@/components/language-context";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_LANGUAGE, docIcons } from "@/config/docs";
import { getDocNavigation } from "@/lib/docs";
import { cn } from "@/lib/utils";
import {
  getTagClasses,
  getTagHoverBorderClasses,
  getTagLabel,
} from "@/config/doc-tags";

const heroCopy = {
  it: {
    kicker: "ButterflyOS Docs",
    title: "Trova la guida giusta in un click",
    description:
      "Gli articoli sono organizzati per sezioni: scegli il tema e apri subito la guida completa.",
  },
  en: {
    kicker: "ButterflyOS Docs",
    title: "Find the right guide instantly",
    description:
      "Every article is grouped by topic: pick a section and jump straight into the full walkthrough.",
  },
};

const clampStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 5,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

export type HomeSectionsProps = {
  lang: string;
  languages: string[];
};

export function HomeSections({ lang, languages }: HomeSectionsProps) {
  const sections = getDocNavigation(lang);
  const copy = heroCopy[lang as keyof typeof heroCopy] ?? heroCopy[FALLBACK_LANGUAGE];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <LanguageHydrator lang={lang} slug="" availableLangs={languages} />
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {copy.kicker}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {copy.title}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {copy.description}
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => {
          const sectionSlug =
            section.items[0]?.slug ?? section.title.toLowerCase();
          const badgeLabel = getTagLabel(sectionSlug, lang);
          const badgeClasses = getTagClasses(sectionSlug);
          const hoverBorder = getTagHoverBorderClasses(sectionSlug);

          return (
            <section key={section.title} className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "rounded-full border-none px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide",
                    badgeClasses,
                  )}
                >
                  {badgeLabel}
                </Badge>
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {section.items.map((item) => {
                  const Icon = docIcons[item.icon];
                  return (
                    <Link
                      key={item.slug}
                      href={`/guide/${lang}/${item.slug}`}
                      className={cn(
                        "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                        hoverBorder,
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-foreground">
                            {item.title}
                          </span>
                          {item.description ? (
                            <span
                              className="text-sm text-muted-foreground"
                              style={clampStyle}
                            >
                              {item.description}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
