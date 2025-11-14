import { redirect } from "next/navigation";

import { FALLBACK_LANGUAGE } from "@/config/docs";
import { getDefaultDocSlug } from "@/lib/docs";

export default function GuideIndex() {
  const slug = getDefaultDocSlug(FALLBACK_LANGUAGE);
  redirect(`/guide/${FALLBACK_LANGUAGE}/${slug}`);
}
