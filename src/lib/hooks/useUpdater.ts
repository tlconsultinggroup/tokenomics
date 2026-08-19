import { create } from "zustand";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type UpdateStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "up-to-date" }
  | { state: "available"; version: string; body?: string }
  | { state: "downloading"; progress: number }
  | { state: "ready" }
  | { state: "error"; message: string };

interface UpdaterState {
  status: UpdateStatus;
  pendingUpdate: Update | null;
  bannerDismissed: boolean;
  checkForUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  dismissBanner: () => void;
}

// A single shared store (not per-component state) so the auto-check on
// launch, the sticky top banner, and the manual "Check for updates" button
// in Tools & Config all read/drive the same in-flight check instead of each
// firing its own redundant request.
export const useUpdaterStore = create<UpdaterState>((set, get) => ({
  status: { state: "idle" },
  pendingUpdate: null,
  bannerDismissed: false,

  checkForUpdate: async () => {
    set({ status: { state: "checking" } });
    try {
      const update = await check();
      if (!update) {
        set({ status: { state: "up-to-date" } });
        return;
      }
      set({
        pendingUpdate: update,
        status: { state: "available", version: update.version, body: update.body },
        bannerDismissed: false,
      });
    } catch (e) {
      set({ status: { state: "error", message: e instanceof Error ? e.message : String(e) } });
    }
  },

  installUpdate: async () => {
    const { pendingUpdate } = get();
    if (!pendingUpdate) return;
    try {
      let downloaded = 0;
      let total = 0;
      await pendingUpdate.downloadAndInstall((event) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          set({ status: { state: "downloading", progress: total > 0 ? downloaded / total : 0 } });
        } else if (event.event === "Finished") {
          set({ status: { state: "ready" } });
        }
      });
      await relaunch();
    } catch (e) {
      set({ status: { state: "error", message: e instanceof Error ? e.message : String(e) } });
    }
  },

  dismissBanner: () => set({ bannerDismissed: true }),
}));

export function useUpdater() {
  const status = useUpdaterStore((s) => s.status);
  const checkForUpdate = useUpdaterStore((s) => s.checkForUpdate);
  const installUpdate = useUpdaterStore((s) => s.installUpdate);
  return { status, checkForUpdate, installUpdate };
}
