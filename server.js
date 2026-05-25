import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, 'public');
const port = Number(globalThis.process?.env?.PORT || 3000);

const site = {
  name: '千尋貿易合同会社',
  romanName: 'Chihiro Boueki LLC',
  mark: '千',
  tagline: '日本品質を、確かな流通で世界へ。',
  lead: '日本正規品の仕入れ、品質管理、在庫管理、国際物流を通じて、越境EC事業を支えます。',
  phone: '090-3732-0219',
  email: 'chihiroboueki@gmail.com',
  address: '〒533-0022 大阪府大阪市東淀川区菅原1丁目15番15号 コーラル菅原202号室',
  shopUrl: 'https://www.ebay.com/'
};

const nav = [
  ['/', 'ホーム'],
  ['/business/', '事業内容'],
  ['/products/', '取扱商品'],
  ['/quality/', '品質管理'],
  ['/logistics/', '国際物流'],
  ['/recruit/', '採用情報'],
  ['/company/', '会社概要'],
  ['/contact/', 'お問い合わせ']
];

const productCategories = [
  {
    name: 'ホビー用品',
    description: 'フィギュア、キャラクターグッズ、コレクター向け商品を中心に取り扱います。',
    image: '/assets/products-hobby.png',
    products: [
      ['アニメフィギュア', '人気作品のフィギュア、限定品、コレクター向けアイテム。'],
      ['キャラクターグッズ', 'アクリルスタンド、缶バッジ、ぬいぐるみなど。'],
      ['コレクターズアイテム', '保存状態を確認した海外需要の高い商品。'],
      ['ホビー雑貨', '日本市場で人気の小物、展示用品、関連アクセサリー。'],
      ['ディスプレイ用品', 'コレクションを美しく保管・展示する関連商品。'],
      ['キーホルダー・小物', 'ギフト需要にも合う軽量で扱いやすいホビー商品。']
    ]
  },
  {
    name: '玩具・プラモデル',
    description: '日本国内の正規流通品を中心に、検品後に出荷します。',
    image: '/assets/products-toys.png',
    products: [
      ['プラモデル', '組立キット、限定モデル、関連ツール。'],
      ['模型用品', '塗装用品、工具、ディスプレイ関連商品。'],
      ['トレーディング玩具', 'BOX商品、ランダム商品、シリーズ商品。'],
      ['ボードゲーム・玩具', '日本語版・限定版など海外需要のある商品。'],
      ['ミニチュア模型', '精巧な小型模型やコレクション向け商品。'],
      ['ツールセット', '制作や補修に使いやすい模型関連ツール。']
    ]
  },
  {
    name: 'CD・Blu-ray',
    description: 'アニメ、音楽、映像作品など、海外需要のある商品を扱います。',
    image: '/assets/products-media.png',
    products: [
      ['アニメBlu-ray', '限定版、特典付き商品、人気作品の映像商品。'],
      ['音楽CD', '日本アーティスト、サウンドトラック、限定盤。'],
      ['ライブ映像', 'コンサートBlu-ray、DVD、限定パッケージ。'],
      ['メディア特典商品', '店舗特典、初回特典、関連グッズ付き商品。'],
      ['BOXセット', 'コレクション性の高いセット商品や限定仕様。'],
      ['関連グッズ付き商品', 'ディスクと特典を組み合わせた海外向け商品。']
    ]
  },
  {
    name: '日用品・雑貨',
    description: '日本品質を求める海外顧客に向けた生活関連商品を展開します。',
    image: '/assets/products-goods.png',
    products: [
      ['生活雑貨', '使いやすさと品質に優れた日本製・日本企画商品。'],
      ['文具', '筆記具、ノート、デスク用品、限定デザイン商品。'],
      ['キッチン用品', '便利で品質の高い調理・保存関連商品。'],
      ['美容・ケア用品', '日常ケア用品、小型雑貨、ギフト向け商品。'],
      ['収納用品', '暮らしを整えるコンパクトで実用的な商品。'],
      ['ギフト雑貨', '海外のお客様にも選ばれやすい日本らしい小物。']
    ]
  }
];

