import { invoke } from "@tauri-apps/api/core";
import { DailyData, AppSettings, DataPaths } from "./types";

export const api = {
  data: {
    getDaily: () => invoke<DailyData>("get_daily_data"),
    getWeekly: () => invoke<DailyData>("get_weekly_data"),
    getMonthly: () => invoke<DailyData>("get_monthly_data"),
  },

  settings: {
    get: () => invoke<AppSettings>("get_settings"),
    update: (settings: Partial<AppSettings>) =>
      invoke("update_settings", {
        refreshIntervalSecs: settings.refreshIntervalSecs,
        currency: settings.currency,
        pricingOverrides: settings.pricingOverrides || {},
      }),
    getPaths: () => invoke<DataPaths>("get_paths"),
    addCustomPath: (clientId: string, path: string) =>
      invoke("add_custom_path", { clientId, path }),
    removeCustomPath: (clientId: string, path: string) =>
      invoke("remove_custom_path", { clientId, path }),
  },

  scan: {
    trigger: () => invoke("trigger_scan"),
  },
};
