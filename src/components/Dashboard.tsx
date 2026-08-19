import { useDashboardData } from "../lib/hooks/useDashboardData";
import SummaryCards from "./SummaryCards";
import DailyTab from "./Tabs/DailyTab";
import WeeklyTab from "./Tabs/WeeklyTab";
import MonthlyTab from "./Tabs/MonthlyTab";
import ToolsTab from "./Tabs/ToolsTab";

interface DashboardProps {
  period: "daily" | "weekly" | "monthly" | "tools";
}

export default function Dashboard({ period }: DashboardProps) {
  // If period is "tools", query monthly data to pass to ToolsTab for aggregate stats
  const queryPeriod = period === "tools" ? "monthly" : period;
  const { data, isLoading, error } = useDashboardData(queryPeriod);

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
        <p className="text-muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--spacing-sm)", marginBottom: 0 }}>
          Make sure your configured tool paths are accessible, then try refreshing.
        </p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted">No data available for this period.</p>;
  }

  return (
    <div>
      {period !== "tools" && <SummaryCards data={data} />}

      {period === "daily" && <DailyTab data={data} />}
      {period === "weekly" && <WeeklyTab data={data} />}
      {period === "monthly" && <MonthlyTab data={data} />}
      {period === "tools" && <ToolsTab monthlyData={data} />}
    </div>
  );
}
