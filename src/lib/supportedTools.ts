export function formatToolNames(toolIds?: string[]): string {
  if (!toolIds || toolIds.length === 0) return "—";
  return toolIds
    .map((id) => {
      const found = SUPPORTED_TOOLS.find((t) => t.id === id);
      if (found) return found.name;
      return id.charAt(0).toUpperCase() + id.slice(1);
    })
    .join(", ");
}

export interface SupportedTool {
  id: string;
  name: string;
  category: "CLI" | "IDE" | "Desktop" | "Agent";
  description: string;
  defaultPath: string;
  logFormat: string;
}

export const SUPPORTED_TOOLS: SupportedTool[] = [
  {
    id: "claude",
    name: "Claude Code",
    category: "CLI",
    description: "Anthropic's official Claude Code terminal coding assistant",
    defaultPath: "~/.claude/projects",
    logFormat: "*.jsonl transcripts",
  },
  {
    id: "opencode",
    name: "OpenCode",
    category: "CLI",
    description: "Open-source AI coding assistant CLI & web interface",
    defaultPath: "AppData/Roaming/opencode/storage/message",
    logFormat: "*.json message logs",
  },
  {
    id: "cursor",
    name: "Cursor IDE",
    category: "IDE",
    description: "AI-first code editor built on VS Code",
    defaultPath: "~/.config/tokscale/cursor-cache",
    logFormat: "usage*.csv & sqlite state",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: "CLI",
    description: "GitHub Copilot CLI and OpenTelemetry session traces",
    defaultPath: "~/.copilot/otel",
    logFormat: "*.jsonl telemetry logs",
  },
  {
    id: "codex",
    name: "Codex CLI",
    category: "CLI",
    description: "OpenAI Codex CLI workspace sessions",
    defaultPath: "~/.codex/sessions",
    logFormat: "*.jsonl session logs",
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    category: "CLI",
    description: "Google Gemini CLI developer assistant",
    defaultPath: "~/.gemini/tmp",
    logFormat: "*.json & *.jsonl",
  },
  {
    id: "roocode",
    name: "Roo Code",
    category: "IDE",
    description: "Roo Code (formerly Roo Cline) VS Code AI coding extension",
    defaultPath: "VS Code extension storage",
    logFormat: "*.json task storage",
  },
  {
    id: "cline",
    name: "Cline",
    category: "IDE",
    description: "Autonomous AI coding agent extension for VS Code",
    defaultPath: "VS Code extension storage",
    logFormat: "*.json task logs",
  },
  {
    id: "trae",
    name: "Trae IDE",
    category: "IDE",
    description: "ByteDance Trae AI IDE",
    defaultPath: "Trae app data directory",
    logFormat: "*.json chat history",
  },
  {
    id: "zed",
    name: "Zed Editor",
    category: "IDE",
    description: "High-performance Zed editor AI assistant",
    defaultPath: "~/.config/zed",
    logFormat: "assistant thread logs",
  },
  {
    id: "warp",
    name: "Warp Terminal",
    category: "CLI",
    description: "Warp Terminal AI assistant",
    defaultPath: "Warp session history",
    logFormat: "aggregate usage JSON",
  },
  {
    id: "goose",
    name: "Goose Agent",
    category: "Agent",
    description: "Block's open-source developer agent",
    defaultPath: "~/.local/share/goose/sessions/sessions.db",
    logFormat: "sessions.db SQLite database",
  },
  {
    id: "hermes",
    name: "Hermes Agent",
    category: "Agent",
    description: "Hermes autonomous developer agent",
    defaultPath: "~/.hermes/state.db",
    logFormat: "state.db SQLite database",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    category: "Agent",
    description: "OpenClaw autonomous agent framework",
    defaultPath: "~/.openclaw/sessions",
    logFormat: "*.json session logs",
  },
  {
    id: "codebuff",
    name: "Codebuff",
    category: "Agent",
    description: "Codebuff CLI coding assistant",
    defaultPath: "~/.codebuff",
    logFormat: "*.json logs",
  },
  {
    id: "cherrystudio",
    name: "Cherry Studio",
    category: "Desktop",
    description: "Desktop client for LLM assistant models",
    defaultPath: "Cherry Studio app storage",
    logFormat: "*.json & SQLite",
  },
  {
    id: "devin-cli",
    name: "Devin CLI",
    category: "Agent",
    description: "Cognition Devin CLI agent",
    defaultPath: "~/.devin/sessions",
    logFormat: "*.json session logs",
  },
  {
    id: "qwen",
    name: "Qwen CLI",
    category: "CLI",
    description: "Alibaba Qwen CLI code model assistant",
    defaultPath: "~/.qwen/history",
    logFormat: "*.json",
  },
  {
    id: "kimi",
    name: "Kimi CLI",
    category: "CLI",
    description: "Moonshot Kimi CLI assistant",
    defaultPath: "~/.kimi/history",
    logFormat: "*.json",
  },
  {
    id: "antigravity",
    name: "Antigravity",
    category: "Agent",
    description: "Antigravity AI coding agent",
    defaultPath: "~/.antigravity",
    logFormat: "*.json / *.db",
  },
  {
    id: "augment",
    name: "Augment Code",
    category: "IDE",
    description: "Augment Code developer assistant",
    defaultPath: "Augment local logs",
    logFormat: "*.json",
  },
  {
    id: "prime-agent",
    name: "Prime Agent",
    category: "Agent",
    description: "Prime Agent developer workflow agent",
    defaultPath: "~/.prime/agent",
    logFormat: "*.json",
  },
];
