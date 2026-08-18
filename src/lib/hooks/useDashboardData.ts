import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { DailyData } from "../types";

export function useDashboardData(period: "daily" | "weekly" | "monthly") {
  const getDataFn = () => {
    switch (period) {
      case "daily":
        return api.data.getDaily();
      case "weekly":
        return api.data.getWeekly();
      case "monthly":
        return api.data.getMonthly();
    }
  };

  return useQuery<DailyData, Error>({
    queryKey: ["dashboard", period],
    queryFn: getDataFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
