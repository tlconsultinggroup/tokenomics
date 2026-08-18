import { useEffect, useState } from "react";
import { useSettings } from "../lib/hooks/useSettings";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY"];

export default function Settings() {
  const { data, update, isUpdating } = useSettings();
  const [refreshInterval, setRefreshInterval] = useState(300);
  const [currency, setCurrency] = useState("USD");

  // Sync form state once the saved settings load. useState's initializer
  // only runs on mount, before the async query resolves, so without this
  // the form would always show the hardcoded defaults instead of the
  // user's actual saved settings.
  useEffect(() => {
    if (data) {
      setRefreshInterval(data.refreshIntervalSecs);
      setCurrency(data.currency);
    }
  }, [data]);

  const handleSave = () => {
    update({
      refreshIntervalSecs: refreshInterval,
      currency,
      // Preserve existing overrides. Omitting this would clear them, since
      // api.settings.update defaults a missing pricingOverrides to {}.
      pricingOverrides: data?.pricingOverrides ?? {},
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Settings</h2>

      <div className="card" style={{ padding: "var(--spacing-lg)" }}>
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <label
            htmlFor="refresh-interval"
            style={{ display: "block", marginBottom: "var(--spacing-sm)", fontSize: "var(--font-size-sm)" }}
          >
            Refresh interval (seconds)
          </label>
          <input
            id="refresh-interval"
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10) || 0)}
            min="5"
            step="5"
          />
        </div>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <label
            htmlFor="currency"
            style={{ display: "block", marginBottom: "var(--spacing-sm)", fontSize: "var(--font-size-sm)" }}
          >
            Currency
          </label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          style={{
            background: "var(--brand-600)",
            color: "var(--color-text-on-brand)",
            padding: "var(--spacing-sm) var(--spacing-lg)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {isUpdating ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}
