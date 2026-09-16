export const THEMES = [
  { id: "emerald", name: "Emerald Sanctuary", hint: "Deep masjid green & warm gold", swatch: ["#0f3b31", "#d4af37"] },
  { id: "midnight", name: "Midnight Kaaba", hint: "Deep navy onyx with gold trim", swatch: ["#131a33", "#e0b84a"] },
  { id: "sand", name: "Desert Sand", hint: "Terracotta, sandstone & amber", swatch: ["#4a2e21", "#e0a24a"] },
  { id: "ottoman", name: "Ottoman Teal", hint: "Turquoise with silver & pearl", swatch: ["#123c44", "#d8dee3"] },
  { id: "slate", name: "Monochrome Slate", hint: "High-contrast minimalist", swatch: ["#1c1d20", "#eaeaea"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_IDS = THEMES.map((t) => t.id) as readonly string[];

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return !!value && THEME_IDS.includes(value);
}

export const THEME_STORAGE_KEY = "masjid-theme";
export const PATTERN_STORAGE_KEY = "masjid-pattern";

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset["theme"] = theme;
}
