import { useCallback, useState } from "react";
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

export function useUpdater() {
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);

  const checkForUpdate = useCallback(async () => {
    setStatus({ state: "checking" });
    try {
      const update = await check();
      if (!update) {
        setStatus({ state: "up-to-date" });
        return;
      }
      setPendingUpdate(update);
      setStatus({ state: "available", version: update.version, body: update.body });
    } catch (e) {
      setStatus({ state: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (!pendingUpdate) return;
    try {
      let downloaded = 0;
      let total = 0;
      await pendingUpdate.downloadAndInstall((event) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          setStatus({ state: "downloading", progress: total > 0 ? downloaded / total : 0 });
        } else if (event.event === "Finished") {
          setStatus({ state: "ready" });
        }
      });
      await relaunch();
    } catch (e) {
      setStatus({ state: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, [pendingUpdate]);

  return { status, checkForUpdate, installUpdate };
}
