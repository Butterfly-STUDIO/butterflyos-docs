import Link from "next/link";
import { BookOpenText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle";


export function SiteHeader() {
  return (
    <header className="border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/guide/introduzione"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight sm:text-base"
        >
          <BookOpenText className="w-6 h-6" />

          ButterflyOS Docs
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
