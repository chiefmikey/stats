/* eslint-disable max-lines-per-function */

function fmt(n) {
  return n.toLocaleString('en-US');
}

function shieldUrl(type, id, metric) {
  const base = 'https://img.shields.io';
  const style = 'for-the-badge';
  const color = 'rgba(0,0,0,0)';

  const npmMetrics = {
    monthly: 'dm',
    total: 'dt',
    weekly: 'dw',
    yearly: 'dy',
  };
  const chromeMetrics = {
    rating: 'rating',
    ratingCount: 'rating-count',
    stars: 'stars',
    users: 'users',
  };

  if (type === 'npm') {
    return `${base}/npm/${npmMetrics[metric]}/${id}?color=${color}&style=${style}&label=`;
  }
  if (type === 'chrome') {
    return `${base}/chrome-web-store/${chromeMetrics[metric]}/${id}?color=${color}&style=${style}`;
  }
  return '';
}

function buildNpmCards(packages) {
  let html = '';
  for (const package_ of packages.npm) {
    html += `
                <div class="package-card">
                    <div class="package-name">${package_.name}</div>
                    <div class="package-description">${package_.description}</div>
                    <div class="package-links">
                        <a href="${package_.github}" target="_blank" rel="noreferrer">GitHub</a>
                        <a href="${package_.npm}" target="_blank" rel="noreferrer">NPM</a>
                    </div>
                    <div class="stats-row">
                        <div class="stat-badge"><img src="${shieldUrl('npm', package_.package, 'weekly')}" alt="Weekly"></div>
                        <div class="stat-badge"><img src="${shieldUrl('npm', package_.package, 'monthly')}" alt="Monthly"></div>
                        <div class="stat-badge"><img src="${shieldUrl('npm', package_.package, 'yearly')}" alt="Yearly"></div>
                        <div class="stat-badge"><img src="${shieldUrl('npm', package_.package, 'total')}" alt="Total"></div>
                    </div>
                </div>`;
  }
  return html;
}

function buildDepupRows(topDepup) {
  let html = '';
  let rank = 1;
  for (const package_ of topDepup) {
    const wFmt = package_.weekly === 0 ? '--' : fmt(package_.weekly);
    const mFmt = package_.monthly === 0 ? '--' : fmt(package_.monthly);
    const yFmt = package_.yearly === 0 ? '--' : fmt(package_.yearly);
    const statusClass =
      package_.status === 'current' ? 'status-current' : 'status-behind';
    html += `
                        <tr>
                            <td>${rank}</td>
                            <td><a href="https://www.npmjs.com/package/${package_.name}" target="_blank" rel="noreferrer">${package_.name}</a></td>
                            <td class="num">${wFmt}</td>
                            <td class="num">${mFmt}</td>
                            <td class="num">${yFmt}</td>
                            <td>${package_.depupVersion}</td>
                            <td>${package_.upstreamVersion}</td>
                            <td class="${statusClass}">${package_.status}</td>
                        </tr>`;
    rank++;
  }
  return html;
}

function buildChromeCards(packages) {
  let html = '';
  for (const extension of packages.chrome) {
    html += `
                <div class="chrome-card">
                    <h3>${extension.name}</h3>
                    <p>${extension.description}</p>
                    <div class="chrome-stats-grid">
                        <div class="stat-badge"><img src="${shieldUrl('chrome', extension.extensionId, 'rating')}" alt="Rating"></div>
                        <div class="stat-badge"><img src="${shieldUrl('chrome', extension.extensionId, 'users')}" alt="Users"></div>
                    </div>
                    <div class="chrome-link"><a href="${extension.store}" target="_blank" rel="noreferrer">View in Store</a></div>
                </div>`;
  }
  return html;
}

