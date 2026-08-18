import { useDashboardData } from "../lib/hooks/useDashboardData";

interface DashboardProps {
  period: "daily" | "weekly" | "monthly";
}

export default function Dashboard({ period }: DashboardProps) {
  const { data, isLoading, error } = useDashboardData(period);

  if (isLoading) {
    return <p className="text-muted">Loading dashboard data...</p>;
  }

  if (error) {
    return (
      <div
        className="card"
        style={{
          padding: "var(--spacing-lg)",
          borderColor: "var(--color-danger)",
        }}
      >
        <p style={{ color: "var(--color-danger)", margin: 0 }}>
          Could not load usage data: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted">No data available for this period.</p>;
  }

  return (
    <div>
      <h2>Period: {data.period}</h2>
      <p>Total cost: ${data.totalCost.toFixed(2)}</p>
      <p>Total tokens: {data.totalTokens}</p>
      <p>Sessions: {data.sessionCount}</p>
    </div>
  );
}
