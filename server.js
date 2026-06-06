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
  shopUrl: 'https://www.ebay.com/str/japanhorizon'
};

const nav = [
  ['/', 'ホーム'],
  ['/business/', '事業内容'],
  ['/products/', '取扱商品'],
  ['/quality/', '品質管理'],
  ['/logistics/', '国際物流'],
  ['/recruit/', '採用情報'],
  ['/company/', '会社ニュース'],
  ['/contact/', 'お問い合わせ']
];

const productCategories = [
  {
    "name": "ホビー用品",
    "description": "フィギュア、キャラクターグッズ、コレクター向け商品を中心に取り扱います。",
    "image": "/assets/products-hobby.png",
    "products": [
      {
        "title": "Sony REON POCKET PRO Wearable Thermo Device Japan Edition Ships From Japan",
        "url": "https://www.ebay.com/itm/406922744667",
        "image": "/assets/ebay/hobby-406922744667.jpg"
      },
      {
        "title": "Takara Tomy BEYBLADE X BX-46 Battle Entry Set Infinity Stadium 2 Beys Japan",
        "url": "https://www.ebay.com/itm/406565290722",
        "image": "/assets/ebay/hobby-406565290722.jpg"
      },
      {
        "title": "Tamiya 58630 Plasma Edge II TT-02B 1/10 4WD Off-Road RC Buggy Kit Japan NEW",
        "url": "https://www.ebay.com/itm/406532549986",
        "image": "/assets/ebay/hobby-406532549986.jpg"
      },
      {
        "title": "Pre-Order Tomica Premium Unlimited Star Wars Razor Crest Ship by May 30",
        "url": "https://www.ebay.com/itm/406884972440",
        "image": "/assets/ebay/hobby-406884972440.jpg"
      },
      {
        "title": "Tamiya 1/24 Alfa Romeo Giulia Sprint GTA Model Kit 24188 Ships From JP",
        "url": "https://www.ebay.com/itm/406368559877",
        "image": "/assets/ebay/hobby-406368559877.jpg"
      },
      {
        "title": "Daiwa 14 Underspin 80 Closed Face Spincast Reel 6lb-95m",
        "url": "https://www.ebay.com/itm/406807073136",
        "image": "/assets/ebay/hobby-406807073136.jpg"
      },
      {
        "title": "Panasonic RP-HZ47 Clip-On Open Type Stereo Headphones 30mm, 20Ω, 1m Cord JP",
        "url": "https://www.ebay.com/itm/406385967906",
        "image": "/assets/ebay/hobby-406385967906.jpg"
      },
      {
        "title": "Gillette Labs Heated Laser Shaving Razor 3 Piece Assortment Black From Japan NEW",
        "url": "https://www.ebay.com/itm/406861821473",
        "image": "/assets/ebay/hobby-406861821473.jpg"
      },
      {
        "title": "Tamiya Mazda 787B 1/10 RC Racing Car Kit 47518 Japan Special Edition NEW",
        "url": "https://www.ebay.com/itm/406458767235",
        "image": "/assets/ebay/hobby-406458767235.jpg"
      }
    ]
  },
  {
    "name": "玩具・プラモデル",
    "description": "日本国内の正規流通品を中心に、検品後に出荷します。",
    "image": "/assets/products-toys.png",
    "products": [
      {
        "title": "Bandai Ultraman Kaiser Belial Ultra Action Figure 2025 Japan Ships From Japan",
        "url": "https://www.ebay.com/itm/406452190890",
        "image": "/assets/ebay/toys-406452190890.jpg"
      },
      {
        "title": "Licca Chan Econeco Yukata Sumer Kimono Doll LD-14 Takara Tomy Japan 2025",
        "url": "https://www.ebay.com/itm/406508088538",
        "image": "/assets/ebay/toys-406508088538.jpg"
      },
      {
        "title": "Licca-chan My Melody Lovely Doll LD-28 Sanrio Collab Takara Tomy Japan Limited",
        "url": "https://www.ebay.com/itm/406870073892",
        "image": "/assets/ebay/toys-406870073892.jpg"
      },
      {
        "title": "TOY STORY 30th Anniv. Real Size Talking Figure Buzz Lightyear NINJA ver.",
        "url": "https://www.ebay.com/itm/406878198062",
        "image": "/assets/ebay/toys-406878198062.jpg"
      },
      {
        "title": "TAKARA TOMY Licca-chan Doll LD-29 Neo Decola Licca-chan Fashion Doll",
        "url": "https://www.ebay.com/itm/406867208689",
        "image": "/assets/ebay/toys-406867208689.jpg"
      },
      {
        "title": "Licca Chan Kimono Doll LD-30 Red Takara Tomy Japan 2024 2025 Ships From Japan",
        "url": "https://www.ebay.com/itm/406508363571",
        "image": "/assets/ebay/toys-406508363571.jpg"
      },
      {
        "title": "Takara Tomy Plarail SGX E5 Hayabusa E7 Kagayaki Combination Set",
        "url": "https://www.ebay.com/itm/406880136949",
        "image": "/assets/ebay/toys-406880136949.jpg"
      },
      {
        "title": "Pre-order Sekiguchi 244430 Liko-chan x Chimutan Small Watame-chan Plush JP",
        "url": "https://www.ebay.com/itm/406374641402",
        "image": "/assets/ebay/toys-406374641402.jpg"
      },
      {
        "title": "Bandai Spirits 30 MINUTES FANTASY Dragonia Knight Model Kit JP Ships",
        "url": "https://www.ebay.com/itm/406383361470",
        "image": "/assets/ebay/toys-406383361470.jpg"
      }
    ]
  },
  {
    "name": "CD・Blu-ray",
    "description": "アニメ、音楽、映像作品など、海外需要のある商品を扱います。",
    "image": "/assets/products-media.png",
    "products": [
      {
        "title": "samurai champloo music record CD Factory Sealed Genuine Product Ships from Japan",
        "url": "https://www.ebay.com/itm/406435991011",
        "image": "/assets/ebay/media-406435991011.jpg"
      },
      {
        "title": "Taylor Swift Midnights Late Night Edition Japan CD 7\" Sleeve Eras Tour w/Pick",
        "url": "https://www.ebay.com/itm/406697044041",
        "image": "/assets/ebay/media-406697044041.jpg"
      },
      {
        "title": "Kanye West \"Graduation\" + 2 bonus tracks JAPAN Limited Edition CD NEW",
        "url": "https://www.ebay.com/itm/406412203580",
        "image": "/assets/ebay/media-406412203580.jpg"
      },
      {
        "title": "New LAUFEY BEWITCHED THE GODDESS EDITION W/ BONUS TRACKS 2024 JAPAN BLU-SPEC CD",
        "url": "https://www.ebay.com/itm/406766875175",
        "image": "/assets/ebay/media-406766875175.jpg"
      },
      {
        "title": "Queens Of The Stone Age Alive in the Catacombs CD Japan Edition Ships From Japan",
        "url": "https://www.ebay.com/itm/406418374135",
        "image": "/assets/ebay/media-406418374135.jpg"
      },
      {
        "title": "Kensuke Ueo CHAINSAW MAN REZE ARC Soundtrack CD Japan Edition Ships From Japan",
        "url": "https://www.ebay.com/itm/406359783638",
        "image": "/assets/ebay/media-406359783638.jpg"
      },
      {
        "title": "IRIS OUT Edition CD Kenshi Yonezu Utada Hikaru Reze Acrylic Stand Polaroid Japan",
        "url": "https://www.ebay.com/itm/406359782535",
        "image": "/assets/ebay/media-406359782535.jpg"
      },
      {
        "title": "Tailgunner Guns For Hire Japan CD GQCS-91343 Heavy Metal Album",
        "url": "https://www.ebay.com/itm/406769458968",
        "image": "/assets/ebay/media-406769458968.jpg"
      },
      {
        "title": "Rolling Quartz Quartz Echo Kiseki No Hibiki Limited Edition CD+DVD Limited New",
        "url": "https://www.ebay.com/itm/406418542896",
        "image": "/assets/ebay/media-406418542896.jpg"
      }
    ]
  },
  {
    "name": "工具類・雑貨",
    "description": "工具、生活雑貨、ケア用品など、日本品質を求める海外顧客に向けた商品を展開します。",
    "image": "/assets/products-goods.png",
    "products": [
      {
        "title": "Takagi Shark Saw Pruning Curve Saw 270mm, Fluorine Coat, Replaceable Blade JP",
        "url": "https://www.ebay.com/itm/406556447727",
        "image": "/assets/ebay/goods-406556447727.jpg"
      },
      {
        "title": "KAKURI Kakuri Sangyo 130mm Folding Keyhole Saw 4954, Replaceable Blade, Japan",
        "url": "https://www.ebay.com/itm/406556294594",
        "image": "/assets/ebay/goods-406556294594.jpg"
      },
      {
        "title": "KAKURI MULTICRAFT MSS-30 Powerful All-Purpose Shears, Heavy-Duty Pro Scissors",
        "url": "https://www.ebay.com/itm/406558107469",
        "image": "/assets/ebay/goods-406558107469.jpg"
      },
      {
        "title": "Midori Magnetic Box Cutter with Ceramic Blade + Spare, Safe Cardboard Opener",
        "url": "https://www.ebay.com/itm/406592197365",
        "image": "/assets/ebay/goods-406592197365.jpg"
      },
      {
        "title": "OLFA Hyper L-Shape Gray Screw Lock Special Black Blade 192B-GRY Made in Japan",
        "url": "https://www.ebay.com/itm/406650448786",
        "image": "/assets/ebay/goods-406650448786.jpg"
      },
      {
        "title": "OLFA 192B Hyper L-Type 18mm Screw Lock Utility Knife, Rubber Grip, Japan",
        "url": "https://www.ebay.com/itm/406653582083",
        "image": "/assets/ebay/goods-406653582083.jpg"
      },
      {
        "title": "ENGINEER PZ-57 Neji-Saurus M2 ESD Screw Removal Pliers 2-3.5mm Made in Japan",
        "url": "https://www.ebay.com/itm/406716519348",
        "image": "/assets/ebay/goods-406716519348.jpg"
      },
      {
        "title": "KAI Compact Curved Kitchen Scissors DH3347 Seki Magoroku with Cap Made in Japan",
        "url": "https://www.ebay.com/itm/406763562243",
        "image": "/assets/ebay/goods-406763562243.jpg"
      },
      {
        "title": "25 in 1 Magnetic Precision Screwdriver Set Torx Y Pentalobe by HEARTHFUN",
        "url": "https://www.ebay.com/itm/406807296430",
        "image": "/assets/ebay/goods-406807296430.jpg"
      }
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

const newsArticles = [
  {
    slug: 'cross-border-trade-launch-2025',
    date: '2025.11.28',
    title: '越境貿易事業を本格始動しました',
    summary: `${site.name}は、日本国内で流通する正規品を海外のお客様へ届ける越境貿易事業を本格的に開始しました。`,
    image: '/assets/news-trade-launch.png',
    body: [
      `${site.name}は、2025年11月より越境貿易事業を本格始動しました。日本国内で評価されている商品を、海外のお客様へ正確かつ丁寧に届けることを目的に、商品選定、仕入れ、検品、梱包、国際発送までを一貫して管理する運営体制を整えています。`,
      '当社が大切にしているのは、単に商品を販売することではありません。海外のお客様が日本の商品に期待する品質、安心感、正確な情報を損なわないよう、仕入れ時の確認から発送前の状態確認まで、ひとつひとつの工程を標準化し、継続的に改善していくことを重視しています。',
      '今後はホビー用品、玩具、プラモデル、CD・Blu-ray、生活雑貨など、海外需要の高い分野を中心に取扱商品を拡充し、販売チャネルの整備と物流品質の向上を進めてまいります。日本品質を、確かな流通で世界へ届ける企業として、誠実な事業運営に努めてまいります。'
    ]
  },
  {
    slug: 'sales-600k-2026',
    date: '2026.02.28',
    title: '月間売上60万円を突破しました',
    summary: '越境EC事業の運営基盤強化と取扱商品の拡充により、月間売上が60万円を突破しました。',
    image: '/assets/news-sales-600k.png',
    body: [
      `${site.name}は、2026年2月の月間売上が60万円を突破したことをお知らせいたします。事業開始後、商品登録、在庫管理、発送業務、顧客対応の各工程を見直しながら、安定した販売体制の構築に取り組んできた成果のひとつです。`,
      '特に、海外のお客様から需要のある日本商品を継続的に調査し、商品ページの情報精度、写真品質、配送条件、問い合わせ対応を改善してきたことが、購入機会の増加につながりました。また、発送前の検品と梱包基準を明確にすることで、取引後の安心感を高める取り組みも進めています。',
      '今回の売上突破を一過性の結果とせず、今後も継続的な商品開発、販売データの分析、業務効率化を進めてまいります。お客様に選ばれる越境EC事業者として、品質とスピードの両面を高め、より信頼される販売体制を目指します。'
    ]
  },
  {
    slug: 'ebay-hand-saw-ranking-2026',
    date: '2026.03.31',
    title: 'eBayにおける手鋸カテゴリー販売ランキングで日本第1位を獲得しました',
    summary: '2026年3月、eBayにおける手鋸類の販売実績において、当社取扱商品が日本国内販売者ランキング第1位を獲得しました。',
    image: '/assets/news-ebay-saw-ranking.png',
    body: [
      `${site.name}は、2026年3月にeBay上で展開する手鋸類商品の販売において、日本国内販売者ランキング第1位を獲得しました。日本の工具は、切れ味、耐久性、仕上げの精度に対する評価が高く、海外のお客様からも安定した需要があります。当社では、その需要を的確に捉え、商品選定、情報発信、在庫管理、発送対応を継続的に改善してまいりました。`,
      '今回の結果は、単に販売数量を伸ばしただけではなく、商品ページの情報精度、写真の見せ方、配送条件、問い合わせ対応、発送前の確認体制など、越境ECに必要な複数の要素を地道に整えてきた成果だと考えています。特に工具類は、用途、サイズ、刃の種類、使用感に関する情報が購入判断に大きく影響するため、海外のお客様にも理解しやすい形で商品価値を伝えることを重視しています。',
      '今後も当社は、日本製品が持つ実用性と品質を海外市場へ正しく届けることを目指し、工具類を含む取扱カテゴリーの拡充を進めてまいります。今回のランキング第1位を励みに、販売実績の拡大だけでなく、取引品質、顧客満足度、継続的な運営力を高め、信頼される越境貿易事業者として成長を続けてまいります。'
    ]
  },
  {
    slug: 'office-relocation-2026',
    date: '2026.05.11',
    title: '事業規模拡大に伴い拠点を移転しました',
    summary: '取扱商品の増加と業務量の拡大に対応するため、事業拠点を大阪市東淀川区へ移転しました。',
    image: '/assets/news-relocation.png',
    body: [
      `${site.name}は、事業規模の拡大に伴い、2026年5月11日付で事業拠点を大阪市東淀川区へ移転しました。新拠点では、商品確認、保管、梱包、発送準備までの作業導線を見直し、日々の出荷業務をより安定して行える環境づくりを進めています。`,
      '越境ECにおいては、商品そのものの魅力だけでなく、発送までの正確さ、梱包の丁寧さ、問い合わせへの対応品質が企業の信頼につながります。今回の移転は、取扱商品の増加に対応するだけでなく、社内オペレーションをより高い水準へ引き上げるための重要な取り組みです。',
      '新しい環境を活用し、今後は商品カテゴリーの拡充、検品体制の強化、採用活動の推進を進めてまいります。地域に根ざしながらも世界市場を見据え、日本の商品価値を海外へ届ける事業者として、さらなる成長を目指します。'
    ]
  },
  {
    slug: 'second-cross-border-store-tools-2026',
    date: '2026.05.28',
    title: '越境貿易二号店を開設しました',
    summary: '日本の工具を世界へ届ける新たな販売拠点として、工具類を中心に取り扱う越境貿易二号店を開設しました。',
    image: '/assets/news-second-store-tools.png',
    body: [
      `${site.name}は、2026年5月28日、越境貿易事業のさらなる拡大に向けて、二号店となる新たな販売拠点を開設しました。二号店では、日本国内で流通する工具類を中心に取り扱い、品質、実用性、耐久性に優れた日本の商品を海外のお客様へ届けてまいります。`,
      '日本の工具は、細部まで配慮された設計、安定した性能、長く使い続けられる堅牢性が高く評価されています。手鋸、ドライバー、ペンチ、測定工具をはじめ、用途に応じた多様な商品を選定し、海外のお客様にも商品の特徴が正確に伝わるよう、仕様、サイズ、使用用途、配送条件などの情報を丁寧に整備してまいります。',
      '二号店の開設にあたっては、単に取扱商品を増やすだけでなく、仕入れ確認、在庫管理、検品、梱包、国際発送までの業務フローを見直しました。工具類は形状、重量、刃部の有無など商品ごとに特性が異なるため、それぞれに適した確認方法と梱包基準を定め、安全かつ安定した海外発送を実現できる体制を整えています。',
      '当社は今後も、日本のものづくりが生み出す価値を世界へ広げることを目指し、工具分野における商品ラインアップの拡充と販売品質の向上を進めてまいります。一号店で培った越境EC運営の経験を生かしながら、二号店を新たな成長の柱として育て、より多くの海外のお客様に信頼される販売拠点を築いてまいります。'
    ]
  },
  {
    slug: 'sales-1000k-2026',
    date: '2026.05.31',
    title: '月間売上100万円を突破しました',
    summary: '販売体制の強化、商品ラインアップの拡充、出荷品質の改善により、月間売上が100万円を突破しました。',
    image: '/assets/news-sales-1m.png',
    body: [
      `${site.name}は、2026年5月の月間売上が100万円を突破したことをお知らせいたします。越境貿易事業の開始以来、海外のお客様に向けて日本国内の正規品を安定的に届ける体制づくりに取り組み、販売面と運営面の双方で着実な成長を重ねてまいりました。`,
      '今回の成果は、商品ラインアップの拡充、販売ページの改善、在庫管理の精度向上、発送前確認の徹底など、日々の積み重ねによるものです。特に、海外需要の高いホビー用品、玩具、プラモデル、CD・Blu-ray、雑貨分野において、商品特性に合わせた情報提供と丁寧な出荷対応を行ってきました。',
      '今後も売上規模の拡大だけを目的とするのではなく、取引の品質、顧客満足度、業務の再現性を重視した成長を続けてまいります。日本品質を必要とする世界のお客様へ、信頼できる商品と安心できる取引体験を提供できるよう、より強い運営基盤を築いてまいります。'
    ]
  }
];

const newsByDateDesc = [...newsArticles].sort((a, b) => b.date.localeCompare(a.date));

const pages = {
  '/business/': {
    title: '越境EC事業',
    description: `${site.name}は、日本正規品の仕入れ、品質管理、在庫管理、国際物流を通じて越境EC事業を展開しています。`,
    body: businessPage
  },
  '/products/': {
    title: '取扱商品',
    description: 'ホビー用品、玩具、プラモデル、CD・Blu-ray、日用品など、海外需要のある日本商品を取り扱います。',
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
    title: '会社ニュース',
    description: `${site.name}の会社ニュース、事業に関するお知らせ、採用情報を掲載しています。`,
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
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css?v=6">
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
      <span><a href="/company/">会社ニュース</a><a href="/contact/">お問い合わせ</a><a href="https://www.chihiroboueki.com/">IT事業</a><a href="https://erp.chihiroboueki.com/">ERP</a></span>
    </div>
  </div>
  <div class="wrap brand-row">
    <a class="brand" href="/" aria-label="${site.name}">
    <span class="brand-mark"><img src="/assets/logo-mark.svg" alt=""></span>
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
        <span class="brand-mark"><img src="/assets/logo-mark.svg" alt=""></span>
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
<section class="section home-product-showcase">
  <div class="wrap">
    <div class="section-head showcase-head">
      <div>
        <p class="eyebrow">Selected Products</p>
        <h2>おすすめ商品</h2>
        <p>海外のお客様から注目を集める日本商品を、カテゴリーごとにご紹介します。</p>
      </div>
      <a class="button shop-button" href="/products/">取扱商品一覧を見る</a>
    </div>
    ${productCategories.map(category => `<section class="home-product-category">
      <div class="home-category-head">
        <h3>${category.name}</h3>
        <a href="/products/">カテゴリーを見る</a>
      </div>
      <div class="home-product-grid">
        ${category.products.slice(0, 3).map(product => homeProductCard(category, product)).join('')}
      </div>
    </section>`).join('')}
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

function homeProductCard(category, product) {
  return `<article class="home-product-card">
    <a href="${product.url}" target="_blank" rel="noopener">
      <span class="home-product-image" style="background-image:url('${product.image || category.image}')"></span>
      <span class="home-product-body">
        <small>${category.name}</small>
        <strong>${product.title}</strong>
      </span>
    </a>
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
    ${category.products.map((product, index) => `<article class="product-card">
      <a href="${product.url}" target="_blank" rel="noopener">
        <span class="product-image ${product.image ? 'real-image' : `tile-${(index % 6) + 1}`}" style="background-image:url('${product.image || category.image}')"></span>
        <span class="product-type">${category.name}</span>
        <h3>${product.title}</h3>
        <p>DDU · Buyer Pays Duties</p>
        <small>eBay商品を見る</small>
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
  return `${pageHero('会社ニュース', '越境貿易事業の歩み、成長に関するお知らせを掲載しています。')}
<section class="section"><div class="wrap news-card-list">
${newsByDateDesc.map(newsCard).join('')}
</div></section>`;
}

function newsPage() {
  return `${pageHero('お知らせ', '最新のお知らせを掲載しています。')}
<section class="section"><div class="wrap news-card-list">
${newsByDateDesc.map(newsCard).join('')}
</div></section>`;
}

function newsCard(article) {
  return `<article class="news-card">
    <a href="/company/${article.slug}/">
      <span class="news-thumb" style="background-image:url('${article.image}')"></span>
      <span class="news-card-body">
        <time>${article.date}</time>
        <strong>${article.title}</strong>
        <small>${article.summary}</small>
      </span>
    </a>
  </article>`;
}

function companyNewsDetailPage(article) {
  return `${pageHero(article.title, article.summary)}
<article class="section"><div class="wrap news-detail">
  <p class="article-date">${article.date}</p>
  <img class="news-article-image" src="${article.image}" alt="${article.title}">
  <div class="article-body">
    ${article.body.map(paragraph => `<p>${paragraph}</p>`).join('')}
  </div>
  <a class="button ghost dark" href="/company/">会社ニュース一覧へ戻る</a>
</div></article>`;
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
</div></section>
<section class="band"><div class="wrap">
  <div class="section-head">
    <p class="eyebrow">Company Profile</p>
    <h2>会社概要</h2>
    <p>越境ECを通じて、日本品質の商品を世界へ届ける企業です。</p>
  </div>
  <div class="company-table">
    ${tableRow('会社名', site.name)}
    ${tableRow('英語表記', site.romanName)}
    ${tableRow('所在地', site.address)}
    ${tableRow('電話番号', site.phone)}
    ${tableRow('メール', site.email)}
    ${tableRow('事業内容', '越境EC事業、日本商品の仕入れ、品質管理、在庫管理、国際物流対応')}
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
  const types = { '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml; charset=utf-8', '.ico': 'image/x-icon' };
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

  const newsMatch = path.match(/^\/company\/([^/]+)\/$/);
  if (newsMatch) {
    const article = newsArticles.find(item => item.slug === newsMatch[1]);
    if (article) {
      return {
        status: 200,
        html: pageShell({ title: article.title, description: article.summary, path: '/company/', children: companyNewsDetailPage(article) })
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
  ...newsArticles.map(article => `/company/${article.slug}/`),
  ...jobs.map(job => `/recruit/${job.slug}/`)
];

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (url.pathname === '/style.css' || url.pathname === '/style.css/' || url.pathname === '/favicon.ico' || url.pathname.startsWith('/assets/')) {
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
