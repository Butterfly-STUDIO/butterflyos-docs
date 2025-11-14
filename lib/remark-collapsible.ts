type BaseNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: BaseNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

type ParentNode = BaseNode & { children: BaseNode[] };
type HeadingNode = ParentNode & { depth: number };
type RootNode = ParentNode;
type ContentNode = BaseNode;

const COLLAPSE_PREFIX = /^\s*-\s*/;

const summarySizeByDepth: Record<number, string> = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-lg",
};

const detailsBaseClass =
  "not-prose my-6 overflow-hidden rounded-2xl border border-border bg-card/60";
const summaryBaseClass =
  "flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-semibold tracking-tight text-foreground";
const bodyClass = "space-y-4 px-4 pb-4 pt-1";

export function remarkCollapsibleSections() {
  return (tree: RootNode) => {
    transformParent(tree);
  };
}

function transformParent(parent: ParentNode) {
  if (!parent.children) return;

  for (let index = 0; index < parent.children.length; index++) {
    const node = parent.children[index];

    if (node.type === "heading" && markHeadingCollapsible(node as HeadingNode)) {
      const detailsNode = buildDetailsNode(parent, index, node as HeadingNode);
      parent.children.splice(index, 1, detailsNode);
      index -= 1;
      continue;
    }

    if (isParent(node)) {
      transformParent(node);
    }
  }
}

function isParent(node: unknown): node is ParentNode {
  return Boolean(
    node &&
    typeof node === "object" &&
    Array.isArray((node as ParentNode).children),
  );
}

function markHeadingCollapsible(heading: HeadingNode) {
  if (!heading.children?.length) return false;
  const firstChild = heading.children[0];
  if (firstChild.type !== "text" || !firstChild.value) return false;

  if (!COLLAPSE_PREFIX.test(firstChild.value)) return false;

  firstChild.value = firstChild.value.replace(COLLAPSE_PREFIX, "");
  if (!firstChild.value.length) {
    heading.children.shift();
  }

  return true;
}

function buildDetailsNode(parent: ParentNode, index: number, heading: HeadingNode) {
  const depth = heading.depth ?? 3;
  const collected: ContentNode[] = [];

  while (index + 1 < parent.children.length) {
    const next = parent.children[index + 1];
    if (next.type === "heading" && (next as HeadingNode).depth <= depth) {
      break;
    }
    collected.push(next);
    parent.children.splice(index + 1, 1);
  }

  const summaryClass = [
    summaryBaseClass,
    summarySizeByDepth[depth] ?? "text-base",
  ].join(" ");

  const detailsNode = {
    type: "details",
    data: {
      hName: "details",
      hProperties: {
        className: detailsBaseClass,
      },
    },
    children: [
      {
        type: "summary",
        data: {
          hName: "summary",
          hProperties: {
            className: summaryClass,
          },
        },
        children: heading.children,
      },
      {
        type: "div",
        data: {
          hName: "div",
          hProperties: {
            className: bodyClass,
          },
        },
        children: collected.length > 0 ? collected : [],
      },
    ],
  };

  return detailsNode;
}
