# Project CLAUDE.md - Stats

## Project Overview

Automated stats tracking for npm packages and Chrome Web Store extensions — scrapes and aggregates download/install counts.

## Tech Stack

- **Language:** JavaScript (ESM)
- **Runtime:** Node.js
- **Dependencies:** axios, cheerio, node-cron
- **Linting:** mikey-pro (ESLint + Prettier + Stylelint)

## Architecture

```
src/
  index.js              # Main entry point
  build.js              # Build script
  update-stats.js       # Stats update logic
  stats-collector.js    # Data collection from npm/Chrome Web Store
  packages.json         # Package list to track
data/
  stats.json            # Collected stats output
api.json                # API configuration
index.html              # Stats display page
eslint.config.js        # ESLint flat config
```

## Commands

```bash
npm start               # Run stats collector (node src/index.js)
npm run dev             # Run in watch mode
npm run build           # Build (node src/build.js)
npm run update          # Update stats (node src/update-stats.js)
```

## Conventions

- ESM (`"type": "module"`)
- Prettier via `mikey-pro/prettier`
- Stylelint via `mikey-pro/stylelint`
- Conventional commits

## Testing

No tests currently (`npm test` is a no-op).
