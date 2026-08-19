import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  reduceMotion: boolean;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  setReduceMotion: (value: boolean) => void;
}

const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      reduceMotion: false,
      setTheme: (theme) => set({ theme }),
      cycleTheme: () => {
        const next = THEME_ORDER[(THEME_ORDER.indexOf(get().theme) + 1) % THEME_ORDER.length];
        set({ theme: next });
      },
      setReduceMotion: (value) => set({ reduceMotion: value }),
    }),
    { name: "tokenomics-theme" }
  )
);

// Keeps <html data-theme> and <html data-reduce-motion> in sync with the
// store so plain CSS selectors (not just prefers-color-scheme) can react.
export function applyThemeToDocument(theme: ThemeMode, reduceMotion: boolean) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  root.setAttribute("data-reduce-motion", String(reduceMotion));
}
