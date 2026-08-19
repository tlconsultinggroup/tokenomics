import type { CSSProperties } from "react";
import { useTheme } from "../lib/hooks/useTheme";

const BUTTON_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  borderRadius: "var(--radius-md)",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  color: "#f8fafc",
  cursor: "pointer",
  padding: 0,
};

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function MotionIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity={active ? 1 : 0.4} />
      {!active && <path d="M3 3l18 18" />}
    </svg>
  );
}

const THEME_LABEL: Record<string, string> = {
  system: "Theme: matching system",
  light: "Theme: light",
  dark: "Theme: dark",
};

export default function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const reduceMotion = useTheme((s) => s.reduceMotion);
  const cycleTheme = useTheme((s) => s.cycleTheme);
  const setReduceMotion = useTheme((s) => s.setReduceMotion);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <button
        type="button"
        onClick={cycleTheme}
        title={`${THEME_LABEL[theme]} — click to change`}
        aria-label={THEME_LABEL[theme]}
        style={BUTTON_STYLE}
      >
        {theme === "light" && <SunIcon />}
        {theme === "dark" && <MoonIcon />}
        {theme === "system" && <MonitorIcon />}
      </button>

      <button
        type="button"
        onClick={() => setReduceMotion(!reduceMotion)}
        title={reduceMotion ? "Animated background: off — click to enable" : "Animated background: on — click to disable"}
        aria-label="Toggle animated background"
        aria-pressed={!reduceMotion}
        style={{
          ...BUTTON_STYLE,
          background: reduceMotion ? "rgba(255, 255, 255, 0.08)" : "rgba(53, 169, 124, 0.22)",
          borderColor: reduceMotion ? "rgba(255, 255, 255, 0.15)" : "rgba(53, 169, 124, 0.4)",
        }}
      >
        <MotionIcon active={!reduceMotion} />
      </button>
    </div>
  );
}
