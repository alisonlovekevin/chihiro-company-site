import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = JSON.parse(await readFile(join(root, 'tmp-ebay-collected.json'), 'utf8'));
const outDir = join(root, 'public', 'assets', 'ebay');

await mkdir(outDir, { recursive: true });

for (const item of data) {
  const imageUrl = item.image.replace(/s-l\d+\.(jpg|webp)/i, 's-l800.$1');
  const extension = imageUrl.match(/\.(webp|jpg|jpeg|png)(?:\?|$)/i)?.[1]?.toLowerCase() || 'jpg';
  const filename = `${item.key}-${item.id}.${extension === 'jpeg' ? 'jpg' : extension}`;
  const response = await fetch(imageUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'referer': `https://${item.domain}/itm/${item.id}`
    }
  });
  if (!response.ok) throw new Error(`${item.id} image failed: ${response.status}`);
  await writeFile(join(outDir, filename), Buffer.from(await response.arrayBuffer()));
  item.localImage = `/assets/ebay/${filename}`;
  console.log(`${item.id} ${filename}`);
}

await writeFile(join(root, 'tmp-ebay-collected.json'), JSON.stringify(data, null, 2), 'utf8');
