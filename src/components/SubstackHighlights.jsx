import React, { useEffect, useState, useMemo } from "react";
import siteConfig from "../siteConfig";

function parseRss(xmlText, max = 2) {
  try {
    const doc = new window.DOMParser().parseFromString(xmlText, "text/xml");
    const items = Array.from(doc.querySelectorAll("item")).slice(0, max).map((it) => {
      const title = it.querySelector("title")?.textContent || "Untitled";
      const link = it.querySelector("link")?.textContent || "#";
      const pubDate = it.querySelector("pubDate")?.textContent || "";
      const description = it.querySelector("description")?.textContent || "";
      const encoded = it.querySelector("content\\:encoded")?.textContent || description;
      // Try media tags first
      const media = it.querySelector('media\\:content, media\\:thumbnail, enclosure[type^="image"]');
      let image = media?.getAttribute('url') || media?.getAttribute('href') || '';
      if (!image && encoded) {
        // Parse first <img src="...">
        const div = document.createElement('div');
        div.innerHTML = encoded;
        const img = div.querySelector('img');
        if (img) image = img.getAttribute('src') || '';
      }
      return { title, link, pubDate, description: encoded || description, image };
    });
    return items;
  } catch {
    return [];
  }
}

export default function SubstackHighlights() {
  const { substack } = siteConfig || {};
  const feedUrl = substack?.feedUrl;
  const maxPosts = substack?.maxPosts ?? 2;
  const title = substack?.title || "Where I Think Out Loud";
  const tagline = substack?.tagline || "I document what I learn while building — experiments, design notes, and the philosophy of iteration.";
  const cta = substack?.cta || { label: "Read more on Substack", href: substack?.home || feedUrl };

  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const clean = (s, limit = 220) => {
    if (!s) return "";
    let x = s.replace(/<!\[CDATA\[|\]\]>/g, "");
    const div = document.createElement('div');
    div.innerHTML = x;
    x = div.textContent || div.innerText || '';
    x = x.replace(/\s+/g, ' ').trim();
    if (limit && x.length > limit) x = x.slice(0, limit - 1) + '…';
    return x;
  };

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoaded(false);
      // Try build-time JSON first to avoid CORS
      try {
        const resJson = await fetch(`${import.meta.env.BASE_URL || ''}substack.json`, { cache: 'no-store' });
        if (resJson.ok) {
          const j = await resJson.json();
          if (!cancelled) { setPosts(j.slice(0, maxPosts)); setLoaded(true); return; }
        }
      } catch {}
      if (!feedUrl) { setLoaded(true); return; }
      try {
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error("substack_fetch");
        const text = await res.text();
        const items = parseRss(text, maxPosts);
        if (!cancelled) setPosts(items);
      } catch {
        // fail silently; CTA remains
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [feedUrl, maxPosts]);

  return (
    <section id="substack" className="pt-10 pb-6">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-foreground">{title}</h2>
          {tagline && (
            <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(posts || []).map((p, i) => {
            const date = p.pubDate ? new Date(p.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            const title = clean(p.title, 140);
            const summary = clean(p.description, 180);
            const img = p.image || `${import.meta.env.BASE_URL || ''}placeholder.svg`;
            return (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
                 className="group block rounded-[16px] border border-border bg-card overflow-hidden transition-all hover:bg-muted/60 hover:-translate-y-0.5">
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                  <img src={img} alt="Post thumbnail" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="px-5 pt-4 text-xs text-muted-foreground">{date}</div>
                <div className="px-5 mt-1 text-lg font-semibold text-foreground">
                  <span className="bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:underline">
                    {title}
                  </span>
                </div>
                {summary && (
                  <div className="px-5 mt-2 text-sm text-muted-foreground line-clamp-3">{summary}</div>
                )}
                <div className="px-5 pb-4 mt-3 text-primary text-sm inline-flex items-center opacity-90 group-hover:opacity-100">
                  Read →
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          {cta?.href && (
            <a href={cta.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
