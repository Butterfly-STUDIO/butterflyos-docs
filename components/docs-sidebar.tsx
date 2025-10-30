'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { docIcons, type DocNavSection } from "@/config/docs";

interface DocsSidebarProps {
  sections: DocNavSection[];
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname();
  const activeSlug =
    pathname?.split("/").filter(Boolean).pop() ?? "";

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:flex">
      <ScrollArea className="h-[calc(100vh-4rem)] w-full">
        <div className="flex flex-col gap-6 px-4 py-6">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = docIcons[item.icon];
                  const isActive = activeSlug === item.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={`/guide/${item.slug}`}
                      className={cn(
                        "flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm transition hover:border-border hover:bg-muted/40",
                        isActive && "border-border bg-muted/60 text-foreground shadow-sm"
                      )}
                    >
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <span className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item.description ? (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
