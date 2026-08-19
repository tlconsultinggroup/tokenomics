import { invoke } from "@tauri-apps/api/core";
import { DailyData, AppSettings, DataPaths } from "./types";

// Tauri v2 rejects invoke() promises with the raw deserialized command error
// value (here, a bare string — see src-tauri/src/error.rs's untagged
// AppError), not a JS Error instance. Normalize every rejection into a real
// Error so downstream consumers (e.g. React Query's `error.message`) work.
async function invokeCommand<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  try {
    return await invoke<T>(cmd, args);
  } catch (e) {
    throw e instanceof Error ? e : new Error(typeof e === "string" ? e : JSON.stringify(e));
  }
}

export const api = {
  system: {
    getUser: () => invokeCommand<{ username: string }>("get_system_user"),
  },

  data: {
    getDaily: () => invokeCommand<DailyData>("get_daily_data"),
    getWeekly: () => invokeCommand<DailyData>("get_weekly_data"),
    getMonthly: () => invokeCommand<DailyData>("get_monthly_data"),
  },

  settings: {
    get: () => invokeCommand<AppSettings>("get_settings"),
    update: (settings: Partial<AppSettings>) =>
      invokeCommand("update_settings", {
        refreshIntervalSecs: settings.refreshIntervalSecs,
        currency: settings.currency,
        pricingOverrides: settings.pricingOverrides || {},
      }),
    getPaths: () => invokeCommand<DataPaths>("get_paths"),
    addCustomPath: (clientId: string, path: string) =>
      invokeCommand("add_custom_path", { clientId, path }),
    removeCustomPath: (clientId: string, path: string) =>
      invokeCommand("remove_custom_path", { clientId, path }),
  },

  scan: {
    trigger: () => invokeCommand("trigger_scan"),
  },
};
