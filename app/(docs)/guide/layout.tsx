import type { ReactNode } from "react";

import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSidebar } from "@/components/docs-sidebar";
import { docsNavigation } from "@/config/docs";

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DocsSidebar sections={docsNavigation} />
      <main className="flex-1 space-y-6">
        <DocsMobileNav sections={docsNavigation} />
        {children}
      </main>
    </div>
  );
}
