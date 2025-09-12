# Package Statistics Dashboard

> **Live Statistics** • **Automated Updates** • **Professional Tracking**

A comprehensive dashboard for tracking download statistics and usage metrics
across my NPM packages and Chrome Web Store extensions.

[![Live Dashboard](https://img.shields.io/badge/🌐_Live_Dashboard-View_Now-blue?style=for-the-badge&logo=github)](https://chiefmikey.github.io/stats/)
[![Last Updated](https://img.shields.io/badge/last%20updated-9%2F12%2F2025-blue?style=for-the-badge)](https://github.com/chiefmikey/stats/actions)
[![GitHub Actions](https://img.shields.io/badge/automated-GitHub%20Actions-green?style=for-the-badge&logo=github-actions)](https://github.com/chiefmikey/stats/actions)

---

## 📊 Package Statistics

### NPM Packages

<table>
<tr>
<td width="25%">

#### [Mikey Pro Style Guide](https://github.com/mikey-pro/style-guide)

_Comprehensive style guide and configuration packages_

[![Weekly](https://img.shields.io/npm/dw/mikey-pro?style=for-the-badge&label=)](https://www.npmjs.com/package/mikey-pro)
[![Monthly](https://img.shields.io/npm/dm/mikey-pro?style=for-the-badge&label=)](https://www.npmjs.com/package/mikey-pro)
[![Yearly](https://img.shields.io/npm/dy/mikey-pro?style=for-the-badge&label=)](https://www.npmjs.com/package/mikey-pro)
[![Total](https://img.shields.io/npm/dt/mikey-pro?style=for-the-badge&label=)](https://www.npmjs.com/package/mikey-pro)

</td>
<td width="25%">

#### [ESLint Plugin Disable Autofix](https://github.com/chiefmikey/eslint-plugin-disable-autofix)

_ESLint plugin to disable autofix for specific rules_

[![Weekly](https://img.shields.io/npm/dw/eslint-plugin-disable-autofix?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-plugin-disable-autofix)
[![Monthly](https://img.shields.io/npm/dm/eslint-plugin-disable-autofix?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-plugin-disable-autofix)
[![Yearly](https://img.shields.io/npm/dy/eslint-plugin-disable-autofix?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-plugin-disable-autofix)
[![Total](https://img.shields.io/npm/dt/eslint-plugin-disable-autofix?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-plugin-disable-autofix)

</td>
<td width="25%">

#### [ESLint Config React App Bump](https://github.com/chiefmikey/eslint-config-react-app-bump)

_Updated ESLint configuration for React applications_

[![Weekly](https://img.shields.io/npm/dw/eslint-config-react-app-bump?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-config-react-app-bump)
[![Monthly](https://img.shields.io/npm/dm/eslint-config-react-app-bump?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-config-react-app-bump)
[![Yearly](https://img.shields.io/npm/dy/eslint-config-react-app-bump?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-config-react-app-bump)
[![Total](https://img.shields.io/npm/dt/eslint-config-react-app-bump?style=for-the-badge&label=)](https://www.npmjs.com/package/eslint-config-react-app-bump)

</td>
</tr>
</table>

### Chrome Web Store Extensions

<table>
<tr>
<td width="50%">

#### [Tomorrow Night Darkly Theme](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik)

_Dark theme for Chrome with Tomorrow Night color scheme_

[![Rating Count](https://img.shields.io/chrome-web-store/rating-count/najhldfogkjhgdaaloddlfdgjfolnoik?style=for-the-badge)](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik)
[![Rating](https://img.shields.io/chrome-web-store/rating/najhldfogkjhgdaaloddlfdgjfolnoik?style=for-the-badge)](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik)
[![Stars](https://img.shields.io/chrome-web-store/stars/najhldfogkjhgdaaloddlfdgjfolnoik?style=for-the-badge)](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik)
[![Users](https://img.shields.io/chrome-web-store/users/najhldfogkjhgdaaloddlfdgjfolnoik?style=for-the-badge)](https://chrome.google.com/webstore/detail/tomorrow-night-darkly/najhldfogkjhgdaaloddlfdgjfolnoik)

</td>
</tr>
</table>

## ✨ Features

| Feature                    | Description                                     |
| -------------------------- | ----------------------------------------------- |
| 🔄 **Automated Updates**   | Stats refresh every 6 hours via GitHub Actions  |
| 📊 **Real-time Data**      | Live metrics from NPM and Chrome Web Store APIs |
| 🎨 **Beautiful Dashboard** | Modern, responsive HTML interface               |
| 📈 **Historical Tracking** | Data stored and tracked over time               |
| ⚙️ **Easy Management**     | Simple JSON configuration for packages          |
| 🌐 **GitHub Pages**        | Automatic deployment to live website            |
| 📱 **Mobile Responsive**   | Works perfectly on all devices                  |
| 🔗 **API Endpoints**       | JSON API for programmatic access                |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation & Usage

```bash
# Clone the repository
git clone https://github.com/chiefmikey/stats.git
cd stats

# Install dependencies
npm install

# Update stats manually
npm run update

# Start development server (with auto-refresh)
npm run dev

# Build for production
npm run build
```

### Available Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start development server with auto-refresh |
| `npm run update` | Manually update all package statistics     |
| `npm run build`  | Build static files for deployment          |
| `npm start`      | Start production server                    |

## ⚙️ Configuration

### Adding New Packages

Edit `src/packages.json` to add or remove packages:

```json
{
  "npm": [
    {
      "name": "Your Package Name",
      "package": "your-package-name",
      "github": "https://github.com/username/repo",
      "npm": "https://www.npmjs.com/package/your-package-name",
      "description": "Brief description of your package"
    }
  ],
  "chrome": [
    {
      "name": "Your Extension Name",
      "extensionId": "your-extension-id",
      "github": "https://github.com/username/repo",
      "store": "https://chrome.google.com/webstore/detail/your-extension-id",
      "description": "Brief description of your extension"
    }
  ]
}
```

### Package Configuration Options

| Field                   | Required | Description                             |
| ----------------------- | -------- | --------------------------------------- |
| `name`                  | ✅       | Display name for the package/extension  |
| `package`/`extensionId` | ✅       | NPM package name or Chrome extension ID |
| `github`                | ✅       | GitHub repository URL                   |
| `npm`/`store`           | ✅       | NPM or Chrome Web Store URL             |
| `description`           | ✅       | Brief description for display           |

## 📊 Data & Analytics

### Data Storage

- **Location**: `data/stats.json`
- **Format**: JSON with timestamps
- **Retention**: Historical data preserved indefinitely

### Metrics Tracked

#### NPM Packages

- Weekly downloads
- Monthly downloads
- Yearly downloads
- Total downloads (all-time)

#### Chrome Extensions

- Rating count
- Average rating
- Star rating
- User count

### API Endpoints

| Endpoint       | Description                     | Method |
| -------------- | ------------------------------- | ------ |
| `/api.json`    | Complete package and stats data | GET    |
| `/api/stats`   | Historical stats data only      | GET    |
| `/api/refresh` | Trigger stats refresh           | POST   |

## 🔄 Automation & Deployment

### GitHub Actions Workflow

- **Schedule**: Every 6 hours (0 _/6_ \*\*)
- **Triggers**: Manual dispatch, package config changes
- **Deployment**: Automatic GitHub Pages deployment
- **Status**:
  [![GitHub Actions](https://img.shields.io/badge/automated-GitHub%20Actions-green?style=for-the-badge&logo=github-actions)](https://github.com/chiefmikey/stats/actions)

### Deployment Process

1. **Stats Collection**: Fetches latest data from APIs
2. **Data Processing**: Updates historical records
3. **Dashboard Generation**: Creates HTML and README
4. **GitHub Pages**: Automatically deploys to live site

## 🛠️ Development

### Project Structure

```
stats/
├── src/
│   ├── packages.json      # Package configuration
│   ├── stats-collector.js # Main collection logic
│   ├── update-stats.js    # Update script
│   ├── index.js          # Development server
│   └── build.js          # Build script
├── data/
│   └── stats.json        # Historical data
├── .github/workflows/
│   └── update-stats.yml  # GitHub Actions
├── index.html            # Generated dashboard
└── README.md             # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run dev`
5. Submit a pull request

## 📈 Performance

- **Update Frequency**: Every 6 hours
- **API Rate Limiting**: Built-in delays to respect API limits
- **Error Handling**: Graceful fallbacks for failed requests
- **Caching**: Efficient data storage and retrieval

## 🔗 Links

- **Live Dashboard**:
  [https://chiefmikey.github.io/stats/](https://chiefmikey.github.io/stats/)
- **GitHub Repository**:
  [https://github.com/chiefmikey/stats](https://github.com/chiefmikey/stats)
- **GitHub Actions**:
  [https://github.com/chiefmikey/stats/actions](https://github.com/chiefmikey/stats/actions)

---

<div align="center">

**Built with ❤️ by [Mikl Wolfe](https://mikl.io)**

_Last updated: 9/12/2025, 12:50:41 PM_

</div>
