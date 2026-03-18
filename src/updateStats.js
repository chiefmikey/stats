/* eslint-disable security/detect-non-literal-fs-filename */
import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { generateHTML } from './generateHtml.js';
import { generateReadme } from './generateReadme.js';
import { collectAll } from './statsCollector.js';

const ROOT = path.join(import.meta.dirname, '..');

const { packages, stats } = await collectAll();

writeFileSync(path.join(ROOT, 'index.html'), generateHTML(packages, stats));
console.log('Generated index.html');

writeFileSync(path.join(ROOT, 'README.md'), generateReadme(packages, stats));
console.log('Generated README.md');

console.log('Done.');
