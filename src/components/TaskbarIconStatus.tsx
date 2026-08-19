import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { api } from "../lib/api";

const ICON_PATHS = {
  green: "/status-icons/green.png",
  amber: "/status-icons/amber.png",
  red: "/status-icons/red.png",
} as const;

type Level = keyof typeof ICON_PATHS;

// Current-hour token volume (input + output + cache) thresholds for the
// taskbar icon color. These are estimates, not measured team baselines -
// adjust if green/amber/red don't line up with what "low/medium/high"
// actually looks like for your usage.
const AMBER_THRESHOLD = 30_000;
const RED_THRESHOLD = 150_000;

function levelFor(tokens: number): Level {
  if (tokens >= RED_THRESHOLD) return "red";
  if (tokens >= AMBER_THRESHOLD) return "amber";
  return "green";
}

// No visual output - just keeps the OS taskbar/window icon color in sync
// with how busy the current hour has been. Shares the "daily" query cache
// with the Daily tab, but polls independently so the icon updates even
// while the user is on a different tab.
export default function TaskbarIconStatus() {
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
    const level = levelFor(currentHourTokens);

    if (level === lastLevel.current) return;
    lastLevel.current = level;

    fetch(ICON_PATHS[level])
      .then((res) => res.arrayBuffer())
      .then((buf) => getCurrentWindow().setIcon(new Uint8Array(buf)))
      .catch((err) => console.error("Could not update taskbar icon:", err));
  }, [data]);

  return null;
}
