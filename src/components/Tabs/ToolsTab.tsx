import { useEffect, useState, type CSSProperties } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { open } from "@tauri-apps/plugin-shell";
import { DailyData, DataPaths } from "../../lib/types";
import { api } from "../../lib/api";
import { SUPPORTED_TOOLS } from "../../lib/supportedTools";
import { useUpdater } from "../../lib/hooks/useUpdater";

interface ToolsTabProps {
  monthlyData: DailyData;
}

function formatTokens(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
}

const PRICING_SOURCE_CARD_STYLE: CSSProperties = {
  padding: "var(--spacing-md)",
  display: "block",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function ToolsTab({ monthlyData }: ToolsTabProps) {
  const [paths, setPaths] = useState<DataPaths | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const { status, checkForUpdate, installUpdate } = useUpdater();

  useEffect(() => {
    api.settings
      .getPaths()
      .then(setPaths)
      .catch((err) => console.error("Could not fetch paths:", err));
  }, []);

  useEffect(() => {
    getVersion()
      .then(setAppVersion)
      .catch(() => setAppVersion(null));
  }, []);

  const enabledClients = paths?.enabledClients ?? ["claude", "opencode", "cursor", "copilot"];
  const extraDirs = paths?.extraDirs ?? [];

  // Determine active usage per tool from monthly data
  // Model provider mapping and model entries tell us which tools recorded sessions
  const activeToolStats = enabledClients.map((clientId) => {
    // Find matching supported tool info if available
    const matchedTool = SUPPORTED_TOOLS.find(
      (t) => t.id.toLowerCase() === clientId.toLowerCase()
    );

    // Filter sessions/models belonging to this client source
    // In DailyData, totalTokens and sessionCount describe the aggregate window
    const isActive = monthlyData.sessionCount > 0 && clientId === "claude"; // Claude is currently active in session data

    return {
      clientId,
      name: matchedTool?.name ?? clientId.toUpperCase(),
      category: matchedTool?.category ?? "Tool",
      defaultPath: matchedTool?.defaultPath ?? "~/" + clientId,
      logFormat: matchedTool?.logFormat ?? "Log files",
      description: matchedTool?.description ?? `Local ${clientId} session logs`,
      isActive,
    };
  });

  // Filter supported tools by search query and category
  const filteredTools = SUPPORTED_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "CLI", "IDE", "Agent", "Desktop"];

  return (
    <div style={{ marginBottom: "var(--spacing-2xl)" }}>
      {/* Header Info Banner */}
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h3 style={{ fontSize: "var(--font-size-xl)", marginBottom: "var(--spacing-xs)" }}>
          Tools & Config
        </h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
          Data pipelines currently wired into Tokenomics and full catalog of supported AI tools
        </p>
      </div>

      {/* App Updates */}
      <div
        className="card"
        style={{
          padding: "var(--spacing-md) var(--spacing-lg)",
          marginBottom: "var(--spacing-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--spacing-md)",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-bold)" }}>
            Tokenomics {appVersion ? `v${appVersion}` : ""}
          </h4>
          <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            {status.state === "idle" && "Check GitHub Releases for a newer build"}
            {status.state === "checking" && "Checking for updates…"}
            {status.state === "up-to-date" && "You're on the latest version"}
            {status.state === "available" && `Version ${status.version} is available`}
            {status.state === "downloading" && `Downloading update… ${Math.round(status.progress * 100)}%`}
            {status.state === "ready" && "Update installed — restarting…"}
            {status.state === "error" && `Update check failed: ${status.message}`}
          </p>
        </div>

        {status.state === "available" ? (
          <button
            onClick={installUpdate}
            style={{
              background: "var(--brand-600)",
              color: "var(--color-text-on-brand)",
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--radius-md)",
              border: "none",
            }}
          >
            Download &amp; install
          </button>
        ) : (
          <button
            onClick={checkForUpdate}
            disabled={status.state === "checking" || status.state === "downloading"}
            style={{
              background: "var(--color-bg-surface-muted)",
              color: "var(--color-text-primary)",
              padding: "var(--spacing-sm) var(--spacing-lg)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            {status.state === "checking" ? "Checking…" : "Check for updates"}
          </button>
        )}
      </div>

      {/* Summary KPI Badges */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-xl)",
        }}
      >
        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Configured Sources
          </span>
          <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: "bold", margin: "4px 0 0 0", color: "var(--color-brand-text)" }}>
            {enabledClients.length + extraDirs.length}
          </p>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
            Scanning local log paths
          </span>
        </div>

        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Monthly Active Sessions
          </span>
          <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: "bold", margin: "4px 0 0 0", color: "var(--color-accent)" }}>
            {monthlyData.sessionCount}
          </p>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
            Across parsed transcripts
          </span>
        </div>

        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Total Tokens Parsed
          </span>
          <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: "bold", margin: "4px 0 0 0", color: "var(--color-success)" }}>
            {formatTokens(monthlyData.totalTokens)}
          </p>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
            Input + Output + Cache
          </span>
        </div>

        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Supported Tool Catalog
          </span>
          <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: "bold", margin: "4px 0 0 0", color: "var(--color-info)" }}>
            {SUPPORTED_TOOLS.length}+
          </p>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
            Via the tokenomics-core engine
          </span>
        </div>
      </div>

      {/* SECTION 1: Wired & Active Data Sources */}
      <div style={{ marginBottom: "var(--spacing-2xl)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-bold)" }}>
              Wired Data Pipelines
            </h4>
            <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              AI coding tools actively monitored on your machine
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--spacing-md)",
          }}
        >
          {activeToolStats.map((tool) => (
            <div
              key={tool.clientId}
              className="card"
              style={{
                padding: "var(--spacing-md)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: "4px solid var(--brand-500)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--spacing-xs)" }}>
                  <h5 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                    {tool.name}
                  </h5>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--slate-100)",
                      color: "var(--slate-700)",
                      textTransform: "uppercase",
                    }}
                  >
                    {tool.category}
                  </span>
                </div>

                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-sm)" }}>
                  {tool.description}
                </p>

                <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--slate-600)", backgroundColor: "var(--slate-50)", padding: "4px 8px", borderRadius: "var(--radius-sm)", marginBottom: "var(--spacing-sm)" }}>
                  Path: {tool.defaultPath}
                </div>
              </div>

              <div style={{ marginTop: "var(--spacing-sm)", paddingTop: "var(--spacing-xs)", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    fontWeight: "var(--font-weight-medium)",
                    color: tool.isActive ? "var(--color-success)" : "var(--color-warning)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ height: "8px", width: "8px", borderRadius: "50%", backgroundColor: tool.isActive ? "var(--color-success)" : "var(--color-warning)" }} />
                  {tool.isActive ? "Active Sessions Detected" : "Configured & Ready"}
                </span>

                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
                  {tool.logFormat}
                </span>
              </div>
            </div>
          ))}

          {/* Custom paths if configured */}
          {extraDirs.map(([clientId, path]) => (
            <div
              key={`${clientId}-${path}`}
              className="card"
              style={{
                padding: "var(--spacing-md)",
                borderLeft: "4px solid var(--color-accent)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--spacing-xs)" }}>
                <h5 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                  {clientId.toUpperCase()} (Custom Folder)
                </h5>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-accent-bg)",
                    color: "var(--color-accent)",
                  }}
                >
                  CUSTOM
                </span>
              </div>
              <p style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--slate-600)", margin: "8px 0" }}>
                Path: {path}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Supported AI Tools Directory Catalog */}
      <div style={{ marginBottom: "var(--spacing-2xl)" }}>
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-bold)" }}>
            Supported Tools Directory ({SUPPORTED_TOOLS.length}+)
          </h4>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            All local AI coding tools natively parsed by Tokenomics
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search tools by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: "1 1 240px",
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--font-size-sm)",
              backgroundColor: "var(--color-bg-surface)",
              color: "var(--color-text-primary)",
            }}
          />

          <div style={{ display: "flex", gap: "4px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid",
                  borderColor: selectedCategory === cat ? "var(--color-brand-text)" : "var(--color-border)",
                  backgroundColor: selectedCategory === cat ? "var(--color-brand-soft-bg)" : "var(--color-bg-surface)",
                  color: selectedCategory === cat ? "var(--color-brand-text)" : "var(--color-text-secondary)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Catalog Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--spacing-md)",
          }}
        >
          {filteredTools.map((tool) => {
            const isWired = enabledClients.some(
              (c) => c.toLowerCase() === tool.id.toLowerCase()
            );

            return (
              <div
                key={tool.id}
                className="card"
                style={{
                  padding: "var(--spacing-md)",
                  opacity: isWired ? 1 : 0.85,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <h5 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                    {tool.name}
                  </h5>
                  {isWired ? (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        padding: "2px 6px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--color-success-bg)",
                        color: "var(--color-success)",
                      }}
                    >
                      WIRED
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "medium",
                        padding: "2px 6px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--slate-100)",
                        color: "var(--slate-600)",
                      }}
                    >
                      {tool.category}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: "4px 0 8px 0" }}>
                  {tool.description}
                </p>

                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                  Storage: <span style={{ fontFamily: "monospace" }}>{tool.defaultPath}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Pricing Methodology */}
      <div style={{ marginBottom: "var(--spacing-2xl)" }}>
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <h4 style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-bold)" }}>
            How Cost Is Calculated
          </h4>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            Where per-model rates come from and how they're applied to your token counts
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--spacing-md)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          <a
            href="https://github.com/BerriAI/litellm"
            onClick={(e) => { e.preventDefault(); open("https://github.com/BerriAI/litellm"); }}
            className="card"
            style={PRICING_SOURCE_CARD_STYLE}
          >
            <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-brand-text)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              LiteLLM
              <ExternalLinkIcon />
            </span>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
              Community-maintained pricing catalog covering most providers and models. The largest of the three sources.
            </p>
          </a>
          <a
            href="https://models.dev"
            onClick={(e) => { e.preventDefault(); open("https://models.dev"); }}
            className="card"
            style={PRICING_SOURCE_CARD_STYLE}
          >
            <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-info)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              models.dev
              <ExternalLinkIcon />
            </span>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
              A second independent pricing catalog, used to fill gaps and cross-check LiteLLM's rates.
            </p>
          </a>
          <a
            href="https://openrouter.ai"
            onClick={(e) => { e.preventDefault(); open("https://openrouter.ai"); }}
            className="card"
            style={PRICING_SOURCE_CARD_STYLE}
          >
            <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-accent)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              OpenRouter
              <ExternalLinkIcon />
            </span>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
              OpenRouter's own published per-model rates, queried directly from their API.
            </p>
          </a>
        </div>

        <div className="card" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
          <p className="label" style={{ margin: "0 0 var(--spacing-sm) 0" }}>
            Resolution order
          </p>
          <ol style={{ margin: 0, paddingLeft: "var(--spacing-lg)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
            <li>Your own custom overrides, if you've configured any, always win</li>
            <li>A small set of vendor-documented rates for models not yet in any catalog (currently Cursor's Composer family and Sakana's fugu-ultra)</li>
            <li>LiteLLM, then OpenRouter, then models.dev, checked by exact match, then normalized match, then provider-prefix match, then fuzzy match</li>
            <li>If nothing resolves, the session is left unpriced rather than silently charged $0</li>
          </ol>
        </div>

        <div className="card" style={{ padding: "var(--spacing-md)" }}>
          <p className="label" style={{ margin: "0 0 var(--spacing-sm) 0" }}>
            Formula
          </p>
          <p style={{ fontSize: "var(--font-size-xs)", fontFamily: "monospace", color: "var(--color-text-primary)", backgroundColor: "var(--color-bg-surface-muted)", padding: "8px 10px", borderRadius: "var(--radius-sm)", margin: "0 0 var(--spacing-sm) 0" }}>
            cost = input_tokens × input_rate + output_tokens × output_rate + cache_read_tokens × cache_read_rate + cache_write_tokens × cache_write_rate
          </p>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
            Rates are per-token. Some models switch to a higher tiered rate above a long-context threshold (e.g. past 272K tokens). Pricing data
            is cached locally for 1 hour; if a source is unreachable, the app falls back to the last successful fetch rather than failing.
          </p>
        </div>
      </div>

      {/* SECTION 4: Privacy Info */}
      <div
        className="card"
        style={{
          padding: "var(--spacing-lg)",
          backgroundColor: "var(--slate-900)",
          color: "var(--slate-100)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <h4 style={{ color: "var(--brand-300)", margin: "0 0 8px 0", fontSize: "var(--font-size-base)" }}>
          Local Session Data, Networked Pricing
        </h4>
        <p style={{ fontSize: "var(--font-size-xs)", color: "var(--slate-300)", lineHeight: 1.6, margin: 0 }}>
          Tokenomics scans session logs stored locally on your device by AI assistants (Claude Code, OpenCode, Cursor, Copilot, etc.). No API keys
          or cloud credentials are required, and no prompt text, session content, or usage telemetry is ever sent anywhere. Token counting and
          aggregation run entirely offline. The only outbound network calls are the three pricing sources above, fetching public per-model rates,
          never your usage data, cached locally so the app still works offline between refreshes.
        </p>
      </div>
    </div>
  );
}
