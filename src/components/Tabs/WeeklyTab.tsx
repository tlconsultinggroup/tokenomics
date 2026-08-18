import { DailyData } from "../../lib/types";
import { useTimeWindow } from "../../lib/hooks/useTimeWindow";

interface WeeklyTabProps {
  data: DailyData;
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
        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          {modelEntries.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {modelEntries.map(([model, cost]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td>${cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No data</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: "var(--spacing-lg)" }}>
        <p className="label" style={{ marginBottom: "var(--spacing-sm)" }}>
          Cost by provider
        </p>
        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          {providerEntries.length > 0 ? (
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
                    <td>{provider.charAt(0).toUpperCase() + provider.slice(1)}</td>
                    <td>${cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}
