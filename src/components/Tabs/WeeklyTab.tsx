import { DailyData } from "../../lib/types";
import { useTimeWindow } from "../../lib/hooks/useTimeWindow";

interface WeeklyTabProps {
  data: DailyData;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTokens(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
}

export default function WeeklyTab({ data }: WeeklyTabProps) {
  const timeWindow = useTimeWindow("weekly");
  const modelEntries = Object.entries(data.costByModel).sort(([, a], [, b]) => b - a);
  const providerEntries = Object.entries(data.costByProvider).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3>7-day window</h3>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
        {timeWindow.label}
      </p>

      <div style={{ marginTop: "var(--spacing-lg)" }}>
        <p className="label" style={{ marginBottom: "var(--spacing-sm)" }}>
          Cost by model
        </p>
        {modelEntries.length > 0 ? (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Provider</th>
                  <th>Tokens in</th>
                  <th>Tokens out</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {modelEntries.map(([model, cost]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td>{capitalize(data.modelProviders[model] ?? "Unknown")}</td>
                    <td>{formatTokens(data.inputTokensByModel[model] ?? 0)}</td>
                    <td>{formatTokens(data.outputTokensByModel[model] ?? 0)}</td>
                    <td>${cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--spacing-md)" }}>
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No data</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "var(--spacing-lg)" }}>
        <p className="label" style={{ marginBottom: "var(--spacing-sm)" }}>
          Cost by provider
        </p>
        {providerEntries.length > 0 ? (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {providerEntries.map(([provider, cost]) => (
                  <tr key={provider}>
                    <td>{capitalize(provider)}</td>
                    <td>${cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--spacing-md)" }}>
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No data</p>
          </div>
        )}
      </div>
    </div>
  );
}
