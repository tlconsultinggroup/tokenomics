import { DailyData } from "../lib/types";

interface CardProps {
  label: string;
  value: string | number;
  subtext?: string;
}

function Card({ label, value, subtext }: CardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "var(--spacing-lg)",
        minWidth: "200px",
      }}
    >
      <p
        className="label"
        style={{
          margin: 0,
          marginBottom: "var(--spacing-sm)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "var(--font-size-2xl)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-text-primary)",
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
      />
      <Card
        label="Total tokens"
        value={`${(data.totalTokens / 1000).toFixed(0)}k`}
        subtext={`In ${(data.inputTokens / 1000).toFixed(1)}k, out ${(data.outputTokens / 1000).toFixed(1)}k`}
      />
      <Card
        label="Avg cost / session"
        value={`$${data.avgCostPerSession.toFixed(2)}`}
        subtext={data.sessionCount > 0 ? `${data.sessionCount} sessions` : "No sessions"}
      />
      <Card
        label="Sessions"
        value={data.sessionCount}
        subtext={PERIOD_LABELS[data.period]}
      />
    </div>
  );
}