const jobs = [
  {
    slug: 'ec-operations',
    title: '越境EC運営スタッフ',
    type: 'アルバイト・正社員相談可',
    location: '大阪市東淀川区',
    time: '10:00-18:00の間で相談可',
    pay: '経験・能力を考慮の上、当社規定により決定',
    summary: '商品登録、受注管理、海外販売サイトの運営補助を担当します。',
    duties: ['商品情報の登録・更新', '注文確認と出荷指示', '販売データの整理', '海外販売サイトの運営補助'],
    requirements: ['基本的なPC操作ができる方', '丁寧に確認作業ができる方', 'EC業務に興味がある方'],
    welcome: ['中国語または英語ができる方', 'ECモール運営経験', '画像編集や商品説明作成の経験']
  },
  {
    slug: 'inspection-packing',
    title: '商品検品・梱包スタッフ',
    type: 'パート・アルバイト',
    location: '大阪市東淀川区',
    time: '週3日から相談可',
    pay: '時給制・経験により優遇',
    summary: '日本商品の検品、梱包、出荷準備を行う仕事です。',
    duties: ['商品の外観確認', '付属品や数量の確認', '梱包作業', '出荷前チェック'],
    requirements: ['細かい確認作業が得意な方', '責任を持って作業できる方', '長期勤務できる方歓迎'],
    welcome: ['倉庫作業経験', 'ホビー商品に興味がある方', '整理整頓が得意な方']
  },
  {
    slug: 'customer-support',
    title: 'カスタマーサポート',
    type: 'パート・アルバイト',
    location: '大阪市東淀川区 / 一部在宅相談可',
    time: '勤務時間相談可',
    pay: '経験・スキルを考慮',
    summary: 'お問い合わせ対応、注文確認、簡単な事務作業を担当します。',
    duties: ['メールでのお問い合わせ対応', '注文内容の確認', '配送状況の確認', '社内連絡と事務補助'],
    requirements: ['正確な文章作成ができる方', '落ち着いて対応できる方', '基本的なPC操作ができる方'],
    welcome: ['日本語と中国語の読み書き', 'カスタマーサポート経験', '越境ECに関心がある方']
  }
];

