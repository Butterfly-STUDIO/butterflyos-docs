import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { icons } from "lucide-react";
import type { LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  defaultCallout,
  getCalloutConfig,
  getCalloutTitle,
  resolveCalloutKey,
} from "@/config/callouts";
import { remarkCollapsibleSections } from "@/lib/remark-collapsible";
import { createSlugger, normalizeHeadingText } from "@/lib/slugify";

type MarkdownContentProps = {
  content: string;
  lang?: string;
};

type CodeComponentProps =
  React.HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    children?: React.ReactNode;
  };

type MarkdownElementProps = {
  children?: React.ReactNode;
  node?: {
    tagName?: string;
  };
};

type MarkdownElement = React.ReactElement<MarkdownElementProps>;

const isMarkdownElement = (
  node: React.ReactNode,
): node is MarkdownElement =>
  React.isValidElement(node);

const getTagName = (element: MarkdownElement) => {
  if (typeof element.type === "string") return element.type;
  const mdNode = element.props.node;
  if (mdNode && typeof mdNode === "object" && "tagName" in mdNode) {
    return (mdNode as { tagName?: string }).tagName;
  }
  return undefined;
};

const getTextFromNode = (node?: React.ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => getTextFromNode(child)).join("");
  }
  if (isMarkdownElement(node)) {
    return getTextFromNode(node.props.children);
  }
  return "";
};

const isWhitespaceNode = (node: React.ReactNode) =>
  typeof node === "string" ? node.trim().length === 0 : node == null;

const ICON_PATTERN = /::([A-Za-z][A-Za-z0-9]*)::/g;

const toPascalCase = (value: string) =>
  value
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^(.)/, (match) => match.toUpperCase());

const getIconComponent = (name: string) => {
  if (!name) return null;
  const registry = icons as Record<string, React.ComponentType<LucideProps>>;
  const candidates = [
    name,
    name.charAt(0).toUpperCase() + name.slice(1),
    toPascalCase(name.toLowerCase()),
  ];
  for (const key of candidates) {
    if (registry[key]) return registry[key];
  }
  return null;
};

const splitTextWithIcons = (text: string) => {
  const segments: Array<string | { type: "icon"; name: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ICON_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index));
    }
    segments.push({ type: "icon", name: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }
  return segments;
};

const renderWithLucide = (
  children: React.ReactNode,
  keyPrefix = "lucide",
): React.ReactNode => {
  const childArray = React.Children.toArray(children);
  return childArray.map((child, index) => {
    if (typeof child === "string") {
      const segments = splitTextWithIcons(child);
      if (segments.length === 1 && typeof segments[0] === "string") {
        return segments[0];
      }
      return (
        <React.Fragment key={`${keyPrefix}-${index}`}>
          {segments.map((segment, segmentIndex) =>
            typeof segment === "string" ? (
              segment
            ) : (
              <LucideInlineIcon
                key={`${keyPrefix}-${index}-${segmentIndex}`}
                name={segment.name}
              />
            )
          )}
        </React.Fragment>
      );
    }
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      if (element.props?.children) {
        const nested = renderWithLucide(
          element.props.children,
          `${keyPrefix}-${index}`,
        );
        return React.cloneElement(element, element.props, nested);
      }
      return element;
    }
    return child;
  });
};

function LucideInlineIcon({ name }: { name: string }) {
  const IconComponent = getIconComponent(name);
  if (!IconComponent) {
    return `::${name}::`;
  }
  return (
    <span className="relative inline-flex h-4 align-middle">
      {React.createElement(IconComponent, {
        className: "h-4 w-4 text-current",
        "aria-hidden": "true",
        style: { transform: "translateY(-1px)" },
      })}
    </span>
  );
}

