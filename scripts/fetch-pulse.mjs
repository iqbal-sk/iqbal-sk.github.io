import fs from 'node:fs/promises';
import path from 'node:path';
import siteConfig from '../src/siteConfig.js';

const username = process.env.PULSE_GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || 'iqbal-sk';
const token = process.env.PULSE_GITHUB_TOKEN;
const DAYS = Number(process.env.PULSE_DAYS || 30);

if (!token) {
  console.warn('[fetch-pulse] Missing PULSE_GITHUB_TOKEN. Skipping pulse.json');
  process.exit(0);
}

const toISO = (d) => d.toISOString();

async function fetchContributionsByDay(login) {
  // Overall contributions: commits + PRs + issues + reviews
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }
  `;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  const byDay = new Map();
  for (const w of weeks) {
    for (const d of (w.contributionDays || [])) {
      const key = new Date(d.date).toISOString().slice(0,10);
      const cnt = Number(d.contributionCount) || 0;
      byDay.set(key, (byDay.get(key) || 0) + cnt);
    }
  }
  return byDay;
}

async function main() {
  const to = new Date();
  let byDay;
  try {
    byDay = await fetchContributionsByDay(username);
  } catch (e) {
    console.warn('[fetch-pulse] GraphQL failed:', e.message);
    return;
  }
  const arr = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-DAYS);
  const outDir = path.join(process.cwd(), 'public');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'pulse.json'), JSON.stringify(arr, null, 2));
  console.log(`[fetch-pulse] Wrote ${arr.length} days to public/pulse.json for ${username}`);
}

main();
