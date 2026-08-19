export interface TimeSeriesPoint {
  label: string;
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
  cost: number;
  sessionCount: number;
  inWindow?: boolean;
}

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
  modelProviders: Record<string, string>;
  modelTools?: Record<string, string[]>;
  inputTokensByModel: Record<string, number>;
  outputTokensByModel: Record<string, number>;
  timeSeries?: TimeSeriesPoint[];
}

export interface ModelRate {
  inputCostPerMillion: number;
  outputCostPerMillion: number;
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
  enabledClients: string[]; // tokenomics ClientId strings, e.g. "claude", "opencode"
  extraDirs: [string, string][]; // (client_id, path) pairs
}
