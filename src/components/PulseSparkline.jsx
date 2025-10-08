import React, { useEffect, useMemo, useState } from "react";

// Lightweight, decorative GitHub pulse sparkline
// Notes
// - No headings, borders, or grids. One subtle animated line.
// - Falls back gracefully if rate-limited or offline.

// (No network here) — pulse data comes from build-time JSON at /pulse.json

function useStaticPulse({ days = 30 }) {
  const [state, setState] = useState({ loading: true, data: [] });
  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL || ''}pulse.json`, { cache: 'no-store' });
        if (!res.ok) throw new Error('no_static_pulse');
        const arr = await res.json();
        const data = Array.isArray(arr) ? arr.slice(-days) : [];
        if (!cancelled) setState({ loading: false, data });
        return;
      } catch {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days + 1);
        const arr = Array.from({ length: days }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return { date: d.toISOString().slice(0, 10), count: 0 };
        });
        if (!cancelled) setState({ loading: false, data: arr });
      }
    }
    run();
    return () => { cancelled = true; };
  }, [days]);
  return state;
}

// Build a smooth path using Catmull–Rom to cubic Bézier conversion
function buildPath(points, w = 100, h = 40) {
  if (!points.length) return "";
  // Damp spikes a touch and smooth via moving average
  const smoothed = points.map((p, i, arr) => {
    const a = arr[Math.max(0, i - 1)]?.y ?? p.y;
    const b = p.y;
    const c = arr[Math.min(arr.length - 1, i + 1)]?.y ?? p.y;
    const avg = (a + b + c) / 3;
    // compress peaks for a calmer line
    const y = Math.pow(Math.max(0, avg), 0.7);
    return { x: i, y };
  });

  const max = Math.max(1, ...smoothed.map((p) => p.y));
  const step = w / (smoothed.length - 1);
  const toX = (i) => Math.round(i * step * 100) / 100;
  const toY = (v) => h - (v / max) * (h * 0.78) - h * 0.09; // generous inner padding

  const P = smoothed.map((p, i) => ({ x: toX(i), y: toY(p.y) }));
  if (P.length < 2) return "";
  let d = `M ${P[0].x} ${P[0].y}`;
  const tension = 0.4; // 0..1
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function PulseSparkline({
  days = 30,
  microcopy = "30-day pulse: shipped iterations.",
  microPosition = 'above', // 'above' | 'below'
  smooth = false, // draw straight segments by default
  className = "",
}) {
  const { loading, data } = useStaticPulse({ days });
  const [hover, setHover] = useState(null);

  const points = useMemo(() => data.map((d, i) => ({ x: i, y: Number(d.count) || 0 })), [data]);
  const LINE_H = 72; // taller drawing band for more vertical detail
  const VB_H = 72;
  const { path, plotPoints } = useMemo(() => {
    if (smooth) return { path: buildPath(points, 100, LINE_H), plotPoints: [] };
    if (!points.length) return { path: "", plotPoints: [] };
    const max = Math.max(1, ...points.map((p) => p.y));
    const step = 100 / Math.max(1, points.length - 1);
    const toY = (v) => LINE_H - (v / max) * (LINE_H * 0.78) - LINE_H * 0.09;
    let d = `M 0 ${toY(points[0].y)}`;
    const PP = [{ x: 0, y: toY(points[0].y) }];
    for (let i = 1; i < points.length; i++) {
      const x = Math.round(i * step * 100) / 100;
      const y = toY(points[i].y);
      d += ` L ${x} ${y}`;
      PP.push({ x, y });
    }
    return { path: d, plotPoints: PP };
  }, [points, smooth]);
  // Estimate end point for the breathing dot
  const max = Math.max(1, ...points.map((p) => p.y));
  const endY = useMemo(() => {
    if (!points.length) return LINE_H / 2;
    const v = points[points.length - 1].y;
    const h = LINE_H;
    return h - (v / Math.max(1, max)) * (h * 0.78) - h * 0.09;
  }, [points, max]);

  // Minimal labels: start • midpoint • today
  const labels = useMemo(() => {
    if (!data.length) return [];
    const N = data.length - 1;
    const idx = [0, Math.round(N / 2), N];
    const fmt = (s) => {
      try {
        return new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } catch { return ''; }
    };
    return idx.map((i, k) => ({ x: k === 0 ? 0 : k === 1 ? 50 : 100, label: i === N ? 'Today' : fmt(data[i].date) }));
  }, [data]);

  return (
    <div className={`mx-auto max-w-5xl px-5 md:px-8 ${className}`} aria-label={microcopy}>
      {microPosition === 'above' && (
        <div className="text-sm text-muted-foreground mb-2">{microcopy}</div>
      )}
      <div className="w-full relative" aria-hidden>
        <svg viewBox={`0 0 100 ${VB_H}`} preserveAspectRatio="none" className="block w-full h-[88px]" role="presentation">
          <defs>
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.4" result="b" />
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g style={{ color: 'var(--primary)' }}>
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#pulseGlow)"
              style={{
                strokeDasharray: 360,
                strokeDashoffset: loading ? 360 : 0,
                transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            {/* Breathing end dot (signature) */}
            <circle cx="100" cy={endY} r="1.6" fill="currentColor" opacity="0.9">
              <animate attributeName="r" values="1.2;1.8;1.2" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2.4s" repeatCount="indefinite"/>
            </circle>
          </g>
          {/* Hover capture rect */}
          {!smooth && plotPoints.length > 1 && (
            <rect x="0" y="0" width="100" height={LINE_H} fill="transparent"
              onMouseMove={(e) => {
                const bbox = e.currentTarget.getBoundingClientRect();
                const rel = (e.clientX - bbox.left) / bbox.width; // 0..1
                const idx = Math.min(plotPoints.length - 1, Math.max(0, Math.round(rel * (plotPoints.length - 1))));
                setHover(idx);
              }}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'default' }}
            />
          )}
        </svg>
        {/* HTML tooltip for crisp text */}
        {hover != null && data[hover] && (
          <div style={{ left: `${plotPoints[hover]?.x ?? 0}%` }}
               className="pointer-events-none absolute -translate-x-1/2 -top-3">
            <div className="translate-y-[-100%] rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-sm">
              {new Date(data[hover].date).toLocaleDateString(undefined,{ month:'short', day:'numeric'})}
              {` · ${data[hover].count} contributions`}
            </div>
          </div>
        )}
      </div>
      {/* Labels in HTML to avoid any stretching */}
      {labels.length > 0 && (
        <div className="mt-1 text-xs md:text-[11px] text-muted-foreground/80 flex items-center justify-between px-0.5">
          <span>{labels[0].label}</span>
          <span>{labels[1].label}</span>
          <span>{labels[2].label}</span>
        </div>
      )}
      {microPosition === 'below' && (
        <div className="text-sm text-muted-foreground mt-2">{microcopy}</div>
      )}
    </div>
  );
}
