import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// SwitchReveal animates a circular mask that originates at the switch button,
// clipping in the NEXT content over the CURRENT one for a smooth, directional swap.
export default function SwitchReveal({ id, originRef, duration = 380, className = "", children }) {
  const wrapRef = useRef(null);
  const [current, setCurrent] = useState(children);
  const [next, setNext] = useState(null); // element to reveal
  const [geom, setGeom] = useState(null); // {cx, cy, r}
  const resetTimer = useRef(null);

  // Compute circle geometry relative to wrapper
  const compute = () => {
    const wrap = wrapRef.current;
    const origin = originRef?.current;
    if (!wrap || !origin) return null;
    const wr = wrap.getBoundingClientRect();
    const or = origin.getBoundingClientRect();
    const cx = or.left + or.width / 2 - wr.left;
    const cy = or.top + or.height / 2 - wr.top;
    const r = Math.ceil(
      Math.max(
        Math.hypot(cx - 0, cy - 0),
        Math.hypot(cx - wr.width, cy - 0),
        Math.hypot(cx - 0, cy - wr.height),
        Math.hypot(cx - wr.width, cy - wr.height)
      )
    );
    return { cx, cy, r };
  };

  useEffect(() => {
    // When id changes, prepare the next child and geometry
    if (!wrapRef.current) { setCurrent(children); return; }
    const g = compute();
    setNext(children);
    setGeom(g);
    const t = setTimeout(() => {
      setCurrent(children);
      setNext(null);
      setGeom(null);
    }, duration + 40);
    resetTimer.current = t;
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, children]);

  useLayoutEffect(() => {
    if (!geom) return;
    const wrap = wrapRef.current;
    const node = wrap?.querySelector('[data-reveal]');
    if (!wrap || !node) return;

    // Freeze container height to avoid jump when contents differ
    try {
      const base = wrap.children[0];
      const baseH = base ? base.getBoundingClientRect().height : 0;
      const nextInner = node.firstChild; // the wrapper we render
      const nextH = nextInner ? nextInner.getBoundingClientRect().height : 0;
      const h = Math.max(baseH, nextH);
      wrap.style.height = h + 'px';
      wrap.style.willChange = 'clip-path, height';
      wrap.style.backfaceVisibility = 'hidden';
      wrap.style.transform = 'translateZ(0)';
    } catch {}

    // set initial circle small
    node.style.position = 'absolute';
    node.style.inset = '0';
    node.style.zIndex = '1';
    node.style.pointerEvents = 'none';
    node.style.WebkitClipPath = `circle(0px at ${geom.cx}px ${geom.cy}px)`;
    node.style.clipPath = `circle(0px at ${geom.cx}px ${geom.cy}px)`;

    const rafId = requestAnimationFrame(() => {
      node.style.transition = `clip-path ${duration}ms cubic-bezier(0.2,0.6,0.2,1)`;
      node.style.WebkitClipPath = `circle(${geom.r}px at ${geom.cx}px ${geom.cy}px)`;
      node.style.clipPath = `circle(${geom.r}px at ${geom.cx}px ${geom.cy}px)`;
    });

    // clear inline height after transition completes
    const clearT = setTimeout(() => {
      if (wrapRef.current) {
        wrapRef.current.style.height = '';
        wrapRef.current.style.willChange = '';
        wrapRef.current.style.backfaceVisibility = '';
        wrapRef.current.style.transform = '';
      }
    }, duration + 60);

    return () => { cancelAnimationFrame(rafId); clearTimeout(clearT); };
  }, [geom, duration]);

  return (
    <div ref={wrapRef} className={"relative " + className}>
      {/* Base (current) content */}
      <div>{current}</div>
      {/* Overlay (next) content with reveal mask */}
      {next && (
        <div data-reveal>
          <div style={{ height: '100%' }}>{next}</div>
        </div>
      )}
    </div>
  );
}
