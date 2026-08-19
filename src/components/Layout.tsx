import { useEffect, useState, type CSSProperties } from "react";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import Logo, { Wordmark } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import WindowControls from "./WindowControls";
import UpdateBanner from "./UpdateBanner";
import { api } from "../lib/api";

const TABS = ["daily", "weekly", "monthly", "tools"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  tools: "Tools & Config",
};

const CONTAINER_STYLE: CSSProperties = {
  maxWidth: "1152px",
  margin: "0 auto",
  width: "100%",
  padding: "0 var(--spacing-xl)",
};

export default function Layout() {
  const [currentTab, setCurrentTab] = useState<Tab>("daily");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    api.system
      .getUser()
      .then((res) => setUsername(res.username))
      .catch(() => setUsername(null));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <UpdateBanner />
        <header
          data-tauri-drag-region
          style={{
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid var(--color-footer-border)",
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
          data-tauri-drag-region
          style={{
            ...CONTAINER_STYLE,
            position: "relative",
            padding: "var(--spacing-md) var(--spacing-xl)",
            paddingRight: "calc(var(--spacing-xl) + 138px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div data-tauri-drag-region style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "var(--radius-md)",
                padding: "5px",
              }}
            >
              <Logo size={40} />
            </span>
            <div data-tauri-drag-region>
              <h1
                data-tauri-drag-region
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Wordmark size={34} showBadge={true} onDark={true} />
              </h1>
              <p
                data-tauri-drag-region
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--color-header-text-secondary)",
                  fontWeight: 500,
                }}
              >
                Token usage and cost tracking across your AI coding tools
              </p>
            </div>
          </div>

          <div data-tauri-drag-region style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {username && (
              <div
                data-tauri-drag-region
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  color: "#ffffff",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 500,
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--brand-400), var(--brand-600))",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#ffffff",
                    textTransform: "uppercase",
                  }}
                >
                  {username.charAt(0)}
                </span>
                <span>{username}</span>
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>

        <WindowControls />
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
                  padding: "var(--spacing-xs) var(--spacing-xs)",
                  margin: "0 0 -1px 0",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--color-brand-text)"
                    : "2px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  color: isActive ? "var(--color-brand-text)" : "var(--color-text-secondary)",
                }}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </nav>
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ ...CONTAINER_STYLE, padding: "var(--spacing-xl)" }}>
          <Dashboard period={currentTab} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