function generateHTML(packages, stats) {
  const updated = stats.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleString()
    : 'never';

  const depup = stats.depup || {};
  const topDepup = (depup.packages || []).slice(0, depup.topN || 25);
  const summary = depup.summary || {};

  const npmCards = buildNpmCards(packages);
  const depupRows = buildDepupRows(topDepup);
  const chromeCards = buildChromeCards(packages);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Package Statistics</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f0f2f5;
        min-height: 100vh;
        padding: 20px;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .header {
        background: #1a1a2e;
        color: white;
        padding: 40px;
        text-align: center;
      }
      .header h1 { font-size: 2.5rem; margin-bottom: 8px; font-weight: 700; }
      .header p { font-size: 1.1rem; opacity: 0.8; }
      .last-updated {
        background: rgba(255,255,255,0.1);
        padding: 8px 16px;
        border-radius: 20px;
        display: inline-block;
        margin-top: 16px;
        font-size: 0.85rem;
      }
      .section { padding: 40px; }
      .section-title {
        font-size: 1.6rem;
        margin-bottom: 24px;
        color: #1a1a2e;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 8px;
      }
      .stats-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      .package-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 24px;
        border: 1px solid #e9ecef;
      }
      .package-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .package-name { font-size: 1.2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
      .package-description { color: #6c757d; margin-bottom: 16px; line-height: 1.5; }
      .package-links a { color: #3498db; text-decoration: none; margin-right: 12px; font-weight: 500; }
      .package-links a:hover { text-decoration: underline; }
      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }
      .stat-badge {
        text-align: center;
        padding: 16px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #dee2e6;
      }
      .stat-badge img { max-width: 100%; height: 50px; width: auto; }
      .depup-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .summary-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        border: 1px solid #e9ecef;
      }
      .summary-card .label { font-size: 0.8rem; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
      .summary-card .value { font-size: 1.6rem; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
      .depup-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
      .depup-table th {
        background: #1a1a2e;
        color: white;
        padding: 10px 12px;
        text-align: left;
        font-weight: 500;
      }
      .depup-table td { padding: 8px 12px; border-bottom: 1px solid #e9ecef; }
      .depup-table tr:hover { background: #f8f9fa; }
      .depup-table .num { text-align: right; font-variant-numeric: tabular-nums; }
      .status-current { color: #27ae60; font-weight: 500; }
      .status-behind { color: #e67e22; font-weight: 500; }
      .chrome-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }
      .chrome-card {
        background: #1a1a2e;
        color: white;
        border-radius: 10px;
        padding: 24px;
        text-align: center;
      }
      .chrome-card h3 { font-size: 1.1rem; margin-bottom: 8px; }
      .chrome-card p { opacity: 0.8; font-size: 0.9rem; margin-bottom: 16px; }
      .chrome-stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }
      .chrome-card .stat-badge { background: rgba(255,255,255,0.1); border-color: transparent; }
      .chrome-link a { color: #74b9ff; text-decoration: none; font-weight: 500; }
      .chrome-link a:hover { text-decoration: underline; }
      @media (max-width: 768px) {
        .header h1 { font-size: 1.8rem; }
        .section { padding: 20px; }
        .stats-grid { grid-template-columns: 1fr; }
        .depup-table { font-size: 0.8rem; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Package Statistics</h1>
        <p>Download and usage statistics</p>
        <div class="last-updated">Last updated: ${updated}</div>
      </div>

      <div class="section">
        <h2 class="section-title">NPM Packages</h2>
        <div class="stats-grid">${npmCards}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">@depup Packages</h2>
        <p style="color: #6c757d; margin-bottom: 20px;">${packages.depup.description}</p>
        <div class="depup-summary">
          <div class="summary-card"><div class="label">Total Packages</div><div class="value">${fmt(depup.totalPackages || 0)}</div></div>
          <div class="summary-card"><div class="label">Weekly Downloads</div><div class="value">${fmt(summary.totalWeekly || 0)}</div></div>
          <div class="summary-card"><div class="label">Monthly Downloads</div><div class="value">${fmt(summary.totalMonthly || 0)}</div></div>
          <div class="summary-card"><div class="label">Yearly Downloads</div><div class="value">${fmt(summary.totalYearly || 0)}</div></div>
          <div class="summary-card"><div class="label">Current</div><div class="value">${summary.current || 0}</div></div>
          <div class="summary-card"><div class="label">Behind</div><div class="value">${summary.behind || 0}</div></div>
        </div>
        <table class="depup-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Package</th>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Yearly</th>
              <th>@depup Version</th>
              <th>Upstream Version</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${depupRows}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2 class="section-title">Chrome Web Store</h2>
        <div class="chrome-grid">${chromeCards}
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export { generateHTML };
