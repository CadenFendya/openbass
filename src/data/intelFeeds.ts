export type IntelItem = {
  id: string;
  title: string;
  source: string;
  category: 'news' | 'reddit' | 'deal' | 'guide' | 'pro' | 'local' | 'video';
  url: string;
  summary: string;
  tags: string[];
};

export const INTEL_FEEDS: IntelItem[] = [
  {
    id: 'bassmaster-news',
    title: 'Bassmaster tournament and pattern news',
    source: 'Bassmaster',
    category: 'news',
    url: 'https://www.bassmaster.com/',
    summary: 'Tournament results, winning patterns, seasonal articles, and pro-level bass strategy.',
    tags: ['pro', 'tournaments', 'patterns']
  },
  {
    id: 'mlf-news',
    title: 'Major League Fishing strategy and results',
    source: 'Major League Fishing',
    category: 'news',
    url: 'https://majorleaguefishing.com/',
    summary: 'MLF tournament coverage, lake breakdowns, bait choices, and pro decision-making.',
    tags: ['pro', 'strategy', 'tournaments']
  },
  {
    id: 'bassfishing-reddit',
    title: 'Top r/bassfishing posts',
    source: 'Reddit',
    category: 'reddit',
    url: 'https://www.reddit.com/r/bassfishing/top/?t=week',
    summary: 'Community catches, bait discussions, seasonal reports, and real angler feedback.',
    tags: ['community', 'catches', 'trends']
  },
  {
    id: 'fishing-gear-reddit',
    title: 'Top r/Fishing_Gear posts',
    source: 'Reddit',
    category: 'reddit',
    url: 'https://www.reddit.com/r/Fishing_Gear/top/?t=week',
    summary: 'Rod, reel, line, lure, and tackle opinions from real users.',
    tags: ['gear', 'reviews', 'community']
  },
  {
    id: 'fishing-reddit',
    title: 'Top r/Fishing posts',
    source: 'Reddit',
    category: 'reddit',
    url: 'https://www.reddit.com/r/Fishing/top/?t=week',
    summary: 'Broad fishing discussion, catches, species reports, and tackle ideas.',
    tags: ['community', 'reports', 'catches']
  },
  {
    id: 'tacklewarehouse-deals',
    title: 'Tackle Warehouse sale page',
    source: 'Tackle Warehouse',
    category: 'deal',
    url: 'https://www.tacklewarehouse.com/sale.html',
    summary: 'Bass tackle discounts, lure sales, rod/reel markdowns, and seasonal clearance.',
    tags: ['deals', 'tackle', 'lures']
  },
  {
    id: 'basspro-deals',
    title: 'Bass Pro Shops fishing deals',
    source: 'Bass Pro Shops',
    category: 'deal',
    url: 'https://www.basspro.com/shop/en/fishing-sale-clearance',
    summary: 'Fishing sale and clearance items across lures, rods, reels, line, electronics, and apparel.',
    tags: ['deals', 'gear', 'basspro']
  },
  {
    id: 'omnia-reports',
    title: 'Omnia Fishing lake reports and gear picks',
    source: 'Omnia Fishing',
    category: 'local',
    url: 'https://www.omniafishing.com/fishing-reports',
    summary: 'Lake-specific fishing reports, recommended baits, and condition-based tackle suggestions.',
    tags: ['local', 'reports', 'gear']
  },
  {
    id: 'youtube-patterns',
    title: 'Condition-matched YouTube pattern videos',
    source: 'YouTube',
    category: 'video',
    url: 'https://www.youtube.com/results?search_query=bass+fishing+chatterbait+wind+stained+water',
    summary: 'Video search template for matching today’s conditions to tutorials and on-water pattern videos.',
    tags: ['video', 'learning', 'patterns']
  }
];

export const FUTURE_INTEL_MODULES = [
  'Weather radar overlay',
  'Lake contour maps',
  'Fish positioning model',
  'Moon/solunar heatmap',
  'Pack-for-today checklist',
  'Launch ramp finder',
  'Grand Rapids local reports',
  'What rod should I bring today',
  'YouTube pattern matching',
  'Pro Says tournament strategy feed'
];
