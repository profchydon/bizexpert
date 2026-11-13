import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class"];

export function sanitizeRichTextHtml(html: string | null | undefined): string {
  if (!html) {
    return "";
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target"],
  }).trim();
}

export function isRichTextEmpty(html: string | null | undefined): boolean {
  if (!html) {
    return true;
  }

  const textContent = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, "")
    .trim();

  return textContent.length === 0;
}
