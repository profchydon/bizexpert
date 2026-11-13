export type AiChatInline =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "code"; value: string };

export type AiChatBlock =
  | { type: "p"; lines: AiChatInline[][] }
  | { type: "ul"; items: AiChatInline[][] }
  | { type: "ol"; items: AiChatInline[][] }
  | { type: "h"; level: 1 | 2 | 3; children: AiChatInline[] };

const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
const UL_RE = /^\s*(?:[-•*]|\u2022)\s+/;
const OL_RE = /^\s*\d+\.\s+/;
const HEADING_RE = /^(#{1,3})\s+(.+)$/;

export function parseInlineMarkdown(text: string): AiChatInline[] {
  const parts = text.split(INLINE_RE).filter((part) => part.length > 0);
  return parts.map((part) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return { type: "code", value: part.slice(1, -1) };
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return { type: "strong", value: part.slice(2, -2) };
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return { type: "strong", value: part.slice(1, -1) };
    }
    return { type: "text", value: part };
  });
}

function lineKind(line: string): "ul" | "ol" | "p" {
  if (UL_RE.test(line)) return "ul";
  if (OL_RE.test(line)) return "ol";
  return "p";
}

function toList(lines: string[], ordered: boolean): AiChatBlock {
  const matcher = ordered ? OL_RE : UL_RE;
  return {
    type: ordered ? "ol" : "ul",
    items: lines
      .filter((line) => line.trim().length > 0)
      .map((line) => parseInlineMarkdown(line.replace(matcher, ""))),
  };
}

function parseMixedLines(lines: string[]): AiChatBlock[] {
  const blocks: AiChatBlock[] = [];
  let buffer: string[] = [];
  let mode: "ul" | "ol" | "p" | null = null;
  const flush = () => {
    if (!buffer.length || !mode) return;
    if (mode === "ul" || mode === "ol")
      blocks.push(toList(buffer, mode === "ol"));
    else {
      blocks.push({
        type: "p",
        lines: buffer.map((line) => parseInlineMarkdown(line)),
      });
    }
    buffer = [];
  };
  for (const line of lines) {
    const next = lineKind(line);
    if (mode && next !== mode) flush();
    mode = next;
    buffer.push(line);
  }
  flush();
  return blocks;
}

export function parseAiChatMarkdown(text: string): AiChatBlock[] {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);
  return blocks.flatMap((block) => {
    const lines = block.split("\n");
    const heading = lines.length === 1 ? lines[0].match(HEADING_RE) : null;
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3;
      return [{ type: "h", level, children: parseInlineMarkdown(heading[2]) }];
    }
    return parseMixedLines(lines);
  });
}
