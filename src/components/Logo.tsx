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
          <stop offset="60%" stopColor="#178f63" />
          <stop offset="100%" stopColor="#0f6b4a" />
        </linearGradient>

        <linearGradient id="tokenomics-logo-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <filter id="tokenomics-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Shield / Token Base */}
      <path
        d="M 20 2 L 34 10 L 34 30 L 20 38 L 6 30 L 6 10 Z"
        fill="url(#tokenomics-logo-brand)"
        rx="2"
      />

      {/* Inner Dark Token Core */}
      <path
        d="M 20 5.2 L 31.5 11.8 L 31.5 28.2 L 20 34.8 L 8.5 28.2 L 8.5 11.8 Z"
        fill="#050b16"
        opacity="0.92"
      />

      {/* Layered Stacked Token / Coin Rings */}
      <ellipse cx="20" cy="27" rx="8" ry="3" fill="none" stroke="#2563eb" strokeWidth="1.2" opacity="0.75" />
      <ellipse cx="20" cy="22" rx="8" ry="3" fill="none" stroke="#35a97c" strokeWidth="1.4" />
      <ellipse
        cx="20"
        cy="17"
        rx="8"
        ry="3"
        fill="none"
        stroke="url(#tokenomics-logo-accent)"
        strokeWidth="1.6"
        filter="url(#tokenomics-logo-glow)"
      />

      {/* Upward Analytics Trend Line */}
      <path
        d="M 13 25 L 18 20 L 22 21 L 27 13"
        fill="none"
        stroke="#35a97c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glowing AI Spark Node */}
      <circle cx="27" cy="13" r="2.2" fill="#a855f7" />
      <circle cx="27" cy="13" r="1" fill="#ffffff" />
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
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: "12px",
            background: onDark ? "rgba(216, 180, 254, 0.14)" : "rgba(124, 58, 237, 0.12)",
            color: onDark ? "#d8b4fe" : "#7c3aed",
            border: onDark ? "1px solid rgba(216, 180, 254, 0.28)" : "1px solid rgba(124, 58, 237, 0.22)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginLeft: "8px",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            verticalAlign: "middle",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 4px #10b981",
              display: "inline-block",
            }}
          />
          analytics
        </span>
      )}
    </span>
  );
}
