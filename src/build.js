#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const StatsCollector = require('./stats-collector');

async function build() {
  console.log('🔨 Building stats dashboard...');

  const collector = new StatsCollector();

  try {
    // Collect fresh stats
    console.log('📊 Collecting latest statistics...');
    await collector.collectAllStats();

    // Generate HTML dashboard
    console.log('🎨 Generating HTML dashboard...');
    const html = collector.generateHTML();
    fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html);

    // Generate markdown README
    console.log('📝 Generating README...');
    const markdown = generateMarkdown(collector);
    fs.writeFileSync(path.join(__dirname, '..', 'README.md'), markdown);

    // Generate a simple JSON API endpoint
    console.log('🔌 Generating API endpoint...');
    const apiData = {
      packages: collector.packages,
      stats: collector.statsData,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(__dirname, '..', 'api.json'),
      JSON.stringify(apiData, null, 2),
    );

    console.log('✅ Build completed successfully!');
    console.log('📁 Generated files:');
    console.log('   - index.html (Dashboard)');
    console.log('   - README.md (Documentation)');
    console.log('   - api.json (API data)');
    console.log('   - data/stats.json (Historical data)');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

function generateMarkdown(collector) {
  let md = `# 📊 Package Statistics Dashboard

Real-time download and usage statistics for my packages and extensions.

![Last Updated](https://img.shields.io/badge/last%20updated-${encodeURIComponent(
    new Date().toLocaleDateString(),
  )}-blue?style=for-the-badge)

## 📦 NPM Packages

| Package | Weekly | Monthly | Yearly | Total |
|---------|--------|---------|--------|-------|`;

  for (const package_ of collector.packages.npm) {
    md += `\n| [**${package_.name}**](${package_.github}) | ![Weekly](https://img.shields.io/npm/dw/${package_.package}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Monthly](https://img.shields.io/npm/dm/${package_.package}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Yearly](https://img.shields.io/npm/dy/${package_.package}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Total](https://img.shields.io/npm/dt/${package_.package}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) |`;
  }

  md += `\n\n## 🌐 Chrome Web Store Extensions

| Extension | Rating Count | Rating | Stars | Users |
|-----------|--------------|--------|-------|-------|`;

  for (const extension of collector.packages.chrome) {
    md += `\n| [**${extension.name}**](${extension.store}) | ![Rating Count](https://img.shields.io/chrome-web-store/rating-count/${extension.extensionId}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Rating](https://img.shields.io/chrome-web-store/rating/${extension.extensionId}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Stars](https://img.shields.io/chrome-web-store/stars/${extension.extensionId}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Users](https://img.shields.io/chrome-web-store/users/${extension.extensionId}?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) |`;
  }

  md += `\n\n## 🚀 Features

- **Automated Updates**: Stats are automatically updated via GitHub Actions
- **Real-time Data**: Live data from NPM and Chrome Web Store APIs
- **Beautiful Dashboard**: Modern, responsive HTML dashboard
- **Historical Tracking**: Data is stored and tracked over time
- **Easy Management**: Simple JSON configuration for adding/removing packages
- **API Endpoint**: JSON API for programmatic access

## 📈 Usage

\`\`\`bash
# Install dependencies
npm install

# Update stats manually
npm run update

# Start development server
npm run dev

# Build static files
npm run build
\`\`\`

## 🔧 Configuration

Edit \`src/packages.json\` to add or remove packages:

\`\`\`json
{
  "npm": [
    {
      "name": "Package Name",
      "package": "package-name",
      "github": "https://github.com/user/repo",
      "npm": "https://www.npmjs.com/package/package-name",
      "description": "Package description"
    }
  ],
  "chrome": [
    {
      "name": "Extension Name",
      "extensionId": "extension-id",
      "github": "https://github.com/user/repo",
      "store": "https://chrome.google.com/webstore/detail/extension-id",
      "description": "Extension description"
    }
  ]
}
\`\`\`

## 📊 Data Storage

Historical data is stored in \`data/stats.json\` and includes:
- Download counts (weekly, monthly, yearly, total)
- Chrome Web Store metrics (ratings, users, etc.)
- Timestamps for tracking trends
- Package metadata

## 🌐 API

The dashboard provides a simple JSON API:

- \`/api.json\` - Complete package and stats data
- \`/api/stats\` - Historical stats data only
- \`/api/refresh\` - Trigger stats refresh (POST)

## 🔄 Automation

This repository is set up with GitHub Actions to automatically update stats every 6 hours and deploy the dashboard to GitHub Pages.

---

*Last updated: ${new Date().toLocaleString()}*
`;

  return md;
}

if (require.main === module) {
  build();
}
