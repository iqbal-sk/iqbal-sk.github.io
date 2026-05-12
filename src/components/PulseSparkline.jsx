import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/* ---------------------------------------------------------------
   Pulse — see DESIGN.md "Pulse hairline"

   Ambient 30-day GitHub contribution line. Hairline weight,
   Logic Blue. Draws in once on enter. Single endpoint pulse.
   --------------------------------------------------------------- */

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

const LINE_H = 56;
const VB_H = 72;

export default function PulseSparkline({
  days = 30,
  microcopy = '30-day pulse · shipped iterations.',
  className = '',
}) {
  const { loading, data } = useStaticPulse({ days });
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef, { once: true, margin: '-80px' });

  const points = useMemo(
    () => data.map((d, i) => ({ x: i, y: Number(d.count) || 0 })),
    [data],
  );

  const { path, endX, endY, pathLen } = useMemo(() => {
    if (!points.length) return { path: '', endX: 100, endY: LINE_H / 2, pathLen: 0 };
    const max = Math.max(1, ...points.map((p) => p.y));
    const step = 100 / Math.max(1, points.length - 1);
    const toY = (v) => LINE_H - (v / max) * (LINE_H * 0.78) - LINE_H * 0.09;
    let d = `M 0 ${toY(points[0].y)}`;
    for (let i = 1; i < points.length; i++) {
      const x = Math.round(i * step * 100) / 100;
      const y = toY(points[i].y);
      d += ` L ${x} ${y}`;
    }
    const last = points[points.length - 1];
    return {
      path: d,
      endX: 100,
      endY: toY(last.y),
      // overestimate path length for stroke-dashoffset (safe upper bound)
      pathLen: 200,
    };
  }, [points]);

  const labels = useMemo(() => {
    if (!data.length) return [];
    const N = data.length - 1;
    const fmt = (s) => {
      try { return new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
      catch { return ''; }
    };
    return [
      { pos: 0,   label: fmt(data[0].date) },
      { pos: 50,  label: fmt(data[Math.round(N / 2)].date) },
      { pos: 100, label: 'today' },
    ];
  }, [data]);

  return (
    <section
      id="pulse"
      ref={wrapperRef}
      className={`relative max-w-page mx-auto px-6 md:px-10 pt-16 pb-12 ${className}`}
      aria-label={microcopy}
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        <div
          className="font-mono mb-3 md:mb-0 md:pt-1"
          style={{
            fontSize: '0.75rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Activity, 30d
        </div>

        <div>
          <p
            className="font-mono"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--ink-muted)',
            }}
          >
            {microcopy}
          </p>

          <div className="relative mt-4" aria-hidden>
            <svg
              viewBox={`0 0 100 ${VB_H}`}
              preserveAspectRatio="none"
              className="block w-full"
              style={{ height: '68px' }}
              role="presentation"
            >
              {/* Faint baseline */}
              <line
                x1="0" y1={LINE_H - 5}
                x2="100" y2={LINE_H - 5}
                stroke="var(--rule-strong)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />

              {/* The line */}
              <path
                d={path}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: pathLen,
                  strokeDashoffset: inView && !loading ? 0 : pathLen,
                  transition: 'stroke-dashoffset 1200ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              />

              {/* Endpoint pulse — only one continuous motion on the page */}
              {!loading && (
                <g>
                  <circle
                    cx={endX}
                    cy={endY}
                    r="1.6"
                    fill="var(--accent)"
                    opacity={inView ? 1 : 0}
                    style={{ transition: 'opacity 600ms ease-out 1000ms' }}
                  >
                    <animate
                      attributeName="r"
                      values="1.4;2.2;1.4"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;1;0.6"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          {labels.length > 0 && (
            <div
              className="mt-2 flex items-center justify-between font-mono tabular"
              style={{
                fontSize: '0.6875rem',
                color: 'var(--ink-faint)',
              }}
            >
              {labels.map((l, i) => (
                <span key={i}>{l.label}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
