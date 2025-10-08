import fs from 'node:fs/promises';
import path from 'node:path';
import siteConfig from '../src/siteConfig.js';

const feedUrl = siteConfig?.substack?.feedUrl || process.env.SUBSTACK_FEED_URL;
const maxPosts = siteConfig?.substack?.maxPosts ?? 2;

if (!feedUrl) {
  console.log('[fetch-substack] No feedUrl configured. Skip.');
  process.exit(0);
}

function parseRss(xmlText, max = 2) {
  const items = [];
  const itemRe = /<item[\s\S]*?<\/item>/gi;
  const titleRe = /<title>([\s\S]*?)<\/title>/i;
  const linkRe = /<link>([\s\S]*?)<\/link>/i;
  const dateRe = /<pubDate>([\s\S]*?)<\/pubDate>/i;
  const descRe = /<description>([\s\S]*?)<\/description>/i;
  const encRe = /<content:encoded>([\s\S]*?)<\/content:encoded>/i;
  const mediaRe = /<(?:media:content|media:thumbnail|enclosure)[^>]+(?:url|href)="([^"]+)"/i;
  const matches = xmlText.match(itemRe) || [];
  for (const raw of matches.slice(0, max)) {
    const title = (raw.match(titleRe)?.[1] || '').trim();
    const link = (raw.match(linkRe)?.[1] || '').trim();
    const pubDate = (raw.match(dateRe)?.[1] || '').trim();
    const description = (raw.match(encRe)?.[1] || raw.match(descRe)?.[1] || '').trim();
    let image = raw.match(mediaRe)?.[1] || '';
    if (!image && description) {
      const m = description.match(/<img[^>]+src="([^"]+)"/i);
      if (m) image = m[1];
    }
    items.push({ title, link, pubDate, description, image });
  }
  return items;
}

try {
  const res = await fetch(feedUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const items = parseRss(text, maxPosts);
  const outDir = path.join(process.cwd(), 'public');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'substack.json'), JSON.stringify(items, null, 2));
  console.log(`[fetch-substack] Wrote ${items.length} posts to public/substack.json`);
} catch (e) {
  console.warn('[fetch-substack] Failed to fetch feed:', e.message);
  // Write empty file so client fetch 404/empty gracefully
}
