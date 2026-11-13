export function normalizeRoutePath(href: string, origin: string) {
  if (href.startsWith("/")) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.origin !== origin) {
      return href;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return href;
  }
}

export function isInternalAppHref(href: string, origin: string) {
  if (!href || href.startsWith("#")) {
    return false;
  }

  if (href.startsWith("/")) {
    return true;
  }

  try {
    return new URL(href).origin === origin;
  } catch {
    return false;
  }
}

export function hrefToRoutePath(href: string, origin: string) {
  if (!isInternalAppHref(href, origin)) {
    return null;
  }

  return normalizeRoutePath(href, origin);
}

export function shouldStartNavigation(currentPath: string, nextPath: string) {
  return currentPath !== nextPath;
}
