# Tokenomics

A lightweight Tauri desktop app for tracking LLM token usage and costs across the AI coding tools you use locally, no cloud, no accounts, no telemetry. Everything is parsed from local session files on your own machine and never leaves it.

## What it does

Tokenomics scans the local session logs of AI coding tools already installed on your machine and turns them into a cost and token dashboard:

- **Daily** tab: rolling 5-hour window
- **Weekly** tab: rolling 7-day window
- **Monthly** tab: current calendar month

Each tab shows total cost, total tokens (including cache reads/writes), session count, and a per-model breakdown with provider, tokens in, tokens out, and cost.

By default, Tokenomics scans for:

- Claude Code
- OpenCode
- Cursor
- GitHub Copilot CLI

Additional tools can be enabled through the settings panel; the underlying scanner supports a wide range of local AI coding tools beyond the defaults above.

## Development

Requires Node.js and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS (Rust toolchain, platform build tools).

```bash
npm install
npm run tauri dev
```

This compiles and launches the Rust backend, starts the frontend dev server, and opens the desktop app window with hot reload on both sides. Don't use `npm run dev` alone for the full app; that only starts the frontend dev server with no backend behind it.

### Other scripts

```bash
npm run lint        # ESLint over src/
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit tests
```

Rust tests live under `src-tauri/` and run with `cargo test` from that directory.

## Building a release binary

```bash
npm run tauri build
```

The built binary is self-contained; it does not require any other repository or external service to run.

## Architecture

- **Backend**: Rust (Tauri 2). Local file scanning, parsing, and cost aggregation logic lives in `src-tauri/tokenomics-core`, a fully self-contained crate vendored into this repository, plus the Tauri command layer in `src-tauri/src`.
- **Frontend**: React 19 + TypeScript, built with Vite.
- **Storage**: settings are stored locally at `%APPDATA%/tokenomics/settings.json` on Windows (the OS-appropriate config directory elsewhere). No data is sent anywhere.

## License

Apache 2.0
