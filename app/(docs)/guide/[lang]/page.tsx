import { redirect } from "next/navigation";

import { FALLBACK_LANGUAGE } from "@/config/docs";
import {
  getAllLanguages,
  getDefaultDocSlug,
  getDocBySlugAndLang,
} from "@/lib/docs";

type GuideLangIndexProps = {
  params: {
    lang: string;
  };
};

export function generateStaticParams() {
  return getAllLanguages().map((lang) => ({ lang }));
}

export default function GuideLangIndex({
  params,
}: GuideLangIndexProps) {
  const requested = (params.lang ?? FALLBACK_LANGUAGE).toLowerCase();
  const languages = getAllLanguages();
  const isKnownLanguage = languages.includes(requested);

  if (!isKnownLanguage) {
    const legacySlug = requested;
    const fallbackDoc = getDocBySlugAndLang(
      legacySlug,
      FALLBACK_LANGUAGE,
    );

    if (fallbackDoc) {
      redirect(`/guide/${FALLBACK_LANGUAGE}/${legacySlug}`);
    }

    const fallbackSlug = getDefaultDocSlug(FALLBACK_LANGUAGE);
    redirect(`/guide/${FALLBACK_LANGUAGE}/${fallbackSlug}`);
  }

  const slug = getDefaultDocSlug(requested);
  redirect(`/guide/${requested}/${slug}`);
}
