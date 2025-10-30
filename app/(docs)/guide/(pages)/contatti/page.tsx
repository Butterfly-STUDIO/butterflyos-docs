import { notFound } from "next/navigation";

import { getDocBySlug } from "@/config/docs";

import { Headset } from "lucide-react";


export default function IntroduzionePage() {
  const doc = getDocBySlug("contatti");

  if (!doc) notFound();

  return (
    <>
      <section className="rounded-2xl border border-border bg-card px-6 py-12 shadow-sm sm:px-10">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            {doc.slug}
          </span>
          <div className="flex items-center gap-4">
            <Headset className="w-10 h-10" />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {doc.title}
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            I contatti compariranno qui
          </p>
        </div>
      </section>
    </>
  );
}