const BlockquoteCallout = ({
  children,
  lang,
}: {
  children?: React.ReactNode;
  lang?: string;
}) => {
  const nodes = React.Children.toArray(children ?? []);
  let titleText = "";
  let body: React.ReactNode[] = nodes;
  let key: string | null = null;
  let isCollapsed = false;

  const firstParagraphEntry = nodes
    .map((node, index) => ({ node, index }))
    .find(
      ({ node }) =>
        isMarkdownElement(node) && getTagName(node) === "p",
    );

  if (firstParagraphEntry && isMarkdownElement(firstParagraphEntry.node)) {
    const paragraphElement = firstParagraphEntry.node;
    const paragraphChildren = React.Children.toArray(
      paragraphElement.props.children,
    );

    const markerIndex = paragraphChildren.findIndex(
      (child) =>
        typeof child === "string" &&
        child.trimStart().startsWith("-"),
    );
    if (markerIndex !== -1) {
      isCollapsed = true;
      const marker = paragraphChildren[markerIndex] as string;
      const cleaned = marker.replace(/^\s*-\s*/, "");
      if (cleaned.length > 0) {
        paragraphChildren[markerIndex] = cleaned;
      } else {
        paragraphChildren.splice(markerIndex, 1);
      }
    }

    const strongEntry = paragraphChildren
      .map((child, index) => ({ child, index }))
      .find(
        ({ child }) =>
          isMarkdownElement(child) &&
          getTagName(child) === "strong",
      );

    if (strongEntry && isMarkdownElement(strongEntry.child)) {
      const strongElement = strongEntry.child;
      titleText = getTextFromNode(strongElement.props.children).trim();
      key = resolveCalloutKey(titleText);

      const trimmedRest = paragraphChildren
        .filter((_, index) => index !== strongEntry.index)
        .filter((child) => !isWhitespaceNode(child));

      const remainingParagraph =
        trimmedRest.length > 0
          ? React.createElement(
            "p",
            { key: "callout-body" },
            ...trimmedRest,
          )
          : null;

      const restNodes = nodes
        .filter((_, index) => index !== firstParagraphEntry.index)
        .filter((node) => !isWhitespaceNode(node));

      body = [
        ...(remainingParagraph ? [remainingParagraph] : []),
        ...restNodes,
      ];
    }
  }

  const config = getCalloutConfig(key ?? undefined);
  const Icon = config.icon ?? defaultCallout.icon;
  const resolvedTitle = getCalloutTitle(config, lang);
  const displayTitle =
    key ? resolvedTitle : titleText || resolvedTitle;

  const headingContent = (
    <>
      <Icon
        className={cn(
          "h-4 w-4",
          config.light.title,
          config.dark.title,
        )}
      />
      <span
        className={cn(
          config.light.title,
          config.dark.title,
        )}
      >
        {renderWithLucide(displayTitle)}
      </span>
    </>
  );

  const containerClass = cn(
    "not-prose my-6 rounded-2xl border",
    config.light.border,
    config.light.background,
    "dark:border",
    config.dark.border,
    config.dark.background,
  );

  const headerClass =
    "flex items-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide";
  const bodyClass = cn(
    "text-sm leading-relaxed",
    config.light.body,
    config.dark.body,
  );

  if (isCollapsed) {
    return (
      <details className={containerClass}>
        <summary className={headerClass}>
          {headingContent}
        </summary>
        <div className={cn(bodyClass, "border-t border-border px-4 py-4")}>
          {renderWithLucide(body)}
        </div>
      </details>
    );
  }

  return (
    <div className={containerClass}>
      <div className={headerClass}>{headingContent}</div>
      <div className={cn(bodyClass, "px-4 pb-4")}>
        {renderWithLucide(body)}
      </div>
    </div>
  );
};

const createComponents = (
  lang: string | undefined,
  slugifyHeading: (value: string) => string,
): Components => ({
  h1: ({ children, ...props }) => (
    <h1
      className="scroll-mt-24 text-3xl font-semibold tracking-tight text-foreground first:mt-0 mb-2"
      {...props}
      id={slugifyHeading(normalizeHeadingText(getTextFromNode(children)))}
    >
      {renderWithLucide(children)}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground mb-2"
      {...props}
      id={slugifyHeading(normalizeHeadingText(getTextFromNode(children)))}
    >
      {renderWithLucide(children)}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground mb-1.5"
      {...props}
      id={slugifyHeading(normalizeHeadingText(getTextFromNode(children)))}
    >
      {renderWithLucide(children)}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p
      className="text-base leading-relaxed text-muted-foreground"
      {...props}
    >
      {renderWithLucide(children)}
    </p>
  ),
  a: ({ children, ...props }) => (
    <a
      className="font-medium text-primary underline underline-offset-4"
      {...props}
    >
      {renderWithLucide(children)}
    </a>
  ),
  ul: (props) => (
    <ul className="list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {renderWithLucide(children)}
    </li>
  ),
  blockquote: ({ children }) => (
    <BlockquoteCallout lang={lang}>{children}</BlockquoteCallout>
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-full rounded-xl border border-border bg-muted/30 p-4"
      loading="lazy"
      alt={typeof alt === "string" ? alt : ""}
      {...props}
    />
  ),
  code: ({ inline, children, ...props }: CodeComponentProps) =>
    inline ? (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm font-semibold text-foreground"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 text-sm text-foreground">
        <code {...props}>{children}</code>
      </pre>
    ),
  summary: ({ children, ...props }) => (
    <summary {...props}>{renderWithLucide(children)}</summary>
  ),
});

export function MarkdownContent({ content, lang }: MarkdownContentProps) {
  const slugger = createSlugger();
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCollapsibleSections]}
        components={createComponents(lang, slugger)}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
