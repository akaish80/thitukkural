import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_URL = (process.env.SITE_URL || 'https://thirukkural.app').replace(/\/$/, '');
const DATE = new Date().toISOString().split('T')[0];

const STATIC_ROUTES = [
  '/',
  '/kurral',
  '/kurral/explore',
  '/kurral/exercise',
  '/tamil-evaluation',
  '/practice',
  '/draw-letter',
  '/free-type',
  '/tamil-letters',
  '/letter-exercise',
  '/aathichudi',
  '/about',
  '/contact',
  '/privacy',
  '/tamil-numbers',
  '/learn',
  '/planner',
  '/learn/picture-chart',
  '/learn-tamil',
  '/learn-tamil/image-letter-recognition',
  '/learn-tamil/picture-chart',
  '/tamil-counting',
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const makeUrlEntry = (route, changefreq = 'weekly', priority = '0.8') => {
  const loc = `${SITE_URL}${route}`;
  return `  <url><loc>${escapeXml(loc)}</loc><lastmod>${DATE}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
};

const getLearningRoutes = () => {
  const learningPath = path.join(ROOT, 'src', 'data', 'learning.ts');
  const content = fs.readFileSync(learningPath, 'utf8');
  const routes = [];

  const chapterRegex = /chapterId:\s*'([^']+)'[\s\S]*?units:\s*\[([\s\S]*?)\]\s*,/g;
  let chapterMatch = chapterRegex.exec(content);

  while (chapterMatch) {
    const chapterId = chapterMatch[1];
    const unitsBlock = chapterMatch[2];
    routes.push(`/learn-tamil/${chapterId}`);

    const unitRegex = /id:\s*'([^']+)'/g;
    let unitMatch = unitRegex.exec(unitsBlock);
    while (unitMatch) {
      routes.push(`/learn-tamil/${chapterId}/${unitMatch[1]}`);
      unitMatch = unitRegex.exec(unitsBlock);
    }

    chapterMatch = chapterRegex.exec(content);
  }

  return routes;
};

const getKurralRoutes = (max = 1330) => {
  const routes = [];
  for (let id = 1; id <= max; id += 1) {
    routes.push(`/kurral/${id}`);
  }
  return routes;
};

const uniqueRoutes = Array.from(
  new Set([
    ...STATIC_ROUTES,
    ...getLearningRoutes(),
    ...getKurralRoutes(),
  ]),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueRoutes
  .map((route) => {
    if (route.startsWith('/kurral/')) {
      return makeUrlEntry(route, 'monthly', '0.6');
    }
    if (route.startsWith('/learn-tamil/')) {
      return makeUrlEntry(route, 'weekly', '0.7');
    }
    return makeUrlEntry(route);
  })
  .join('\n')}\n</urlset>\n`;

const outputPath = path.join(ROOT, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated sitemap with ${uniqueRoutes.length} URLs at ${outputPath}`);
