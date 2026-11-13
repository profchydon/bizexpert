export const LIST_PAGE_PARAM = "list_page";
export const LIST_TAB_PARAM = "list_tab";
export const LIST_PAGE_KEY_PARAM = "list_page_key";

const RESERVED_LIST_PARAMS = new Set([
  LIST_PAGE_PARAM,
  LIST_TAB_PARAM,
  LIST_PAGE_KEY_PARAM,
]);

export interface TableListLocation {
  page: number;
  tab?: string | null;
  pageKey?: string;
  query?: Record<string, string | null | undefined>;
}

type SearchSource = {
  get(name: string): string | null;
  forEach?(fn: (value: string, key: string) => void): void;
};

export function parseTablePage(value: string | null | undefined): number {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

export function applyTablePageParam(
  params: URLSearchParams,
  page: number,
  key = "page",
) {
  if (page <= 1) params.delete(key);
  else params.set(key, String(page));
}

export function withListLocation(
  href: string,
  location: TableListLocation,
): string {
  const url = new URL(href, "http://local.test");
  if (location.page > 1) {
    url.searchParams.set(LIST_PAGE_PARAM, String(location.page));
  }
  if (location.tab) url.searchParams.set(LIST_TAB_PARAM, location.tab);
  if (location.pageKey && location.pageKey !== "page") {
    url.searchParams.set(LIST_PAGE_KEY_PARAM, location.pageKey);
  }
  for (const [key, value] of Object.entries(location.query ?? {})) {
    const trimmed = value?.trim();
    if (!trimmed || RESERVED_LIST_PARAMS.has(`list_${key}`)) continue;
    url.searchParams.set(`list_${key}`, trimmed);
  }
  const query = url.searchParams.toString();
  return query ? `${url.pathname}?${query}` : url.pathname;
}

function copyPrefixedListParams(search: SearchSource, target: URLSearchParams) {
  if (typeof search.forEach !== "function") return false;
  let copied = false;
  search.forEach((value, key) => {
    if (!key.startsWith("list_") || RESERVED_LIST_PARAMS.has(key) || !value) {
      return;
    }
    target.set(key.slice("list_".length), value);
    copied = true;
  });
  return copied;
}

export function listReturnHref(
  fallbackPath: string,
  search: SearchSource,
): string {
  const rawPage = search.get(LIST_PAGE_PARAM);
  const tab = search.get(LIST_TAB_PARAM);
  const entity = search.get("entity");
  const url = new URL(fallbackPath, "http://local.test");
  if (tab) url.searchParams.set("tab", tab);
  if (rawPage) {
    applyTablePageParam(
      url.searchParams,
      parseTablePage(rawPage),
      search.get(LIST_PAGE_KEY_PARAM) || "page",
    );
  }
  const copiedFilters = copyPrefixedListParams(search, url.searchParams);
  if (entity && !url.searchParams.get("entity")) {
    url.searchParams.set("entity", entity);
  }
  if (!rawPage && !tab && !copiedFilters && !entity) return fallbackPath;
  const query = url.searchParams.toString();
  return query ? `${url.pathname}?${query}` : url.pathname;
}
