import { useDashboardData } from "../lib/hooks/useDashboardData";
import SummaryCards from "./SummaryCards";

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
      <SummaryCards data={data} />
    </div>
  );
}
