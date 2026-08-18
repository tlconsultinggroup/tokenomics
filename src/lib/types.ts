export interface DailyData {
  period: "5h-rolling" | "7d" | "1mo";
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  sessionCount: number;
  avgCostPerSession: number;
  costByModel: Record<string, number>;
  costByProvider: Record<string, number>;
}

export interface Session {
  timestamp: string;
  source: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface AppSettings {
  refreshIntervalSecs: number;
  currency: string;
  pricingOverrides: Record<string, number>;
}

export interface DataPaths {
  enabledClients: string[]; // tokscale ClientId strings, e.g. "claude", "opencode"
  extraDirs: [string, string][]; // (client_id, path) pairs
}
