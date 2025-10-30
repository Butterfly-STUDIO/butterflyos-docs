import { redirect } from "next/navigation";

import { defaultDocSlug } from "@/config/docs";

export default function Home() {
  redirect(`/guide/${defaultDocSlug}`);
}
