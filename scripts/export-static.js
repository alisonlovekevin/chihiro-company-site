import { copyFile, mkdir, rm, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPath, staticPaths } from '../server.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(root, 'dist');
const publicDir = join(root, 'public');

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else {
      await copyFile(source, target);
    }
  }
}

function outputFileForPath(pathname) {
  if (pathname === '/') return join(distDir, 'index.html');
  return join(distDir, pathname.replace(/^\/|\/$/g, ''), 'index.html');
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await copyDir(publicDir, distDir);
await copyFile(join(root, '_headers'), join(distDir, '_headers'));

for (const pathname of staticPaths) {
  const rendered = renderPath(pathname);
  const file = outputFileForPath(pathname);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, rendered.html, 'utf8');
}

console.log(`Exported ${staticPaths.length} pages to dist/`);
