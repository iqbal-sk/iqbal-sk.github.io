import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Substack — see DESIGN.md "Substack list"

   Inline list, no cards. Date hangs in left margin (mono).
   Title in Instrument Serif italic. Snippet in body sans. ↗ on hover.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

function stripHtml(s, limit = 180) {
  if (!s) return '';
  let x = s.replace(/<!\[CDATA\[|\]\]>/g, '');
  const div = document.createElement('div');
  div.innerHTML = x;
  x = (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  if (limit && x.length > limit) x = x.slice(0, limit - 1) + '…';
  return x;
}

function parseRss(xmlText, max = 3) {
  try {
    const doc = new window.DOMParser().parseFromString(xmlText, 'text/xml');
    return Array.from(doc.querySelectorAll('item'))
      .slice(0, max)
      .map((it) => ({
        title: it.querySelector('title')?.textContent || 'Untitled',
        link: it.querySelector('link')?.textContent || '#',
        pubDate: it.querySelector('pubDate')?.textContent || '',
        description: it.querySelector('description')?.textContent || '',
      }));
  } catch {
    return [];
  }
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function SubstackHighlights() {
  const { substack } = siteConfig || {};
  const max = substack?.maxPosts ?? 3;
  const home = substack?.home;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const base = import.meta.env.BASE_URL || '';
        const res = await fetch(`${base}substack.json`, { cache: 'no-store' });
        if (res.ok) {
          const j = await res.json();
          if (!cancelled) setPosts(j.slice(0, max));
          return;
        }
      } catch { /* fall through */ }
      if (!substack?.feedUrl) return;
      try {
        const r = await fetch(substack.feedUrl);
        if (!r.ok) return;
        const t = await r.text();
        if (!cancelled) setPosts(parseRss(t, max));
      } catch { /* silent */ }
    }
    run();
    return () => { cancelled = true; };
  }, [substack?.feedUrl, max]);

  return (
    <section
      id="writing"
      className="relative max-w-page mx-auto px-6 md:px-10 py-24 md:py-32"
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        <div />
        <div>
          <header className="mb-10">
            <motion.h2
              className="font-display flex items-baseline gap-4"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.02em',
                  fontWeight: 500,
                  position: 'relative',
                  top: '-0.45em',
                }}
              >
                §3
              </span>
              <span style={{ fontWeight: 500 }}>Writing.</span>
            </motion.h2>
            <p
              className="mt-3 max-w-[60ch] italic font-display"
              style={{
                fontSize: '1.125rem',
                color: 'var(--ink-muted)',
                lineHeight: 1.5,
              }}
            >
              {substack?.tagline}
            </p>
          </header>

          <ol className="list-none" style={{ borderTop: '1px solid var(--rule)' }}>
            {(posts || []).map((p, i) => {
              const date = fmtDate(p.pubDate);
              const title = stripHtml(p.title, 140);
              const summary = stripHtml(p.description, 220);
              return (
                <motion.li
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] md:gap-x-12 py-8"
                  style={{ borderBottom: '1px solid var(--rule)' }}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
                >
                  <aside
                    className="font-mono mb-2 md:mb-0 md:pt-1.5 tabular"
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    {date}
                  </aside>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block link-ext"
                    style={{ display: 'block' }}
                  >
                    <h3
                      className="font-display"
                      style={{
                        fontSize: '1.5rem',
                        lineHeight: 1.25,
                        letterSpacing: '-0.005em',
                        fontWeight: 500,
                      }}
                    >
                      {title}
                      <span
                        className="ext-glyph inline-block ml-2 align-middle"
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--accent)',
                        }}
                      >
                        ↗
                      </span>
                    </h3>
                    {summary && (
                      <p
                        className="mt-3 line-clamp-3"
                        style={{
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          color: 'var(--ink-muted)',
                          maxWidth: '60ch',
                        }}
                      >
                        {summary}
                      </p>
                    )}
                  </a>
                </motion.li>
              );
            })}
          </ol>

          {home && (
            <div className="mt-8">
              <a
                href={home}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-ext font-mono"
                style={{ color: 'var(--accent)', fontSize: '0.8125rem' }}
              >
                read more on substack<span className="ext-glyph">↗</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
