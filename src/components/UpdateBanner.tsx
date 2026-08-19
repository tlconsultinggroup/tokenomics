import { useUpdaterStore } from "../lib/hooks/useUpdater";

export default function UpdateBanner() {
  const status = useUpdaterStore((s) => s.status);
  const bannerDismissed = useUpdaterStore((s) => s.bannerDismissed);
  const installUpdate = useUpdaterStore((s) => s.installUpdate);
  const dismissBanner = useUpdaterStore((s) => s.dismissBanner);

  const visible =
    !bannerDismissed &&
    (status.state === "available" || status.state === "downloading" || status.state === "ready");

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--spacing-md)",
        padding: "8px var(--spacing-xl)",
        background: "linear-gradient(90deg, var(--brand-600), var(--brand-500))",
        color: "#ffffff",
        fontSize: "var(--font-size-sm)",
        fontWeight: 500,
      }}
    >
      <span>
        {status.state === "available" && `A new version (v${status.version}) is available.`}
        {status.state === "downloading" && `Downloading update… ${Math.round(status.progress * 100)}%`}
        {status.state === "ready" && "Update installed — restarting…"}
      </span>

      {status.state === "available" && (
        <button
          type="button"
          onClick={installUpdate}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            color: "#ffffff",
            padding: "3px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Update now
        </button>
      )}

      {status.state === "available" && (
        <button
          type="button"
          aria-label="Dismiss"
          title="Dismiss (will show again next launch)"
          onClick={dismissBanner}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.85)",
            cursor: "pointer",
            padding: "2px 6px",
            fontSize: "var(--font-size-sm)",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
