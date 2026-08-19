import React from "react";

export interface BreakdownRow {
  key: string;
  label: string;
  tool?: string;
  provider?: string;
  inputTokens?: number;
  outputTokens?: number;
  cost: number;
}

interface UsageBreakdownTableProps {
  title: string;
  rows: BreakdownRow[];
  totalCost: number;
  showTokens?: boolean;
}

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTokens(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
}

export default function UsageBreakdownTable({
  title,
  rows,
  totalCost,
  showTokens = true,
}: UsageBreakdownTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ marginTop: "var(--spacing-lg)" }}>
        <p className="label" style={{ marginBottom: "var(--spacing-sm)" }}>
          {title}
        </p>
        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>No usage recorded</p>
        </div>
      </div>
    );
  }

  const maxCost = Math.max(...rows.map((r) => r.cost), 0.0001);
  const hasToolCol = showTokens && rows.some((r) => r.tool !== undefined);

  return (
    <div style={{ marginTop: "var(--spacing-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-sm)" }}>
        <p className="label" style={{ margin: 0, fontWeight: "var(--font-weight-semibold)" }}>
          {title}
        </p>
        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>Name</th>
              {hasToolCol && <th style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>Tool</th>}
              {showTokens && <th style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>Provider</th>}
              {showTokens && <th style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right" }}>Tokens In</th>}
              {showTokens && <th style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right" }}>Tokens Out</th>}
              <th style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right" }}>Cost</th>
              <th style={{ padding: "var(--spacing-sm) var(--spacing-md)", width: "180px" }}>Share / Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pctOfMax = (row.cost / maxCost) * 100;
              const pctOfTotal = totalCost > 0 ? (row.cost / totalCost) * 100 : 0;

              return (
                <tr
                  key={row.key}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    transition: "background 0.15s ease",
                  }}
                >
                  <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", fontWeight: "var(--font-weight-medium)" }}>
                    {row.label}
                  </td>
                  {hasToolCol && (
                    <td style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--color-brand-soft-bg)",
                          color: "var(--color-brand-text)",
                          fontSize: "var(--font-size-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          border: "1px solid var(--color-brand-soft-border)",
                        }}
                      >
                        {row.tool || "—"}
                      </span>
                    </td>
                  )}
                  {showTokens && (
                    <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", color: "var(--color-text-secondary)" }}>
                      {capitalize(row.provider ?? "Unknown")}
                    </td>
                  )}
                  {showTokens && (
                    <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right", fontFamily: "monospace" }}>
                      {formatTokens(row.inputTokens ?? 0)}
                    </td>
                  )}
                  {showTokens && (
                    <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right", fontFamily: "monospace" }}>
                      {formatTokens(row.outputTokens ?? 0)}
                    </td>
                  )}
                  <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", textAlign: "right", fontWeight: "var(--font-weight-semibold)" }}>
                    ${row.cost.toFixed(2)}
                  </td>
                  <td style={{ padding: "var(--spacing-sm) var(--spacing-md)", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "12px",
                          backgroundColor: "var(--slate-200)",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(pctOfMax, 4)}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #35a97c 0%, #7c3aed 100%)",
                            borderRadius: "var(--radius-sm)",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-text-secondary)",
                          minWidth: "36px",
                          textAlign: "right",
                        }}
                      >
                        {pctOfTotal.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
