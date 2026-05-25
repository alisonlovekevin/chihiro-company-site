import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'assets', 'ebay');

const groups = [
  {
    key: 'hobby',
    name: 'ホビー用品',
    links: [
      'https://www.ebay.com/itm/406922744667',
      'https://www.ebay.com/itm/406565290722',
      'https://www.ebay.com/itm/406532549986',
      'https://www.ebay.com/itm/406884972440',
      'https://www.ebay.com/itm/406368559877',
      'https://www.ebay.com/itm/406807073136',
      'https://www.ebay.com/itm/406385967906',
      'https://www.ebay.com/itm/406861821473',
      'https://www.ebay.com/itm/406458767235'
    ]
  },
  {
    key: 'toys',
    name: '玩具・プラモデル',
    links: [
      'https://www.ebay.com/itm/406452190890',
      'https://www.ebay.com/itm/406508088538',
      'https://www.ebay.com/itm/406870073892',
      'https://www.ebay.com/itm/406878198062',
      'https://www.ebay.com/itm/406867208689',
      'https://www.ebay.com/itm/406508363571',
      'https://www.ebay.com/itm/406880136949',
      'https://www.ebay.com/itm/406374641402',
      'https://www.ebay.com/itm/406383361470'
    ]
  },
  {
    key: 'media',
    name: 'CD・Blu-ray',
    links: [
      'https://www.ebay.com/itm/406435991011',
      'https://www.ebay.com/itm/406697044041',
      'https://www.ebay.com/itm/406412203580',
      'https://www.ebay.com/itm/406766875175',
      'https://www.ebay.com/itm/406418374135',
      'https://www.ebay.com/itm/406359783638',
      'https://www.ebay.com/itm/406359782535',
      'https://www.ebay.com/itm/406769458968',
      'https://www.ebay.com/itm/406418542896'
    ]
  },
  {
    key: 'goods',
    name: '工具類・雑貨',
    links: [
      'https://www.ebay.com/itm/406556447727',
      'https://www.ebay.com/itm/406556294594',
      'https://www.ebay.com/itm/406558107469',
      'https://www.ebay.com/itm/406592197365',
      'https://www.ebay.com/itm/406650448786',
      'https://www.ebay.com/itm/406653582083',
      'https://www.ebay.com/itm/406716519348',
      'https://www.ebay.com/itm/406763562243',
      'https://www.ebay.com/itm/406807296430'
    ]
  }
];

function itemId(url) {
  return url.match(/itm\/(\d+)/)?.[1] || String(Date.now());
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchMeta(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i')
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]);
  }
  return '';
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'text/html,application/xhtml+xml',
      'accept-language': 'ja,en-US;q=0.9,en;q=0.8',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function download(url, file) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`${url} image returned ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(file, bytes);
}

await mkdir(outDir, { recursive: true });

const result = [];
for (const group of groups) {
  const products = [];
  for (const url of group.links) {
    const id = itemId(url);
    console.log(`Fetching ${id}`);
    const html = await fetchText(url);
    const title = matchMeta(html, 'og:title') || html.match(/<title>(.*?)<\/title>/i)?.[1] || `eBay Item ${id}`;
    const image = matchMeta(html, 'og:image') || matchMeta(html, 'twitter:image');
    if (!image) throw new Error(`No image found for ${url}`);
    const filename = `${group.key}-${id}.jpg`;
    await download(image.replace(/s-l\d+\.jpg/i, 's-l1600.jpg'), join(outDir, filename));
    products.push({
      title: decodeEntities(title).replace(/\s*\|?\s*eBay\s*$/i, ''),
      url,
      image: `/assets/ebay/${filename}`
    });
  }
  result.push({ ...group, products });
}

await writeFile(join(outDir, 'products.json'), JSON.stringify(result, null, 2), 'utf8');
console.log(`Imported ${result.reduce((sum, group) => sum + group.products.length, 0)} products`);
