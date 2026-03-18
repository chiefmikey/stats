/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(import.meta.dirname, '..', 'data');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
const PACKAGES_FILE = path.join(import.meta.dirname, 'packages.json');

const NPM_API = 'https://api.npmjs.org/downloads/point';
const NPM_SEARCH = 'https://registry.npmjs.org/-/v1/search';

function loadPackages() {
  return JSON.parse(readFileSync(PACKAGES_FILE, 'utf8'));
}

function loadStats() {
  if (existsSync(STATS_FILE)) {
    return JSON.parse(readFileSync(STATS_FILE, 'utf8'));
  }
  return { chrome: {}, depup: {}, lastUpdated: null, npm: {} };
}

function saveStats(stats) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  stats.lastUpdated = new Date().toISOString();
  writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchNpmDownloads(packageName) {
  const today = new Date().toISOString().split('T')[0];
  const [weekly, monthly, yearly, total] = await Promise.all([
    fetchJson(`${NPM_API}/last-week/${packageName}`),
    fetchJson(`${NPM_API}/last-month/${packageName}`),
    fetchJson(`${NPM_API}/last-year/${packageName}`),
    fetchJson(`${NPM_API}/2020-01-01:${today}/${packageName}`),
  ]);

  return {
    monthly: monthly?.downloads ?? 0,
    total: total?.downloads ?? 0,
    weekly: weekly?.downloads ?? 0,
    yearly: yearly?.downloads ?? 0,
  };
}

async function discoverDepupPackages() {
  const packages = [];
  let from = 0;
  const size = 250;

  while (true) {
    const url = `${NPM_SEARCH}?text=${encodeURIComponent('@depup/')}&size=${size}&from=${from}`;
    const data = await fetchJson(url);
    if (!data?.objects?.length) {
      break;
    }

    for (const object of data.objects) {
      const { name } = object.package;
      if (name.startsWith('@depup/')) {
        packages.push(name);
      }
    }

    if (data.objects.length < size) {
      break;
    }
    from += size;
    await sleep(500);
  }

  return packages.toSorted();
}

async function collectNpmStats(packages, stats) {
  console.log('Collecting npm package stats...');
  for (const package_ of packages.npm) {
    console.log(`  ${package_.package}...`);
    const downloads = await fetchNpmDownloads(package_.package);
    stats.npm[package_.package] = {
      ...downloads,
      description: package_.description,
      github: package_.github,
      lastFetched: new Date().toISOString(),
      name: package_.name,
      npm: package_.npm,
    };
    await sleep(200);
  }
}

async function collectDepupStats(packages, stats) {
  const config = packages.depup;
  console.log('Discovering @depup packages...');
  const depupPackages = await discoverDepupPackages();
  console.log(`  Found ${depupPackages.length} packages`);

  const depupStats = [];

  for (const name of depupPackages) {
    const shortName = name.replace('@depup/', '');
    console.log(`  ${name}...`);

    const [downloads, depupMeta, upstreamMeta] = await Promise.all([
      fetchNpmDownloads(name),
      fetchJson(`https://registry.npmjs.org/${name}/latest`).catch(() => null),
      fetchJson(`https://registry.npmjs.org/${shortName}/latest`).catch(
        () => null,
      ),
    ]);

    const depupVersion = depupMeta?.version ?? 'unknown';
    const upstreamVersion = upstreamMeta?.version ?? 'unknown';
    const baseVersion = depupVersion.replace(/-depup\.\d+$/u, '');
    const status = baseVersion === upstreamVersion ? 'current' : 'behind';

    depupStats.push({
      ...downloads,
      depupVersion,
      lastFetched: new Date().toISOString(),
      name,
      shortName,
      status,
      upstreamVersion,
    });

    await sleep(200);
  }

  const sorted = depupStats.toSorted((a, b) => b.monthly - a.monthly);

  stats.depup = {
    packages: sorted,
    summary: {
      behind: sorted.filter((p) => p.status === 'behind').length,
      current: sorted.filter((p) => p.status === 'current').length,
      totalMonthly: sorted.reduce((s, p) => s + p.monthly, 0),
      totalWeekly: sorted.reduce((s, p) => s + p.weekly, 0),
      totalYearly: sorted.reduce((s, p) => s + p.yearly, 0),
    },
    topN: config.topN,
    totalPackages: sorted.length,
  };
}

async function collectChromeStats(packages, stats) {
  console.log('Collecting Chrome Web Store stats...');
  for (const extension of packages.chrome) {
    console.log(`  ${extension.name}...`);
    stats.chrome[extension.extensionId] = {
      description: extension.description,
      github: extension.github,
      lastFetched: new Date().toISOString(),
      name: extension.name,
      store: extension.store,
    };
  }
}

async function collectAll() {
  const packages = loadPackages();
  const stats = loadStats();

  await collectNpmStats(packages, stats);
  await collectDepupStats(packages, stats);
  await collectChromeStats(packages, stats);

  saveStats(stats);
  console.log('Stats collection complete.');
  return { packages, stats };
}

export {
  collectAll,
  discoverDepupPackages,
  fetchNpmDownloads,
  loadPackages,
  loadStats,
  saveStats,
};
