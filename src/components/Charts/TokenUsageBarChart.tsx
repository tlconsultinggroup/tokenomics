import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { TimeSeriesPoint } from "../../lib/types";

interface TokenUsageBarChartProps {
  timeSeries: TimeSeriesPoint[];
  title?: string;
  isDailyWindow?: boolean;
}

function formatTokens(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
}

export default function TokenUsageBarChart({
  timeSeries,
  title = "Token Usage Over Time",
  isDailyWindow = false,
}: TokenUsageBarChartProps) {
  if (!timeSeries || timeSeries.length === 0) {
    return null;
  }

  const hasWindowHighlight = isDailyWindow || timeSeries.some((pt) => pt.inWindow === false);

  const data = timeSeries.map((pt) => ({
    label: pt.label,
    "Input Tokens": pt.inputTokens,
    "Output Tokens": pt.outputTokens,
    "Cache Read": pt.cacheReadTokens,
    Cost: pt.cost,
    inWindow: pt.inWindow ?? true,
  }));

  const windowPoints = timeSeries.filter((pt) => pt.inWindow);
  const windowStartLabel = windowPoints.length > 0 ? windowPoints[0].label : undefined;
  const windowEndLabel = windowPoints.length > 0 ? windowPoints[windowPoints.length - 1].label : undefined;

  return (
    <div className="card" style={{ padding: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
      <div style={{ marginBottom: "var(--spacing-md)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
            {title}
          </h4>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Breakdown by token type
          </span>
        </div>

        {hasWindowHighlight && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "var(--brand-700)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 6px #10b981" }} />
              Highlighted: 5-Hour Active Window
            </span>
          </div>
        )}
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            {hasWindowHighlight && windowStartLabel && windowEndLabel && (
              <ReferenceArea
                x1={windowStartLabel}
                x2={windowEndLabel}
                fill="#10b981"
                fillOpacity={0.08}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeOpacity={0.35}
              />
            )}
            <XAxis
              dataKey="label"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              tickFormatter={formatTokens}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-primary)",
                fontSize: "12px",
                boxShadow: "var(--shadow-md)",
              }}
              formatter={(value: number, name: string) => [
                name === "Cost" ? `$${value.toFixed(3)}` : formatTokens(value),
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Bar dataKey="Input Tokens" stackId="tokens" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-in-${index}`}
                  fill="#35a97c"
                  fillOpacity={hasWindowHighlight && !entry.inWindow ? 0.35 : 1}
                />
              ))}
            </Bar>
            <Bar dataKey="Output Tokens" stackId="tokens" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-out-${index}`}
                  fill="#7c3aed"
                  fillOpacity={hasWindowHighlight && !entry.inWindow ? 0.35 : 1}
                />
              ))}
            </Bar>
            <Bar dataKey="Cache Read" stackId="tokens" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-cache-${index}`}
                  fill="#2563eb"
                  fillOpacity={hasWindowHighlight && !entry.inWindow ? 0.35 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
