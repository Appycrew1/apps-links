// utils/getLogo.js
export function getLogo(p = {}) {
  if (p.logo) return p.logo;
  try {
    const u = new URL(p.website || "");
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=128`;
  } catch { return ""; }
}
