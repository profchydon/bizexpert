export function isNestedRadixOverlay(element: Element) {
  return Boolean(
    element.closest("[data-radix-popper-content-wrapper]") ||
    element.closest("[data-radix-popover-content]"),
  );
}
