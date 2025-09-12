#!/usr/bin/env node

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const StatsCollector = require('./stats-collector');

class StatsServer {
  constructor(port = 3000) {
    this.port = port;
    this.collector = new StatsCollector();
  }

  async start() {
    console.log('🚀 Starting Stats Dashboard Server...');

    // Generate initial HTML
    await this.updateDashboard();

    const server = http.createServer((request, res) => {
      this.handleRequest(request, res);
    });

    server.listen(this.port, () => {
      console.log(`📊 Dashboard running at http://localhost:${this.port}`);
      console.log('Press Ctrl+C to stop');
    });

    // Auto-refresh every 5 minutes
    setInterval(
      async () => {
        console.log('🔄 Auto-refreshing stats...');
        await this.updateDashboard();
      },
      5 * 60 * 1000,
    );
  }

  async handleRequest(request, res) {
    const { url } = request;

    switch (url) {
      case '/':
      case '/index.html': {
        try {
          const html = fs.readFileSync(
            path.join(__dirname, '..', 'index.html'),
            'utf8',
          );
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
        } catch {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Dashboard not found. Run npm run update first.');
        }

        break;
      }
      case '/api/stats': {
        try {
          const stats = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'data', 'stats.json')),
          );
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(stats, null, 2));
        } catch {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Stats not found' }));
        }

        break;
      }
      case '/api/refresh': {
        try {
          await this.updateDashboard();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ success: true, message: 'Stats refreshed' }),
          );
        } catch {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to refresh stats' }));
        }

        break;
      }
      default: {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    }
  }

  async updateDashboard() {
    try {
      await this.collector.collectAllStats();
      const html = this.collector.generateHTML();
      fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html);
      console.log('✅ Dashboard updated');
    } catch (error) {
      console.error('❌ Error updating dashboard:', error);
    }
  }
}

async function main() {
  const arguments_ = process.argv.slice(2);
  const watchMode = arguments_.includes('--watch');
  const port =
    Number.parseInt(
      arguments_
        .find((argument) => argument.startsWith('--port='))
        ?.split('=')[1],
    ) || 3000;

  if (watchMode) {
    const server = new StatsServer(port);
    await server.start();
  } else {
    // Just update stats and exit
    const collector = new StatsCollector();
    await collector.collectAllStats();
    const html = collector.generateHTML();
    fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html);
    console.log('✅ Stats updated and dashboard generated');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = StatsServer;
