import * as React from "react";

import { cn } from "@/lib/utils";

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  role,
  ...props
}: SeparatorProps) {
  const classes =
    orientation === "vertical"
      ? "h-full w-px"
      : "h-px w-full";

  return (
    <div
      className={cn("bg-border", classes, className)}
      role={decorative ? "none" : role ?? "separator"}
      aria-orientation={orientation}
      {...props}
    />
  );
}