const pages = {
  '/business/': {
    title: '越境EC事業',
    description: `${site.name}は、日本正規品の仕入れ、品質管理、在庫管理、国際物流を通じて越境EC事業を展開しています。`,
    body: businessPage
  },
  '/products/': {
    title: '取扱商品',
    description: 'ホビー用品、玩具、プラモデル、CD、Blu-ray、日用品など、海外需要のある日本商品を取り扱います。',
    body: productsPage
  },
  '/quality/': {
    title: '品質管理・検品体制',
    description: '仕入れから出荷までの各工程で検品と品質確認を行い、日本正規品を安心してお届けします。',
    body: qualityPage
  },
  '/logistics/': {
    title: '国際物流・海外発送',
    description: '在庫管理、梱包、海外発送、配送確認まで、越境ECに必要な物流業務を一貫して支援します。',
    body: logisticsPage
  },
  '/partners/': {
    title: '利用サービス・連携先',
    description: '販売、仕入れ、配送、物流に関連する主要な利用サービスをご紹介します。',
    body: partnersPage
  },
  '/company/': {
    title: '会社概要',
    description: `${site.name}の会社概要、所在地、事業内容、連絡先をご案内します。`,
    body: companyPage
  },
  '/news/': {
    title: 'お知らせ',
    description: `${site.name}からのお知らせを掲載しています。`,
    body: newsPage
  },
  '/contact/': {
    title: 'お問い合わせ',
    description: '仕入れ相談、海外販売相談、業務提携、採用に関するお問い合わせはこちらからご連絡ください。',
    body: contactPage
  },
  '/recruit/': {
    title: '採用情報',
    description: `${site.name}では、越境EC事業の拡大に伴い、共に事業を支える人材を募集しています。`,
    body: recruitPage
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizePath(pathname) {
  if (pathname !== '/' && !pathname.endsWith('/')) return `${pathname}/`;
  return pathname;
}

function pageShell({ title, description, path, children }) {
  const fullTitle = path === '/' ? `${site.name} - ${site.tagline}` : `${title}｜${site.name}`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="keywords" content="越境EC,日本正規品,厳選仕入れ,品質管理,検品,国際物流,海外発送,採用情報">
<meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="/style.css?v=4">
</head>
<body>
${header(path)}
<main>
${children}
</main>
${footer()}
</body>
</html>`;
}

function header(path) {
  return `<header class="site-header">
  <div class="topbar">
    <div class="wrap topbar-inner">
      <span>${site.name}のウェブサイトをご覧いただき、ありがとうございます。</span>
      <span><a href="/company/">会社概要</a><a href="/contact/">お問い合わせ</a></span>
    </div>
  </div>
  <div class="wrap brand-row">
    <a class="brand" href="/" aria-label="${site.name}">
    <span class="brand-mark">${site.mark}</span>
    <span><strong>${site.name}</strong><small>${site.romanName}</small></span>
    </a>
    <p class="brand-copy">${site.tagline}</p>
    <a class="phone" href="tel:${site.phone}"><span>Tel</span>${site.phone}</a>
  </div>
  <nav class="nav">
    <div class="wrap nav-inner">
      ${nav.map(([href, label]) => `<a class="${path === href ? 'active' : ''}" href="${href}">${label}</a>`).join('')}
    </div>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="footer">
  <div class="wrap footer-grid">
    <div>
      <a class="brand footer-brand" href="/">
        <span class="brand-mark">${site.mark}</span>
        <span><strong>${site.name}</strong><small>${site.tagline}</small></span>
      </a>
      <p>${site.lead}</p>
    </div>
    <div>
      <h2>サイトマップ</h2>
      <div class="footer-links">
        ${[...nav, ['/partners/', '利用サービス'], ['/news/', 'お知らせ']].map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
      </div>
    </div>
    <div>
      <h2>お問い合わせ</h2>
      <p>電話：${site.phone}</p>
      <p>メール：${site.email}</p>
      <p>住所：${site.address}</p>
    </div>
  </div>
  <div class="copyright">Copyright © ${site.name}. All Rights Reserved.</div>
</footer>`;
}

function homePage() {
  return `<section class="hero">
  <img src="/assets/hero-logistics.png" alt="越境ECの品質管理と国際物流">
  <div class="hero-shade"></div>
  <div class="wrap hero-content">
    <p class="eyebrow">Cross-border E-commerce / Japan Quality</p>
    <h1>${site.name}</h1>
    <p class="hero-lead">${site.tagline}</p>
    <p class="hero-text">${site.lead}</p>
    <div class="hero-actions">
      <a class="button primary" href="/business/">事業内容を見る</a>
      <a class="button ghost" href="/contact/">お問い合わせ</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Business</p>
      <h2>越境ECを支える一貫体制</h2>
      <p>仕入れ、検品、在庫管理、発送、顧客対応まで、各工程を丁寧に整えます。</p>
    </div>
    <div class="feature-grid">
      ${featureCard('正規品仕入れ', '日本国内の流通ルートを活用し、海外需要のある商品を厳選します。', '/business/')}
      ${featureCard('品質管理・検品', '外観、数量、付属品、梱包状態を確認し、出荷前の品質を整えます。', '/quality/')}
      ${featureCard('国際物流対応', '在庫管理から海外発送まで、越境販売に必要な物流業務を支援します。', '/logistics/')}
    </div>
  </div>
</section>
<section class="band">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Products</p>
      <h2>海外需要のある日本商品を中心に展開</h2>
      <p>ホビー用品、玩具、プラモデル、CD・Blu-ray、日用品など、日本品質を求める市場に向けた商品を扱います。</p>
      <a class="text-link" href="/products/">取扱商品を見る</a>
    </div>
    <div class="product-mini">
      ${productCategories.map(category => `<article><h3>${category.name}</h3><p>${category.description}</p></article>`).join('')}
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Recruit</p>
      <h2>採用情報</h2>
      <p>越境EC事業の拡大に伴い、運営、検品、梱包、カスタマーサポートを支える人材を募集しています。</p>
    </div>
    <div class="job-list compact">
      ${jobs.slice(0, 2).map(jobCard).join('')}
      <a class="button primary wide" href="/recruit/">募集一覧を見る</a>
    </div>
  </div>
</section>`;
}

function featureCard(title, text, href) {
  return `<article class="feature-card">
    <h3>${title}</h3>
    <p>${text}</p>
    <a href="${href}">詳しく見る</a>
  </article>`;
}

function pageHero(title, lead) {
  return `<section class="page-hero">
  <div class="wrap">
    <p class="eyebrow">${site.name}</p>
    <h1>${title}</h1>
    <p>${lead}</p>
  </div>
</section>`;
}

function businessPage() {
  return `${pageHero('越境EC事業', '日本正規品を海外市場へ届けるため、仕入れから販売支援まで一貫して対応します。')}
<section class="section"><div class="wrap two-col">
${infoBlock('主な業務', ['日本商品の調達・仕入れ', '海外販売サイト向けの商品情報整備', '受注・在庫管理', '海外発送と配送確認', '顧客対応の補助'])}
${infoBlock('対応領域', ['ホビー・コレクター商品', '玩具・プラモデル', 'CD・Blu-ray', '日用品・雑貨', '海外向け販売支援'])}
</div></section>`;
}

function productsPage() {
  return `${pageHero('取扱商品', '日本国内の商品価値を見極め、海外需要に合う商品カテゴリを展開しています。')}
<section class="section products-section"><div class="wrap">
${productCategories.map(category => `<section class="product-category">
  <div class="category-head">
    <div>
      <p class="eyebrow">Product Category</p>
      <h2>${category.name}</h2>
      <p>${category.description}</p>
    </div>
    <a class="button shop-button" href="${site.shopUrl}" target="_blank" rel="noopener">訪問網店</a>
  </div>
  <div class="product-shelf">
    ${category.products.map(([name, text], index) => `<article class="product-card">
      <a href="${site.shopUrl}" target="_blank" rel="noopener">
        <span class="product-image tile-${index + 1}" style="background-image:url('${category.image}')"></span>
        <span class="product-type">${category.name}</span>
        <h3>${name}</h3>
        <p>${text}</p>
        <small>eBayで見る</small>
      </a>
    </article>`).join('')}
  </div>
</section>`).join('')}
</div></section>`;
}

function qualityPage() {
  return `${pageHero('品質管理・検品体制', '標準運営と各工程の確認により、日本正規品を安心してお届けします。')}
<section class="section"><div class="wrap process">
${['仕入れ確認', '外観検品', '数量・付属品確認', '梱包状態確認', '出荷前チェック'].map((item, index) => `<article><span>${index + 1}</span><h2>${item}</h2><p>出荷前の小さな違和感を見逃さないよう、工程ごとに確認します。</p></article>`).join('')}
</div></section>`;
}

function logisticsPage() {
  return `${pageHero('国際物流・海外発送', '在庫管理、梱包、配送手配、発送後確認まで、越境ECに必要な物流業務を支えます。')}
<section class="section"><div class="wrap two-col">
${infoBlock('物流対応', ['在庫整理', '注文ごとのピッキング', '国際発送向け梱包', '配送情報の確認', '発送後の問い合わせ対応'])}
${infoBlock('大切にしていること', ['破損リスクを抑えた梱包', '商品特性に合わせた出荷準備', '配送状況の正確な共有', '安定した運用体制'])}
</div></section>`;
}

function partnersPage() {
  return `${pageHero('利用サービス・連携先', '販売、仕入れ、配送、物流に関連する主要な利用サービスをご紹介します。')}
<section class="section"><div class="wrap logo-grid">
${['Amazon', '日本郵政', 'FedEx', 'Orange Connex', '卸売サイト', '国内仕入れサービス'].map(name => `<article><strong>${name}</strong><span>関連サービス</span></article>`).join('')}
</div></section>`;
}

function companyPage() {
  return `${pageHero('会社概要', '越境ECを通じて、日本品質の商品を世界へ届ける企業です。')}
<section class="section"><div class="wrap company-table">
${tableRow('会社名', site.name)}
${tableRow('英語表記', site.romanName)}
${tableRow('所在地', site.address)}
${tableRow('電話番号', site.phone)}
${tableRow('メール', site.email)}
${tableRow('事業内容', '越境EC事業、日本商品の仕入れ、品質管理、在庫管理、国際物流対応')}
</div></section>`;
}

function newsPage() {
  return `${pageHero('お知らせ', '最新のお知らせを掲載しています。')}
<section class="section"><div class="wrap news-list">
${['採用情報ページを公開しました。', '越境EC事業の紹介ページを更新しました。', '公式ウェブサイトを準備中です。'].map((title, index) => `<article><time>2026.05.${25 - index}</time><a href="/news/">${title}</a></article>`).join('')}
</div></section>`;
}

function contactPage() {
  return `${pageHero('お問い合わせ', '仕入れ相談、海外販売相談、業務提携、採用に関するご相談はこちらからお問い合わせください。')}
<section class="section"><div class="wrap contact-panel">
<div>
  <h2>ご相談内容</h2>
  <p>越境EC、商品調達、品質管理、物流、採用について、お気軽にご連絡ください。</p>
</div>
<div>
  <p><strong>電話</strong><a href="tel:${site.phone}">${site.phone}</a></p>
  <p><strong>メール</strong><a href="mailto:${site.email}">${site.email}</a></p>
  <p><strong>住所</strong>${site.address}</p>
</div>
</div></section>`;
}

function recruitPage() {
  return `${pageHero('採用情報', '越境EC事業の拡大に伴い、共に事業を支える人材を募集しています。')}
<section class="section"><div class="wrap">
  <div class="job-list">${jobs.map(jobCard).join('')}</div>
</div></section>`;
}

function jobDetailPage(job) {
  return `${pageHero(job.title, job.summary)}
<section class="section"><div class="wrap job-detail">
  <div class="job-meta">
    <p><strong>雇用形態</strong>${job.type}</p>
    <p><strong>勤務地</strong>${job.location}</p>
    <p><strong>勤務時間</strong>${job.time}</p>
    <p><strong>給与</strong>${job.pay}</p>
  </div>
  <div class="two-col">
    ${infoBlock('仕事内容', job.duties)}
    ${infoBlock('応募資格', job.requirements)}
    ${infoBlock('歓迎条件', job.welcome)}
    ${infoBlock('応募方法', [`メールまたは電話にてご連絡ください。`, `メール：${site.email}`, `電話：${site.phone}`])}
  </div>
  <a class="button ghost dark" href="/recruit/">募集一覧へ戻る</a>
</div></section>`;
}

function jobCard(job) {
  return `<article class="job-card">
    <a href="/recruit/${job.slug}/">
      <span>${job.type}</span>
      <h2>${job.title}</h2>
      <p>${job.summary}</p>
      <small>${job.location}</small>
    </a>
  </article>`;
}

function infoBlock(title, items) {
  return `<section class="info-block"><h2>${title}</h2><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
}

function tableRow(label, value) {
  return `<div><dt>${label}</dt><dd>${value}</dd></div>`;
}

async function staticFile(pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(publicDir, safePath);
  const body = await readFile(filePath);
  const types = { '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
  return { body, type: types[extname(filePath)] || 'application/octet-stream' };
}

export function renderPath(pathname) {
  const path = normalizePath(pathname);

  if (path === '/') {
    return {
      status: 200,
      html: pageShell({ title: site.name, description: site.lead, path, children: homePage() })
    };
  }

  const recruitMatch = path.match(/^\/recruit\/([^/]+)\/$/);
  if (recruitMatch) {
    const job = jobs.find(item => item.slug === recruitMatch[1]);
    if (job) {
      return {
        status: 200,
        html: pageShell({ title: job.title, description: job.summary, path: '/recruit/', children: jobDetailPage(job) })
      };
    }
  }

  const page = pages[path];
  if (page) {
    return {
      status: 200,
      html: pageShell({ title: page.title, description: page.description, path, children: page.body() })
    };
  }

  return {
    status: 404,
    html: pageShell({ title: 'ページが見つかりません', description: 'ページが見つかりません。', path: '', children: pageHero('404', 'ページが見つかりません。') })
  };
}

export const staticPaths = [
  '/',
  ...Object.keys(pages),
  ...jobs.map(job => `/recruit/${job.slug}/`)
];

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (url.pathname === '/style.css' || url.pathname === '/style.css/' || url.pathname.startsWith('/assets/')) {
      const file = await staticFile(url.pathname === '/style.css/' ? '/style.css' : url.pathname);
      res.writeHead(200, { 'content-type': file.type, 'cache-control': 'public, max-age=3600' });
      res.end(file.body);
      return;
    }

    const path = normalizePath(url.pathname);

    if (url.pathname !== path) {
      res.writeHead(301, { location: path });
      res.end();
      return;
    }

    const rendered = renderPath(path);
    res.writeHead(rendered.status, { 'content-type': 'text/html; charset=utf-8' });
    res.end(rendered.html);
  } catch (error) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

if (globalThis.process?.argv?.[1] && import.meta.url === `file:///${process.argv[1].replaceAll('\\', '/')}`) {
  server.listen(port, () => {
    if (globalThis.process?.stdout?.isTTY) {
      console.log(`Server running at http://localhost:${port}`);
    }
  });
}
