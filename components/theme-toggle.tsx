'use client';

import * as React from "react";
import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "butterflyos-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("system");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as
      | Theme
      | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      applyTheme("system");
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (window.localStorage.getItem(STORAGE_KEY) === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const rotateTheme = () => {
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const icon: ReactNode =
    theme === "light"
      ? <Sun className="h-4 w-4" />
      : theme === "dark"
        ? <Moon className="h-4 w-4" />
        : (
          <div className="relative flex h-4 w-4 items-center justify-center">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Moon className="absolute h-3 w-3 text-primary" />
          </div>
        );

  const label =
    theme === "light"
      ? "Tema chiaro attivo"
      : theme === "dark"
        ? "Tema scuro attivo"
        : "Tema sistema attivo";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="transition-transform hover:scale-105"
      onClick={rotateTheme}
      aria-label={label}
      title={`Cambia tema (attuale: ${theme})`}
    >
      {icon}
    </Button>
  );
}
