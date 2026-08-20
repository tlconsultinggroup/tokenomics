import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { api } from "../lib/api";
import { useTaskbarThresholds } from "../lib/hooks/useTaskbarThresholds";

const ICON_PATHS = {
  green: "/status-icons/green.png",
  amber: "/status-icons/amber.png",
  red: "/status-icons/red.png",
} as const;

type Level = keyof typeof ICON_PATHS;

function levelFor(tokens: number, amberThreshold: number, redThreshold: number): Level {
  if (tokens >= redThreshold) return "red";
  if (tokens >= amberThreshold) return "amber";
  return "green";
}

// No visual output - just keeps the OS taskbar/window icon color in sync
// with how busy the current hour has been. Shares the "daily" query cache
// with the Daily tab, but polls independently so the icon updates even
// while the user is on a different tab.
export default function TaskbarIconStatus() {
  const amberThreshold = useTaskbarThresholds((s) => s.amberThreshold);
  const redThreshold = useTaskbarThresholds((s) => s.redThreshold);

  const { data } = useQuery({
    queryKey: ["dashboard", "daily"],
    queryFn: () => api.data.getDaily(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const lastLevel = useRef<Level | null>(null);

  useEffect(() => {
    const timeSeries = data?.timeSeries;
    if (!timeSeries || timeSeries.length === 0) return;

    const currentHourTokens = timeSeries[timeSeries.length - 1].totalTokens;
    const level = levelFor(currentHourTokens, amberThreshold, redThreshold);

    if (level === lastLevel.current) return;
    lastLevel.current = level;

    fetch(ICON_PATHS[level])
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const bytes = new Uint8Array(buf);
        // getCurrentWindow().setIcon() only updates ICON_SMALL on Windows
        // (title bar / Alt+Tab) - it never reaches ICON_BIG, which is what
        // the taskbar button itself reads. set_taskbar_icon sends
        // WM_SETICON for both slots directly so the taskbar stays in sync.
        return Promise.all([getCurrentWindow().setIcon(bytes), api.system.setTaskbarIcon(bytes)]);
      })
      .catch((err) => console.error("Could not update taskbar icon:", err));
  }, [data, amberThreshold, redThreshold]);

  return null;
}
