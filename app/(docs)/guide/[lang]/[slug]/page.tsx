import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { LanguageHydrator } from "@/components/language-context";
import { Badge } from "@/components/ui/badge";
import { ArticleToc } from "@/components/article-toc";
import { docIcons } from "@/config/docs";
import { getTagClasses, getTagLabel } from "@/config/doc-tags";
import { cn } from "@/lib/utils";
import {
  getDocBySlugAndLang,
  getDocParams,
  getLanguagesForSlug,
} from "@/lib/docs";

type DocPageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getDocParams();
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug, lang } = await params;
  const doc = getDocBySlugAndLang(slug, lang);

  if (!doc) {
    notFound();
  }

  const availableLangs = getLanguagesForSlug(doc.slug);
  const tagLabel = getTagLabel(doc.tag, doc.lang);
  const tagClasses = getTagClasses(doc.tag);
  const Icon = docIcons[doc.icon];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <LanguageHydrator
        lang={doc.lang}
        slug={doc.slug}
        availableLangs={availableLangs}
      />
      <div className="mt-4 space-y-10">
        <section className="rounded-2xl border border-border bg-card px-6 py-12 shadow-sm sm:px-10">
          <div className="space-y-4">
            {doc.hero ? (
              <div className="block">
                <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/30" style={{ aspectRatio: "3 / 1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.hero}
                    alt={doc.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
            <Badge
              className={cn(
                "w-fit rounded-full border-none px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide",
                tagClasses,
              )}
            >
              {tagLabel}
            </Badge>
            <div className="flex items-center gap-4">
              <Icon className="h-10 w-10" />
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {doc.title}
              </h1>
            </div>
            {doc.description ? (
              <p className="text-base text-muted-foreground sm:text-lg">
                {doc.description}
              </p>
            ) : null}
          </div>
        </section>

        <div className="space-y-8">
          <MarkdownContent content={doc.content} lang={doc.lang} />
        </div>
      </div>

      <ArticleToc headings={doc.headings} tag={doc.tag} />
    </div>
  );
}
