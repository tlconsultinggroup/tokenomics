import type { ReactNode } from "react";
import { DailyData } from "../lib/types";

type Tone = "brand" | "info" | "warning" | "accent";

const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  brand: { fg: "var(--brand-600)", bg: "var(--brand-50)" },
  info: { fg: "var(--color-info)", bg: "var(--color-info-bg)" },
  warning: { fg: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  accent: { fg: "var(--color-accent)", bg: "var(--color-accent-bg)" },
};

function DollarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

interface CardProps {
  label: string;
  value: string | number;
  subtext?: string;
  tone: Tone;
  icon: ReactNode;
}

function Card({ label, value, subtext, tone, icon }: CardProps) {
  const colors = TONE_COLORS[tone];
  return (
    <div
      className="card"
      style={{
        padding: "var(--spacing-lg)",
        minWidth: "200px",
        borderTop: `3px solid ${colors.fg}`,
        background: colors.bg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--spacing-md)",
        }}
      >
        <p className="label" style={{ margin: 0 }}>
          {label}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-surface)",
            color: colors.fg,
          }}
        >
          {icon}
        </span>
      </div>
      <p
        style={{
          fontSize: "var(--font-size-xl)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--brand-800)",
          margin: 0,
          marginBottom: subtext ? "var(--spacing-xs)" : 0,
        }}
      >
        {value}
      </p>
      {subtext && (
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}

interface SummaryCardsProps {
  data: DailyData;
}

const PERIOD_LABELS: Record<DailyData["period"], string> = {
  "5h-rolling": "Last 5 hours",
  "7d": "Last 7 days",
  "1mo": "This month",
};

export default function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "var(--spacing-lg)",
        marginBottom: "var(--spacing-xl)",
      }}
    >
      <Card
        label="Total cost"
        value={`$${data.totalCost.toFixed(2)}`}
        subtext="USD"
        tone="brand"
        icon={<DollarIcon />}
      />
      <Card
        label="Total tokens"
        value={`${(data.totalTokens / 1000).toFixed(0)}k`}
        subtext={
          `In ${(data.inputTokens / 1000).toFixed(1)}k, out ${(data.outputTokens / 1000).toFixed(1)}k` +
          (data.cacheReadTokens + data.cacheWriteTokens > 0
            ? `, cache ${((data.cacheReadTokens + data.cacheWriteTokens) / 1000).toFixed(1)}k`
            : "")
        }
        tone="info"
        icon={<LayersIcon />}
      />
      <Card
        label="Avg cost / session"
        value={`$${data.avgCostPerSession.toFixed(2)}`}
        subtext={data.sessionCount > 0 ? `${data.sessionCount} sessions` : "No sessions"}
        tone="warning"
        icon={<TrendIcon />}
      />
      <Card
        label="Sessions"
        value={data.sessionCount}
        subtext={PERIOD_LABELS[data.period]}
        tone="accent"
        icon={<ListIcon />}
      />
    </div>
  );
}
