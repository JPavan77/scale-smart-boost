const rawBase = import.meta.env.BASE_URL || "/";

export const appBase = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

export function buildAppHref(path = "/", base = appBase) {
  if (/^https?:\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) return path;
  if (path.startsWith("#")) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (base) {
    const normalizedBase = base.replace(/\/$/, "");
    return normalized === "/" ? `${normalizedBase}/` : `${normalizedBase}/#${normalized}`;
  }

  return normalized;
}

export function appHref(path = "/") {
  return buildAppHref(path, appBase);
}

export function currentAppPath() {
  const hash = window.location.hash || "";
  if (hash.startsWith("#/")) {
    const hashPath = hash.slice(1);
    return hashPath.replace(/\/+$/, "") || "/";
  }

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
