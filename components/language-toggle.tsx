'use client';

import React from "react";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "@/components/language-context";
import { Button } from "@/components/ui/button";
import { FALLBACK_LANGUAGE } from "@/config/docs";

const buildLanguagePath = (
  pathname: string | null,
  targetLang: string,
  slug?: string,
) => {
  const safeSlug = slug ?? "";
  const homePath =
    targetLang === FALLBACK_LANGUAGE
      ? "/"
      : `/?lang=${targetLang}`;

  if (!pathname) {
    return safeSlug
      ? `/guide/${targetLang}/${safeSlug}`
      : homePath;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return homePath;
  }
  const guideIndex = segments.indexOf("guide");
  if (guideIndex === -1) {
    return homePath;
  }

  const next = [...segments];
  next[guideIndex + 1] = targetLang;

  if (safeSlug) {
    next[guideIndex + 2] = safeSlug;
  } else if (next.length > guideIndex + 2) {
    next.length = guideIndex + 2;
  }

  return `/${next.join("/")}`;
};

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, slug, availableLangs } = useLanguage();
  const languages =
    availableLangs.length > 0
      ? availableLangs
      : [FALLBACK_LANGUAGE];
  const safeLang = lang || FALLBACK_LANGUAGE;
  const resolvedSlug = React.useMemo(() => {
    if (slug) return slug;
    if (!pathname) return "";
    const segments = pathname.split("/").filter(Boolean);
    const guideIndex = segments.indexOf("guide");
    if (guideIndex !== -1 && segments[guideIndex + 2]) {
      return segments[guideIndex + 2];
    }
    return "";
  }, [slug, pathname]);
  const currentIndex = Math.max(
    0,
    languages.indexOf(safeLang),
  );
  const nextLang =
    languages[(currentIndex + 1) % languages.length] ||
    FALLBACK_LANGUAGE;
  const canSwitch = languages.length > 1;
  const label =
    canSwitch
      ? `Lingua attuale: ${safeLang.toUpperCase()}. Clicca per passare a ${nextLang.toUpperCase()}.`
      : `Lingua attuale: ${safeLang.toUpperCase()}.`;

  const handleToggle = () => {
    if (!canSwitch) return;
    const destination = buildLanguagePath(
      pathname,
      nextLang,
      resolvedSlug,
    );
    router.push(destination);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative transition-transform hover:scale-105"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      disabled={!canSwitch}
    >
      <Languages className="h-4 w-4" />
      <span className="pointer-events-none absolute -bottom-1 text-[0.6rem] font-semibold uppercase">
        {safeLang}
      </span>
    </Button>
  );
}
