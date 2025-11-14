import type { ReactNode } from "react";

import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSidebar } from "@/components/docs-sidebar";
import { FALLBACK_LANGUAGE } from "@/config/docs";
import { getDocNavigation } from "@/lib/docs";

interface GuideLanguageLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang?: string;
  }>;
}

export default async function GuideLanguageLayout({
  children,
  params,
}: GuideLanguageLayoutProps) {
  const { lang } = await params;
  const resolvedLang = (lang ?? FALLBACK_LANGUAGE).toLowerCase();
  const sections = getDocNavigation(resolvedLang);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] justify-center gap-6 px-4 pb-8 sm:px-6 lg:px-10 xl:gap-10">
      <DocsSidebar sections={sections} lang={resolvedLang} />
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <DocsMobileNav sections={sections} lang={resolvedLang} />
        {children}
      </main>
    </div>
  );
}
