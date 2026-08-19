import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ size = 32, className, style }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      aria-label="Tokenomics Logo"
    >
      <defs>
        <linearGradient id="tokenomics-logo-brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#35a97c" />
          <stop offset="100%" stopColor="#0f6b4a" />
        </linearGradient>

        <linearGradient id="tokenomics-logo-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Rounded badge, brand gradient */}
      <rect x="3" y="3" width="34" height="34" rx="10" fill="url(#tokenomics-logo-brand)" />

      {/* Simple "T" monogram */}
      <rect x="11" y="12" width="18" height="4.4" rx="2.2" fill="#ffffff" />
      <rect x="17.8" y="12" width="4.4" height="17" rx="2.2" fill="#ffffff" />

      {/* Single accent node */}
      <circle cx="29.5" cy="10.5" r="3" fill="url(#tokenomics-logo-accent)" />
    </svg>
  );
}

export function Wordmark({
  size = 22,
  showBadge = true,
  onDark = false,
  style,
}: {
  size?: number;
  showBadge?: boolean;
  onDark?: boolean;
  style?: React.CSSProperties;
}) {
  const tokenGradient = onDark
    ? "linear-gradient(135deg, #66c99f 0%, #9de0c2 60%, #cdf0e0 100%)"
    : "linear-gradient(135deg, #0f6b4a 0%, #178f63 50%, #35a97c 100%)";
  const omicsGradient = onDark
    ? "linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #d8b4fe 100%)"
    : "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #a855f7 100%)";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        letterSpacing: "-0.035em",
        userSelect: "none",
        lineHeight: 1.15,
        fontSize: `${size}px`,
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          background: tokenGradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: onDark ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.04))",
        }}
      >
        token
      </span>
      <span
        style={{
          fontWeight: 700,
          background: omicsGradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: onDark ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.04))",
        }}
      >
        omics
      </span>
      {showBadge && (
        <span
          style={{
            fontSize: "8px",
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: "12px",
            background: onDark ? "rgba(216, 180, 254, 0.14)" : "rgba(124, 58, 237, 0.12)",
            color: onDark ? "#d8b4fe" : "#7c3aed",
            border: onDark ? "1px solid rgba(216, 180, 254, 0.28)" : "1px solid rgba(124, 58, 237, 0.22)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginLeft: "6px",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            verticalAlign: "middle",
          }}
        >
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 3px #10b981",
              display: "inline-block",
            }}
          />
          analytics
        </span>
      )}
    </span>
  );
}
