import * as React from "react";

import { cn } from "@/lib/utils";

export type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      className={cn("relative h-full overflow-hidden", className)}
      {...props}
    >
      <div className="h-full w-full overflow-y-auto">{children}</div>
    </div>
  );
}
