# Project CLAUDE.md - Stats

## Overview

Automated stats tracking for npm packages, @depup scoped packages, and Chrome Web Store extensions.

## Tech Stack

- Node.js 22 (ESM)
- No runtime dependencies (uses native fetch)
- mikey-pro for linting/formatting

## Architecture

```text
src/
  statsCollector.js     # Data collection -- npm API, @depup discovery
  generateHtml.js       # HTML dashboard generator
  generateReadme.js     # README markdown generator
  updateStats.js        # CLI entry point for stats update
  build.js              # Full build (stats + html + readme + api.json)
  index.js              # Dev server with auto-refresh
  packages.json         # Package list config
data/
  stats.json            # Collected stats (committed by CI)
index.html              # Generated dashboard (committed by CI)
```

## Commands

```bash
npm run update          # Collect stats, generate HTML + README
npm run build           # Same as update + api.json
npm run dev             # Dev server with 5-min auto-refresh
npm start               # One-shot update + exit
```

## Key Details

- @depup packages are discovered dynamically via npm search API (900+ packages)
- Only top 25 @depup packages by monthly downloads shown in tables
- Personal npm packages tracked from static list in packages.json
- GitHub Actions runs every 6 hours, commits changes, deploys to GitHub Pages
- No runtime deps -- uses native fetch (Node 18+)

## Conventions

- ESM only
- Prettier via mikey-pro/prettier
- No emojis
- Conventional commits
