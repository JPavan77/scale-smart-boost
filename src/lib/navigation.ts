const rawBase = import.meta.env.BASE_URL || "/";

export const appBase = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

export function appHref(path = "/") {
  if (/^https?:\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) return path;
  if (path.startsWith("#")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!appBase) return normalized;
  return normalized === "/" ? `${appBase}/` : `${appBase}${normalized}`;
}

export function currentAppPath() {
  let path = window.location.pathname || "/";
  if (appBase && path.startsWith(appBase)) {
    path = path.slice(appBase.length) || "/";
  }
  return path.replace(/\/+$/, "") || "/";
}

export function navigate(path: string, replace = false) {
  const target = appHref(path);
  if (replace) window.location.replace(target);
  else window.location.href = target;
}
