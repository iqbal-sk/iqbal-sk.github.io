import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Segmented switch with a smooth sliding background thumb. No content animation.
export default function SegmentedSwitch({
  options = [], // [{label: ReactNode, value}]
  value,
  onChange,
  className = "",
  buttonClassName = "px-3 py-1.5 text-sm",
}) {
  const wrapRef = useRef(null);
  const btnRefs = useRef(new Map());
  const thumbRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const setThumb = () => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    // Prefer querying by data attributes to avoid stale ref maps
    let btn = null;
    if (wrap) {
      btn = wrap.querySelector(`[data-role="seg-btn"][data-value="${value}"]`);
    }
    if (!btn) btn = btnRefs.current.get(value);
    if (!wrap || !thumb || !btn) return;
    const wr = wrap.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    // Add tiny overlap to hide any seam while transitioning
    const overlap = 2; // px total (1px each side)
    let left = br.left - wr.left - overlap / 2;
    let width = br.width + overlap;
    if (left < 0) { width += left; left = 0; }
    if (left + width > wr.width) { width = wr.width - left; }
    thumb.style.transform = `translateX(${left}px)`;
    thumb.style.width = `${Math.max(0, width)}px`;
  };

  useLayoutEffect(() => {
    setThumb();
    setMounted(true);
    // schedule a second measurement to avoid font/layout jitter
    const id = requestAnimationFrame(() => setThumb());
    return () => cancelAnimationFrame(id);
  }, [value]);

  useEffect(() => {
    const onR = () => setThumb();
    window.addEventListener("resize", onR);
    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => setThumb());
      if (wrapRef.current) ro.observe(wrapRef.current);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setThumb()).catch(() => {});
    }
    return () => {
      window.removeEventListener("resize", onR);
      if (ro) ro.disconnect();
    };
  }, []);

  const handleWrapClick = (e) => {
    // Fallback: capture clicks anywhere inside and switch to closest/targeted button
    const targetBtn = e.target.closest && e.target.closest('[data-role="seg-btn"]');
    if (targetBtn && onChange) {
      const v = targetBtn.getAttribute('data-value');
      if (v != null) onChange(v);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`relative inline-flex items-center rounded-md border border-border bg-card overflow-hidden select-none ${className}`}
      role="tablist"
      onClick={handleWrapClick}
    >
      <div
        ref={thumbRef}
        aria-hidden
        className="absolute top-0 bottom-0 left-0 rounded-md bg-primary shadow-sm will-change-transform pointer-events-none"
        style={{
          width: 0,
          transition: mounted
            ? 'transform 420ms cubic-bezier(0.22,1,0.36,1), width 420ms cubic-bezier(0.22,1,0.36,1)'
            : 'none',
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          ref={(el) => btnRefs.current.set(opt.value, el)}
          onClick={() => onChange && onChange(opt.value)}
          data-role="seg-btn"
          data-value={String(opt.value)}
          type="button"
          className={`relative z-[2] ${buttonClassName} transition-colors duration-300 pointer-events-auto ${
            value === opt.value ? "text-primary-foreground" : "text-foreground hover:bg-muted/60"
          }`}
          aria-pressed={value === opt.value}
          aria-label={opt.aria || opt.ariaLabel || undefined}
          title={typeof opt.label === 'string' ? undefined : (opt.aria || opt.ariaLabel || '')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
