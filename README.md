# 📊 Package Statistics Dashboard

Real-time download and usage statistics for my packages and extensions.

![Last Updated](https://img.shields.io/badge/last%20updated-9%2F12%2F2025-blue?style=for-the-badge)

## 📦 NPM Packages

| Package | Weekly | Monthly | Yearly | Total |
|---------|--------|---------|--------|-------|
| [**Mikey Pro Style Guide**](https://github.com/mikey-pro/style-guide) | ![Weekly](https://img.shields.io/npm/dw/mikey-pro?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Monthly](https://img.shields.io/npm/dm/mikey-pro?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Yearly](https://img.shields.io/npm/dy/mikey-pro?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Total](https://img.shields.io/npm/dt/mikey-pro?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) |
| [**ESLint Plugin Disable Autofix**](https://github.com/chiefmikey/eslint-plugin-disable-autofix) | ![Weekly](https://img.shields.io/npm/dw/eslint-plugin-disable-autofix?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Monthly](https://img.shields.io/npm/dm/eslint-plugin-disable-autofix?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Yearly](https://img.shields.io/npm/dy/eslint-plugin-disable-autofix?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Total](https://img.shields.io/npm/dt/eslint-plugin-disable-autofix?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) |
| [**ESLint Config React App Bump**](https://github.com/chiefmikey/eslint-config-react-app-bump) | ![Weekly](https://img.shields.io/npm/dw/eslint-config-react-app-bump?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Monthly](https://img.shields.io/npm/dm/eslint-config-react-app-bump?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Yearly](https://img.shields.io/npm/dy/eslint-config-react-app-bump?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) | ![Total](https://img.shields.io/npm/dt/eslint-config-react-app-bump?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge&label=) |

## 🌐 Chrome Web Store Extensions

| Extension | Rating Count | Rating | Stars | Users |
|-----------|--------------|--------|-------|-------|
| [**Tomorrow Night Darkly Theme**](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik) | ![Rating Count](https://img.shields.io/chrome-web-store/rating-count/najhldfogkjhgdaaloddlfdgjfolnoik?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Rating](https://img.shields.io/chrome-web-store/rating/najhldfogkjhgdaaloddlfdgjfolnoik?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Stars](https://img.shields.io/chrome-web-store/stars/najhldfogkjhgdaaloddlfdgjfolnoik?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) | ![Users](https://img.shields.io/chrome-web-store/users/najhldfogkjhgdaaloddlfdgjfolnoik?color=rgba%280%2C0%2C0%2C0%29&style=for-the-badge) |

## 🚀 Features

- **Automated Updates**: Stats are automatically updated via GitHub Actions
- **Real-time Data**: Live data from NPM and Chrome Web Store APIs
- **Beautiful Dashboard**: Modern, responsive HTML dashboard
- **Historical Tracking**: Data is stored and tracked over time
- **Easy Management**: Simple JSON configuration for adding/removing packages
- **API Endpoint**: JSON API for programmatic access

## 📈 Usage

```bash
# Install dependencies
npm install

# Update stats manually
npm run update

# Start development server
npm run dev

# Build static files
npm run build
```

## 🔧 Configuration

Edit `src/packages.json` to add or remove packages:

```json
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
```

## 📊 Data Storage

Historical data is stored in `data/stats.json` and includes:
- Download counts (weekly, monthly, yearly, total)
- Chrome Web Store metrics (ratings, users, etc.)
- Timestamps for tracking trends
- Package metadata

## 🌐 API

The dashboard provides a simple JSON API:

- `/api.json` - Complete package and stats data
- `/api/stats` - Historical stats data only
- `/api/refresh` - Trigger stats refresh (POST)

## 🔄 Automation

This repository is set up with GitHub Actions to automatically update stats every 6 hours and deploy the dashboard to GitHub Pages.

---

*Last updated: 9/12/2025, 1:44:42 PM*
