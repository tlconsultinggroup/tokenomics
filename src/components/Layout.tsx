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

        <div className="header-container" data-tauri-drag-region>
          <div className="header-left" data-tauri-drag-region>
            <span className="header-logo-wrapper">
              <Logo size={40} />
            </span>
            <div className="header-title-block" data-tauri-drag-region>
              <h1 className="header-title" data-tauri-drag-region>
                <Wordmark size={34} showBadge={true} onDark={true} />
              </h1>
              <p className="header-subtitle" data-tauri-drag-region>
                Local Token Usage &amp; Cost Tracker
              </p>
            </div>
          </div>

          <div className="header-right" data-tauri-drag-region>
            {username && (
              <div className="user-badge" data-tauri-drag-region>
                <span className="user-avatar-circle">
                  {username.charAt(0)}
                </span>
                <span className="user-badge-name">{username}</span>
              </div>
            )}

            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>
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
        <div className="nav-container">
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
