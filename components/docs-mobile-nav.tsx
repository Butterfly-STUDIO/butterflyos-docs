'use client';

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import type { DocNavSection } from "@/config/docs";

interface DocsMobileNavProps {
  sections: DocNavSection[];
}

export function DocsMobileNav({ sections }: DocsMobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug =
    pathname?.split("/").filter(Boolean).pop() ?? "";
  const [value, setValue] = React.useState<string>(activeSlug);

  React.useEffect(() => {
    setValue(activeSlug);
  }, [activeSlug]);

  const items = React.useMemo(
    () =>
      sections.flatMap((section) =>
        section.items.map((item) => ({
          label: `${section.title} · ${item.title}`,
          slug: item.slug,
        }))
      ),
    [sections]
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 md:hidden">
      <label className="text-xs font-medium uppercase text-muted-foreground">
        Seleziona un argomento
      </label>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          if (next) {
            router.push(`/guide/${next}`);
          }
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-border focus:ring-2 focus:ring-ring"
      >
        {items.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
