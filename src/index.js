/* eslint-disable security/detect-non-literal-fs-filename */
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

import { generateHTML } from './generateHtml.js';
import { collectAll } from './statsCollector.js';

const ROOT = path.join(import.meta.dirname, '..');

const arguments_ = process.argv.slice(2);
const watchMode = arguments_.includes('--watch');
const port =
  Number.parseInt(
    arguments_
      .find((argument) => argument.startsWith('--port='))
      ?.split('=')[1],
  ) || 3000;

if (watchMode) {
  let cachedHtml = null;

  async function refresh() {
    console.log('Refreshing stats...');
    const { packages, stats } = await collectAll();
    cachedHtml = generateHTML(packages, stats);
    console.log('Dashboard updated.');
  }

  await refresh();

  const server = createServer((request, res) => {
    if (request.url === '/' || request.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(cachedHtml);
    } else if (request.url === '/api/stats') {
      try {
        const stats = readFileSync(
          path.join(ROOT, 'data', 'stats.json'),
          'utf8',
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(stats);
      } catch {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No stats data' }));
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`);
  });

  setInterval(refresh, 5 * 60 * 1000);
} else {
  const { packages, stats } = await collectAll();
  const html = generateHTML(packages, stats);
  writeFileSync(path.join(ROOT, 'index.html'), html);
  console.log('Stats updated and dashboard generated.');
}
