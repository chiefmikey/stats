/* eslint-disable complexity */

function fmt(n) {
  return n.toLocaleString('en-US');
}

function generateReadme(packages, stats) {
  const depup = stats.depup || {};
  const topDepup = (depup.packages || []).slice(0, depup.topN || 25);
  const summary = depup.summary || {};

  let md = `# Package Statistics

Download and usage statistics for npm packages and Chrome Web Store extensions.

Last updated: ${new Date().toISOString().split('T')[0]}

## NPM Packages

| Package | Weekly | Monthly | Yearly | Total |
|---------|-------:|--------:|-------:|------:|`;

  for (const package_ of packages.npm) {
    const s = stats.npm[package_.package];
    if (s) {
      md += `\n| [${package_.name}](${package_.npm}) | ${fmt(s.weekly)} | ${fmt(s.monthly)} | ${fmt(s.yearly)} | ${fmt(s.total)} |`;
    }
  }

  md += `

## @depup Packages

${packages.depup.description}

| Metric | Value |
|--------|------:|
| Total packages | ${fmt(depup.totalPackages || 0)} |
| Weekly downloads | ${fmt(summary.totalWeekly || 0)} |
| Monthly downloads | ${fmt(summary.totalMonthly || 0)} |
| Yearly downloads | ${fmt(summary.totalYearly || 0)} |
| Current with upstream | ${summary.current || 0} |
| Behind upstream | ${summary.behind || 0} |

### Top ${depup.topN || 25} by Monthly Downloads

| # | Package | Weekly | Monthly | Yearly | @depup | Upstream | Status |
|---|---------|-------:|--------:|-------:|--------|----------|--------|`;

  let rank = 1;
  for (const package_ of topDepup) {
    const w = package_.weekly === 0 ? '--' : fmt(package_.weekly);
    const m = package_.monthly === 0 ? '--' : fmt(package_.monthly);
    const y = package_.yearly === 0 ? '--' : fmt(package_.yearly);
    md += `\n| ${rank} | [${package_.name}](https://www.npmjs.com/package/${package_.name}) | ${w} | ${m} | ${y} | ${package_.depupVersion} | ${package_.upstreamVersion} | ${package_.status} |`;
    rank++;
  }

  md += `

## Chrome Web Store

| Extension | Store Link |
|-----------|------------|`;

  for (const extension of packages.chrome) {
    md += `\n| ${extension.name} | [View](${extension.store}) |`;
  }

  md += '\n';

  return md;
}

export { generateReadme };
