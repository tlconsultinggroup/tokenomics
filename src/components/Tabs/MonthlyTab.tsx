import { DailyData } from "../../lib/types";
import { useTimeWindow } from "../../lib/hooks/useTimeWindow";
import { formatToolNames } from "../../lib/supportedTools";
import MonthlyTrendChart from "../Charts/MonthlyTrendChart";
import TokenUsageBarChart from "../Charts/TokenUsageBarChart";
import UsageBreakdownTable, { BreakdownRow } from "../Charts/UsageBreakdownTable";

interface MonthlyTabProps {
  data: DailyData;
}

export default function MonthlyTab({ data }: MonthlyTabProps) {
  const timeWindow = useTimeWindow("monthly");

  const modelRows: BreakdownRow[] = Object.entries(data.costByModel)
    .sort(([, a], [, b]) => b - a)
    .map(([model, cost]) => ({
      key: model,
      label: model,
      tool: formatToolNames(data.modelTools?.[model]),
      provider: data.modelProviders[model],
      inputTokens: data.inputTokensByModel[model] ?? 0,
      outputTokens: data.outputTokensByModel[model] ?? 0,
      cost,
    }));

  const providerRows: BreakdownRow[] = Object.entries(data.costByProvider)
    .sort(([, a], [, b]) => b - a)
    .map(([provider, cost]) => ({
      key: provider,
      label: provider,
      cost,
    }));

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3>Monthly view</h3>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
        {timeWindow.label}
      </p>

      {/* Monthly Trend Area/Line Chart */}
      {data.timeSeries && data.timeSeries.length > 0 && (
        <MonthlyTrendChart timeSeries={data.timeSeries} />
      )}

      {/* Daily Token Volume Stacked Bar Graph */}
      {data.timeSeries && data.timeSeries.length > 0 && (
        <TokenUsageBarChart timeSeries={data.timeSeries} title="Daily Token Volume over the Month" />
      )}

      {/* Model Breakdown Table with Horizontal Usage Bars */}
      <UsageBreakdownTable
        title="Cost & Token Breakdown by Model"
        rows={modelRows}
        totalCost={data.totalCost}
        showTokens={true}
        showRates={true}
      />

      {/* Provider Breakdown Table with Horizontal Usage Bars */}
      <UsageBreakdownTable
        title="Cost Breakdown by Provider"
        rows={providerRows}
        totalCost={data.totalCost}
        showTokens={false}
      />
    </div>
  );
}
