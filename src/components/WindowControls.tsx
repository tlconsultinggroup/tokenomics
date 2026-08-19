import { useEffect, useState, type CSSProperties } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

const BTN_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "46px",
  height: "100%",
  background: "transparent",
  border: "none",
  borderRadius: 0,
  color: "rgba(248, 250, 252, 0.75)",
  cursor: "pointer",
  padding: 0,
};

export default function WindowControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    appWindow.isMaximized().then(setMaximized).catch(() => {});
    const unlisten = appWindow.onResized(() => {
      appWindow.isMaximized().then(setMaximized).catch(() => {});
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "stretch",
        zIndex: 20,
      }}
    >
      <button
        type="button"
        aria-label="Minimize"
        title="Minimize"
        onClick={() => appWindow.minimize()}
        style={BTN_STYLE}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="5.5" width="10" height="1.2" fill="currentColor" /></svg>
      </button>
      <button
        type="button"
        aria-label={maximized ? "Restore" : "Maximize"}
        title={maximized ? "Restore" : "Maximize"}
        onClick={() => appWindow.toggleMaximize()}
        style={BTN_STYLE}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {maximized ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="2.5" y="1.5" width="7" height="7" />
            <path d="M1.5 3.5v7h7" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="1.5" y="1.5" width="9" height="9" />
          </svg>
        )}
      </button>
      <button
        type="button"
        aria-label="Close"
        title="Close"
        onClick={() => appWindow.close()}
        style={BTN_STYLE}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#dc2626";
          e.currentTarget.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(248, 250, 252, 0.75)";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
        </svg>
      </button>
    </div>
  );
}
