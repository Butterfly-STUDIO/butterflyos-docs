import { FALLBACK_LANGUAGE } from "@/config/docs";
import { getAllLanguages } from "@/lib/docs";
import { HomeSections } from "@/components/home-sections";

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Home({ searchParams }: HomePageProps) {
  const languages = getAllLanguages();
  const queryLang = typeof searchParams?.lang === "string"
    ? searchParams.lang.toLowerCase()
    : undefined;
  const lang =
    queryLang && languages.includes(queryLang)
      ? queryLang
      : FALLBACK_LANGUAGE;

  return <HomeSections lang={lang} languages={languages} />;
}
