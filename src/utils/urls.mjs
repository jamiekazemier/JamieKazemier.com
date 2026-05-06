export function withBase(href) {
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  if (href.startsWith("/")) {
    return `${normalizedBase}${href.slice(1)}`;
  }

  return href;
}

