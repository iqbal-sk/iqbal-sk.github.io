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

async function fetchWithHeaders(url) {
  // Mimic a browser to avoid feed blocking by some CDNs
  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };
  // Best-effort referer
  try { headers['Referer'] = new URL(url).origin + '/'; } catch {}
  return fetch(url, { headers });
}

async function writeItems(items) {
  const outDir = path.join(process.cwd(), 'public');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'substack.json'), JSON.stringify(items, null, 2));
  console.log(`[fetch-substack] Wrote ${items.length} posts to public/substack.json`);
}

function stripTags(html) {
  return String(html || '')
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHomepageForPosts(html, host, max = 3) {
  const items = [];
  const linkRe = new RegExp(`https?:\\/\\/${host.replace(/\./g, '\\.') }\/p\/[^"'>]+`, 'g');
  const seen = new Set();
  const links = [];
  let m;
  while ((m = linkRe.exec(html)) && links.length < max * 2) {
    const href = m[0];
    if (!seen.has(href)) { seen.add(href); links.push(href); }
  }
  for (const href of links.slice(0, max)) {
    // Try to capture the anchor text around this href for a title
    const anchorRe = new RegExp(`<a[^>]+href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>([\n\r\t\s\S]{0,200}?)<\\/a>`, 'i');
    const am = html.match(anchorRe);
    const raw = am ? stripTags(am[1]) : '';
    const title = raw || 'Read on Substack';
    items.push({ title, link: href, pubDate: '', description: '', image: '' });
  }
  return items;
}

try {
  let res = await fetchWithHeaders(feedUrl);
  if (!res.ok) {
    // Fallback: try via r.jina.ai simple fetch proxy (read-only) to bypass feed blocking
    const proxied = `https://r.jina.ai/http://${new URL(feedUrl).host}/feed`;
    console.warn(`[fetch-substack] Primary fetch failed (HTTP ${res.status}). Trying proxy: ${proxied}`);
    res = await fetchWithHeaders(proxied);
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const items = parseRss(text, maxPosts);
  await writeItems(items);
} catch (e) {
  console.warn('[fetch-substack] Failed to fetch feed:', e.message);
  // Try homepage via proxy as a last resort (extract recent /p/... links)
  try {
    const host = new URL(feedUrl).host;
    const homeProxy = `https://r.jina.ai/http://${host}/`;
    const resHome = await fetchWithHeaders(homeProxy);
    if (!resHome.ok) throw new Error(`home HTTP ${resHome.status}`);
    const html = await resHome.text();
    const items = parseHomepageForPosts(html, host, maxPosts);
    if (items.length) {
      await writeItems(items);
      console.log('[fetch-substack] Used homepage fallback via proxy');
      process.exit(0);
    }
  } catch (e2) {
    console.warn('[fetch-substack] Homepage fallback failed:', e2.message);
  }

  // Preserve previous substack.json if present so deploys don’t blank out content
  try {
    const existing = await fs.readFile(path.join(process.cwd(), 'public', 'substack.json'), 'utf-8');
    const items = JSON.parse(existing);
    await writeItems(items);
    console.log('[fetch-substack] Kept existing substack.json due to fetch failure');
  } catch {
    console.warn('[fetch-substack] No existing substack.json to preserve');
  }
}
