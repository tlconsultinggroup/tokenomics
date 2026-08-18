import { DailyData } from "../lib/types";
import { generateRecommendations } from "../lib/recommendations";

interface RecommendationsProps {
  data: DailyData;
}

export default function Recommendations({ data }: RecommendationsProps) {
  const tips = generateRecommendations(data);

  if (tips.length === 0) {
    return null;
  }

  return (
    <div
      className="card"
      style={{
        padding: "var(--spacing-lg)",
        marginTop: "var(--spacing-xl)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Optimization tips</h3>
      <p className="text-muted" style={{ marginTop: 0, fontSize: "var(--font-size-sm)" }}>
        Ways to reduce token usage and cost based on your activity.
      </p>
      <div
        style={{
          display: "grid",
          gap: "var(--spacing-md)",
        }}
      >
        {tips.map((tip) => (
          <div
            key={tip.id}
            style={{
              background: "var(--color-bg-surface-muted)",
              padding: "var(--spacing-md)",
              borderLeft: "4px solid var(--brand-500)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: "var(--spacing-xs)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-primary)",
              }}
            >
              {tip.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
