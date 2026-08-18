import { useState } from "react";
import Dashboard from "./Dashboard";

const TABS = ["daily", "weekly", "monthly"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export default function Layout() {
  const [currentTab, setCurrentTab] = useState<Tab>("daily");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-bg-page)",
      }}
    >
      <header
        style={{
          padding: "var(--spacing-lg) var(--spacing-xl)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
        }}
      >
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
      </header>

      <nav
        style={{
          display: "flex",
          gap: "var(--spacing-xs)",
          padding: "var(--spacing-sm) var(--spacing-xl)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: isActive
                  ? "var(--font-weight-semibold)"
                  : "var(--font-weight-medium)",
                background: isActive ? "var(--brand-600)" : "transparent",
                color: isActive
                  ? "var(--color-text-on-brand)"
                  : "var(--color-text-secondary)",
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          );
        })}
      </nav>

      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: "var(--spacing-xl)",
        }}
      >
        <Dashboard period={currentTab} />
      </main>
    </div>
  );
}
