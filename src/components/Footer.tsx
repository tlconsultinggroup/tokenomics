export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-footer-border)",
        background: "var(--color-footer-bg)",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "var(--spacing-lg) var(--spacing-xl)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-sm)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--radius-md)",
            padding: "6px 10px",
            width: "fit-content",
          }}
        >
          <img src="/tlcone-logo.svg" alt="TL Consulting" style={{ height: "22px", width: "auto" }} />
        </span>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--spacing-xs) var(--spacing-md)",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-footer-text-muted)",
          }}
        >
          <span>&copy; {new Date().getFullYear()} TL Consulting. Apache 2.0 license.</span>
          <span>Level 14, 345 George Street, Sydney NSW 2000 &middot; 1800 864 460</span>
        </div>
      </div>
    </footer>
  );
}
