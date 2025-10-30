import { notFound } from "next/navigation";
import { getDocBySlug } from "@/config/docs";
import { BookOpen, PencilRuler } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function IntroduzionePage() {
  const doc = getDocBySlug("introduzione");

  if (!doc) notFound();

  return (
    <>
      {/* --- CARD PRINCIPALE --- */}
      <section className="rounded-2xl border border-border bg-card px-6 py-12 shadow-sm sm:px-10">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            {doc.slug}
          </span>

          {/* Titolo corretto (senza div dentro l’h1) */}
          <div className="flex items-center gap-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {doc.title}
            </h1>
          </div>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Questo è il sito con la documentazione ufficiale di ButterflyOS
          </p>

          <Alert variant="destructive">
            <PencilRuler />
            <AlertTitle>Work in progress...</AlertTitle>
            <AlertDescription>
              Questo sito è in fase di sviluppo
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* --- CONTENUTO FUORI DALLA CARD --- */}
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          
        </p>
      </div>
    </>
  );
}
