const fs = require('node:fs');
const path = require('node:path');

const axios = require('axios');
const cheerio = require('cheerio');

class StatsCollector {
  constructor() {
    this.packages = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'packages.json')),
    );
    this.statsData = this.loadStatsData();
  }

  loadStatsData() {
    const statsFile = path.join(__dirname, '..', 'data', 'stats.json');
    if (fs.existsSync(statsFile)) {
      return JSON.parse(fs.readFileSync(statsFile));
    }
    return {
      npm: {},
      chrome: {},
      lastUpdated: null,
    };
  }

  saveStatsData() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.statsData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(
      path.join(dataDir, 'stats.json'),
      JSON.stringify(this.statsData, null, 2),
    );
  }

  async fetchNpmStats(packageName) {
    try {
      const response = await axios.get(
        `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
      );
      const weekly = response.data.downloads || 0;

      const monthlyResponse = await axios.get(
        `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
      );
      const monthly = monthlyResponse.data.downloads || 0;

      const yearlyResponse = await axios.get(
        `https://api.npmjs.org/downloads/point/last-year/${packageName}`,
      );
      const yearly = yearlyResponse.data.downloads || 0;

      const totalResponse = await axios.get(
        `https://api.npmjs.org/downloads/point/2020-01-01:${
          new Date().toISOString().split('T')[0]
        }/${packageName}`,
      );
      const total = totalResponse.data.downloads || 0;

      return { weekly, monthly, yearly, total };
    } catch (error) {
      console.error(
        `Error fetching npm stats for ${packageName}:`,
        error.message,
      );
      return { weekly: 0, monthly: 0, yearly: 0, total: 0 };
    }
  }

  async fetchChromeStats(extensionId) {
    try {
      const response = await axios.get(
        `https://chrome.google.com/webstore/detail/${extensionId}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
      );

      const $ = cheerio.load(response.data);

      // Extract stats from the page
      const ratingCount =
        this.extractNumber($('span[jsname="V67aGc"]').text()) || 0;
      const rating =
        Number.parseFloat($('span[jsname="V67aGc"]').next().text()) || 0;
      const users = this.extractNumber($('span:contains("users")').text()) || 0;

      return { ratingCount, rating, users };
    } catch (error) {
      console.error(
        `Error fetching Chrome stats for ${extensionId}:`,
        error.message,
      );
      return { ratingCount: 0, rating: 0, users: 0 };
    }
  }

  extractNumber(text) {
    const match = text.match(/[\d,]+/);
    return match ? Number.parseInt(match[0].replaceAll(',', '')) : 0;
  }

  async collectAllStats() {
    console.log('Collecting npm package stats...');

    for (const package_ of this.packages.npm) {
      console.log(`Fetching stats for ${package_.package}...`);
      const stats = await this.fetchNpmStats(package_.package);
      this.statsData.npm[package_.package] = {
        ...stats,
        name: package_.name,
        github: package_.github,
        npm: package_.npm,
        description: package_.description,
        lastFetched: new Date().toISOString(),
      };

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('Collecting Chrome Web Store stats...');

    for (const extension of this.packages.chrome) {
      console.log(`Fetching stats for ${extension.name}...`);
      const stats = await this.fetchChromeStats(extension.extensionId);
      this.statsData.chrome[extension.extensionId] = {
        ...stats,
        name: extension.name,
        github: extension.github,
        store: extension.store,
        description: extension.description,
        lastFetched: new Date().toISOString(),
      };

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    this.saveStatsData();
    console.log('Stats collection completed!');
  }

  generateShieldUrl(type, packageName, metric) {
    const baseUrl = 'https://img.shields.io';
    const color = 'rgba(0,0,0,0)';
    const style = 'for-the-badge';

    switch (type) {
      case 'npm': {
        const npmMetrics = {
          weekly: 'dw',
          monthly: 'dm',
          yearly: 'dy',
          total: 'dt',
        };
        return `${baseUrl}/npm/${npmMetrics[metric]}/${packageName}?color=${color}&style=${style}&label=`;
      }

      case 'chrome': {
        const chromeMetrics = {
          ratingCount: 'rating-count',
          rating: 'rating',
          users: 'users',
          stars: 'stars',
        };
        return `${baseUrl}/chrome-web-store/${chromeMetrics[metric]}/${packageName}?color=${color}&style=${style}`;
      }

      default: {
        return '';
      }
    }
  }

  generateHTML() {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Statistics Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .last-updated {
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 20px;
            font-size: 0.9rem;
        }

        .section {
            padding: 40px;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 30px;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }

        .stats-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .package-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            border: 1px solid #e9ecef;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .package-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .package-name {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .package-description {
            color: #6c757d;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .package-links {
            margin-bottom: 20px;
        }

        .package-links a {
            color: #3498db;
            text-decoration: none;
            margin-right: 15px;
            font-weight: 500;
        }

        .package-links a:hover {
            text-decoration: underline;
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }

        .stat-badge {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }

        .stat-badge img {
            max-width: 100%;
            height: auto;
        }

        .chrome-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .chrome-card {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
        }

        .chrome-card h3 {
            font-size: 1.2rem;
            margin-bottom: 15px;
        }

        .chrome-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }

            .section {
                padding: 20px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Package Statistics</h1>
            <p>Real-time download and usage statistics for my packages</p>
            <div class="last-updated">
                Last updated: ${new Date(
                  this.statsData.lastUpdated,
                ).toLocaleString()}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📦 NPM Packages</h2>
            <div class="stats-grid">`;

    // Generate NPM packages section
    for (const package_ of this.packages.npm) {
      const stats = this.statsData.npm[package_.package] || {};
      html += `
                <div class="package-card">
                    <div class="package-name">${package_.name}</div>
                    <div class="package-description">${
                      package_.description
                    }</div>
                    <div class="package-links">
                        <a href="${package_.github}" target="_blank">GitHub</a>
                        <a href="${package_.npm}" target="_blank">NPM</a>
                    </div>
                    <div class="stats-row">
                        <div class="stat-badge">
                            <img src="${this.generateShieldUrl(
                              'npm',
                              package_.package,
                              'weekly',
                            )}" alt="Weekly downloads">
                        </div>
                        <div class="stat-badge">
                            <img src="${this.generateShieldUrl(
                              'npm',
                              package_.package,
                              'monthly',
                            )}" alt="Monthly downloads">
                        </div>
                        <div class="stat-badge">
                            <img src="${this.generateShieldUrl(
                              'npm',
                              package_.package,
                              'yearly',
                            )}" alt="Yearly downloads">
                        </div>
                        <div class="stat-badge">
                            <img src="${this.generateShieldUrl(
                              'npm',
                              package_.package,
                              'total',
                            )}" alt="Total downloads">
                        </div>
                    </div>
                </div>`;
    }

    html += `
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🌐 Chrome Web Store</h2>
            <div class="chrome-stats">`;

    // Generate Chrome extensions section
    for (const extension of this.packages.chrome) {
      html += `
                <div class="chrome-card">
                    <h3>${extension.name}</h3>
                    <p style="margin-bottom: 20px; opacity: 0.9;">${
                      extension.description
                    }</p>
                    <div class="chrome-stats-grid">
                        <div class="stat-badge" style="background: rgba(255,255,255,0.2);">
                            <img src="${this.generateShieldUrl(
                              'chrome',
                              extension.extensionId,
                              'ratingCount',
                            )}" alt="Rating count">
                        </div>
                        <div class="stat-badge" style="background: rgba(255,255,255,0.2);">
                            <img src="${this.generateShieldUrl(
                              'chrome',
                              extension.extensionId,
                              'rating',
                            )}" alt="Rating">
                        </div>
                        <div class="stat-badge" style="background: rgba(255,255,255,0.2);">
                            <img src="${this.generateShieldUrl(
                              'chrome',
                              extension.extensionId,
                              'stars',
                            )}" alt="Stars">
                        </div>
                        <div class="stat-badge" style="background: rgba(255,255,255,0.2);">
                            <img src="${this.generateShieldUrl(
                              'chrome',
                              extension.extensionId,
                              'users',
                            )}" alt="Users">
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <a href="${
                          extension.store
                        }" target="_blank" style="color: white; text-decoration: none; font-weight: 500;">View in Store</a>
                    </div>
                </div>`;
    }

    html += `
            </div>
        </div>
    </div>
</body>
</html>`;

    return html;
  }
}

module.exports = StatsCollector;
