import { useMemo } from "react";

export function useTimeWindow(period: "daily" | "weekly" | "monthly") {
  return useMemo(() => {
    const now = new Date();

    switch (period) {
      case "daily":
        return {
          start: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
          end: now,
          label: "Last 5 hours",
        };

      case "weekly":
        return {
          start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          end: now,
          label: "Last 7 days",
        };

      case "monthly":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          start: monthStart,
          end: now,
          label: `${new Date(now).toLocaleString("default", { month: "long", year: "numeric" })}`,
        };
    }
  }, [period]);
}
