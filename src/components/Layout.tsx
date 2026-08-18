import { useState, type CSSProperties } from "react";
import Dashboard from "./Dashboard";

const TABS = ["daily", "weekly", "monthly"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const CONTAINER_STYLE: CSSProperties = {
  maxWidth: "1152px",
  margin: "0 auto",
  width: "100%",
  padding: "0 var(--spacing-xl)",
};

export default function Layout() {
  const [currentTab, setCurrentTab] = useState<Tab>("daily");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-header)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ ...CONTAINER_STYLE, padding: "var(--spacing-lg) var(--spacing-xl)" }}>
          <h1 style={{ margin: 0 }}>Tokenomics</h1>
          <p
            style={{
              margin: "var(--spacing-xs) 0 0 0",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Token usage and cost tracking across your AI coding tools
          </p>
        </div>
      </header>

      <nav
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
        }}
      >
        <div style={{ ...CONTAINER_STYLE, display: "flex", gap: "var(--spacing-md)" }}>
          {TABS.map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-xs)",
                  margin: "0 0 -1px 0",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--brand-600)"
                    : "2px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  color: isActive ? "var(--brand-700)" : "var(--color-text-secondary)",
                }}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </nav>

      <main
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div style={{ ...CONTAINER_STYLE, padding: "var(--spacing-xl)" }}>
          <Dashboard period={currentTab} />
        </div>
      </main>
    </div>
  );
}
