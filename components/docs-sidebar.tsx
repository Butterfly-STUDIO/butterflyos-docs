'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { docIcons, type DocNavSection } from "@/config/docs";
import {
  getTagClasses,
  getTagLabel,
  getTagHoverBorderClasses,
} from "@/config/doc-tags";

interface DocsSidebarProps {
  sections: DocNavSection[];
  lang: string;
}

export function DocsSidebar({ sections, lang }: DocsSidebarProps) {
  const pathname = usePathname();
  const activeSlug =
    pathname?.split("/").filter(Boolean).pop() ?? "";

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 self-start overflow-hidden border-r bg-sidebar md:flex">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
          {sections.map((section) => {
            const sectionSlug = section.items[0]?.slug ?? section.title.toLowerCase();
            const badgeLabel = getTagLabel(sectionSlug, lang);
            const badgeClasses = getTagClasses(sectionSlug);
            const hoverBorder = getTagHoverBorderClasses(sectionSlug);

            return (
              <div key={section.title} className="flex flex-col gap-3">
                <Badge
                  className={cn(
                    "w-fit rounded-full border-none px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide",
                    badgeClasses,
                  )}
                >
                  {badgeLabel}
                </Badge>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = docIcons[item.icon];
                  const isActive = activeSlug === item.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={`/guide/${lang}/${item.slug}`}
                      className={cn(
                        "flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm transition hover:bg-muted/40",
                        hoverBorder,
                        isActive && "border-border bg-muted/60 text-foreground shadow-sm"
                      )}
                    >
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
