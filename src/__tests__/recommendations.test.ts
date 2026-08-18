import { describe, test, expect } from "vitest";
import { generateRecommendations } from "../lib/recommendations";
import { DailyData } from "../lib/types";

const mockData: DailyData = {
  period: "5h-rolling",
  totalCost: 60.0,
  totalTokens: 200000,
  inputTokens: 170000,
  outputTokens: 30000,
  cacheReadTokens: 0,
  cacheWriteTokens: 0,
  sessionCount: 5,
  avgCostPerSession: 12.0,
  costByModel: {
    "claude-opus": 36.0,
    "claude-sonnet": 24.0,
  },
  costByProvider: {
    anthropic: 60.0,
  },
};

describe("recommendations", () => {
  test("should generate default tips", () => {
    const tips = generateRecommendations(mockData);
    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0].id).toBeDefined();
  });

  test("should suggest Opus review when both Opus and Sonnet are used", () => {
    const tips = generateRecommendations(mockData);
    const opusReview = tips.find((t) => t.id === "opus-review");
    expect(opusReview).toBeDefined();
  });

  test("should suggest session timeout for high avg cost", () => {
    // mockData.totalCost / mockData.sessionCount = 12, above the > 10 threshold
    const tips = generateRecommendations(mockData);
    const sessionTimeout = tips.find((t) => t.id === "session-timeout");
    expect(sessionTimeout).toBeDefined();
  });

  test("should suggest context reduction for high input token ratio", () => {
    // mockData.inputTokens / mockData.outputTokens is about 5.67, above the > 5 threshold
    const tips = generateRecommendations(mockData);
    const contextReduction = tips.find((t) => t.id === "context-reduction");
    expect(contextReduction).toBeDefined();
  });

  test("should not suggest session timeout when average cost is low", () => {
    const lowCostData: DailyData = {
      ...mockData,
      totalCost: 5.0,
      sessionCount: 5,
    };
    const tips = generateRecommendations(lowCostData);
    const sessionTimeout = tips.find((t) => t.id === "session-timeout");
    expect(sessionTimeout).toBeUndefined();
  });

  test("should not suggest context reduction when token ratio is balanced", () => {
    const balancedData: DailyData = {
      ...mockData,
      inputTokens: 50000,
      outputTokens: 50000,
    };
    const tips = generateRecommendations(balancedData);
    const contextReduction = tips.find((t) => t.id === "context-reduction");
    expect(contextReduction).toBeUndefined();
  });
});
