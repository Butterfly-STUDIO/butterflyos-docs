import Link from "next/link";
import { cn } from "@/lib/utils";

import { getTagHoverTextClasses } from "@/config/doc-tags";
import type { DocHeading } from "@/lib/docs";

type ArticleTocProps = {
  headings: DocHeading[];
  tag: string;
};

export function ArticleToc({ headings, tag }: ArticleTocProps) {
  if (!headings || headings.length === 0) {
    return null;
  }

  const minDepth = Math.min(...headings.map((heading) => heading.depth));
  const hoverAccent = getTagHoverTextClasses(tag);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-4rem)] lg:flex">
      <div className="flex w-64 flex-col justify-center">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <nav className="space-y-1 text-sm text-muted-foreground">
            {headings.map((heading) => {
              const isTopLevel = heading.depth === minDepth;
              return (
                <Link
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={cn(
                    "group block rounded-md px-3 py-2 text-muted-foreground transition hover:bg-card/60 dark:text-muted-foreground",
                    isTopLevel ? "font-bold" : "font-light",
                    hoverAccent,
                  )}
                  style={{
                    marginLeft: (heading.depth - minDepth) * 14,
                  }}
                >
                  <span className={cn("block transition-colors", hoverAccent)}>
                    {heading.text}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
