import { useState, type CSSProperties } from "react";
import Dashboard from "./Dashboard";
import Footer from "./Footer";

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
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          overflow: "hidden",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-header)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Slow-drifting wave lines, same technique as the ai-advisory
            sibling project, faded out toward the left so it reads as an
            ambient accent rather than competing with the title. */}
        <svg
          aria-hidden
          viewBox="0 0 1600 60"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.45,
            pointerEvents: "none",
            maskImage: "linear-gradient(to right, transparent 55%, black 92%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 55%, black 92%)",
          }}
        >
          <g className="wave-line wave-line-1">
            <path
              d="M -200 23 C 100 5, 300 40, 600 23 S 1100 4, 1400 23 S 1800 40, 2000 23"
              fill="none"
              stroke="var(--brand-200)"
              strokeWidth="1.5"
            />
          </g>
          <g className="wave-line wave-line-2">
            <path
              d="M -200 39 C 150 53, 350 17, 650 39 S 1150 57, 1450 39 S 1850 17, 2050 39"
              fill="none"
              stroke="var(--brand-300)"
              strokeWidth="1.5"
              strokeDasharray="2 10"
            />
          </g>
          <g className="wave-line wave-line-3">
            <path
              d="M -200 12 C 120 31, 380 -9, 680 17 S 1180 36, 1480 17 S 1880 -9, 2080 17"
              fill="none"
              stroke="var(--brand-500)"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
          <g className="wave-line wave-line-4">
            <path
              d="M -200 48 C 100 33, 340 65, 640 48 S 1140 31, 1440 48 S 1840 65, 2040 48"
              fill="none"
              stroke="var(--brand-100)"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        <div
          style={{
            ...CONTAINER_STYLE,
            position: "relative",
            padding: "var(--spacing-sm) var(--spacing-xl)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "'Aharoni', var(--font-family)",
              color: "var(--brand-600)",
            }}
          >
            tokenomics
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-xs)",
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

      <main style={{ flex: 1 }}>
        <div style={{ ...CONTAINER_STYLE, padding: "var(--spacing-xl)" }}>
          <Dashboard period={currentTab} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
