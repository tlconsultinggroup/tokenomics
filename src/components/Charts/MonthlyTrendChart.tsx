import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TimeSeriesPoint } from "../../lib/types";

interface MonthlyTrendChartProps {
  timeSeries: TimeSeriesPoint[];
}

function formatTokens(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
}

export default function MonthlyTrendChart({ timeSeries }: MonthlyTrendChartProps) {
  if (!timeSeries || timeSeries.length === 0) {
    return null;
  }

  const data = timeSeries.map((pt) => ({
    label: pt.label,
    Tokens: pt.totalTokens,
    "Input Tokens": pt.inputTokens,
    "Output Tokens": pt.outputTokens,
    Cost: pt.cost,
  }));

  return (
    <div className="card" style={{ padding: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
      <div style={{ marginBottom: "var(--spacing-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
            Monthly Spend & Token Trend
          </h4>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Daily cumulative volume and cost tracking across the current month
          </p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#35a97c" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#35a97c" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis
              dataKey="label"
              stroke="var(--color-text-secondary)"
              fontSize="var(--font-size-xs)"
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              fontSize="var(--font-size-xs)"
              tickLine={false}
              tickFormatter={formatTokens}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#7c3aed"
              fontSize="var(--font-size-xs)"
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-primary)",
                fontSize: "var(--font-size-xs)",
                boxShadow: "var(--shadow-md)",
              }}
              labelStyle={{ color: "var(--color-text-primary)" }}
              itemStyle={{ color: "var(--color-text-primary)" }}
              formatter={(value: number, name: string) => [
                name === "Cost" ? `$${value.toFixed(2)}` : formatTokens(value),
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "var(--font-size-xs)", paddingTop: "10px" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Tokens"
              fill="url(#tokenGradient)"
              stroke="#35a97c"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Cost"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#7c3aed" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
