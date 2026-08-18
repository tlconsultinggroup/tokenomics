import { DailyData } from "../../lib/types";
import { useTimeWindow } from "../../lib/hooks/useTimeWindow";

interface DailyTabProps {
  data: DailyData;
}

export default function DailyTab({ data }: DailyTabProps) {
  const timeWindow = useTimeWindow("daily");
  const modelEntries = Object.entries(data.costByModel);
  const providerEntries = Object.entries(data.costByProvider);

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3>5-hour window</h3>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
        {timeWindow.start.toLocaleTimeString()} to {timeWindow.end.toLocaleTimeString()}
      </p>

      <div style={{ marginTop: "var(--spacing-lg)" }}>
        <p className="label" style={{ marginBottom: "var(--spacing-sm)" }}>
          Cost by model
        </p>
        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          {modelEntries.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "var(--spacing-md)" }}>
              {modelEntries.map(([model, cost]) => (
                <li key={model}>
                  <strong>{model}:</strong> ${cost.toFixed(2)}
                </li>
              ))}
            </ul>
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
            <ul style={{ margin: 0, paddingLeft: "var(--spacing-md)" }}>
              {providerEntries.map(([provider, cost]) => (
                <li key={provider}>
                  <strong>{provider.charAt(0).toUpperCase() + provider.slice(1)}:</strong> $
                  {cost.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}
