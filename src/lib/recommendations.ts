import { DailyData } from "./types";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "model-selection" | "usage-pattern" | "context-reduction" | "budget";
}

export function generateRecommendations(data: DailyData): Recommendation[] {
  const tips: Recommendation[] = [
    {
      id: "sonnet-exploration",
      title: "Use Sonnet for exploration",
      description:
        "Claude Sonnet costs 70% less than Opus and works well for exploratory tasks.",
      category: "model-selection",
    },
    {
      id: "gpt-mini",
      title: "Consider GPT-4o mini",
      description:
        "GPT-4o mini is 90% cheaper than GPT-4 for simple classification and extraction tasks.",
      category: "model-selection",
    },
    {
      id: "batch-requests",
      title: "Batch similar requests",
      description:
        "Grouping similar requests reduces session overhead and can cut costs by 20 to 30 percent.",
      category: "usage-pattern",
    },
  ];

  // Context-aware tips
  const hasExpensiveModels = Object.keys(data.costByModel).some((model) =>
    ["claude-opus", "gpt-4"].includes(model)
  );

  if (
    hasExpensiveModels &&
    Object.keys(data.costByModel).includes("claude-sonnet")
  ) {
    tips.push({
      id: "opus-review",
      title: "Review Opus usage",
      description:
        "You use both Opus and Sonnet. Review tasks using Opus to see if Sonnet handles them equally well.",
      category: "model-selection",
    });
  }

  const avgCost = data.totalCost / Math.max(data.sessionCount, 1);
  if (avgCost > 10) {
    tips.push({
      id: "session-timeout",
      title: `High cost per session ($${avgCost.toFixed(2)})`,
      description:
        "Consider breaking large tasks into smaller sessions or using cheaper models for initialization.",
      category: "budget",
    });
  }

  const tokenRatio = data.inputTokens / Math.max(data.outputTokens, 1);
  if (tokenRatio > 5) {
    tips.push({
      id: "context-reduction",
      title: "Reduce context size",
      description:
        "Your input tokens are more than 5 times your output tokens. Consider summarizing context or using fewer examples.",
      category: "context-reduction",
    });
  }

  return tips;
}
