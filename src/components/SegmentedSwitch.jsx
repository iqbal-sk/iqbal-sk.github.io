import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Quiet segmented switch with a sliding thumb. Used by the theme toggle.
// Styled to match DESIGN.md tokens (mono labels, thin rule border, accent-soft thumb).
export default function SegmentedSwitch({
  options = [],
  value,
  onChange,
  className = '',
  buttonClassName = 'px-2 py-1 text-xs',
}) {
  const wrapRef = useRef(null);
  const btnRefs = useRef(new Map());
  const thumbRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const setThumb = () => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    let btn = null;
    if (wrap) {
      btn = wrap.querySelector(`[data-role="seg-btn"][data-value="${value}"]`);
    }
    if (!btn) btn = btnRefs.current.get(value);
    if (!wrap || !thumb || !btn) return;
    const wr = wrap.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const overlap = 2;
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
    const id = requestAnimationFrame(() => setThumb());
    return () => cancelAnimationFrame(id);
    // setThumb closes over refs, value is the only meaningful trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const onR = () => setThumb();
    window.addEventListener('resize', onR);
    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => setThumb());
      if (wrapRef.current) ro.observe(wrapRef.current);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setThumb()).catch(() => {});
    }
    return () => {
      window.removeEventListener('resize', onR);
      if (ro) ro.disconnect();
    };
    // Mount-only effect; setThumb reads from refs at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWrapClick = (e) => {
    const targetBtn = e.target.closest && e.target.closest('[data-role="seg-btn"]');
    if (targetBtn && onChange) {
      const v = targetBtn.getAttribute('data-value');
      if (v != null) onChange(v);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`relative inline-flex items-center rounded-sm overflow-hidden select-none ${className}`}
      style={{
        border: '1px solid var(--rule-strong)',
        background: 'transparent',
      }}
      role="tablist"
      onClick={handleWrapClick}
    >
      <div
        ref={thumbRef}
        aria-hidden
        className="absolute top-0 bottom-0 left-0 will-change-transform pointer-events-none"
        style={{
          width: 0,
          background: 'var(--accent-soft)',
          borderRight: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
          borderLeft: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
          transition: mounted
            ? 'transform 380ms cubic-bezier(0.23, 1, 0.32, 1), width 380ms cubic-bezier(0.23, 1, 0.32, 1)'
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
          className={`relative z-[2] ${buttonClassName} transition-colors duration-200 pointer-events-auto inline-flex items-center justify-center font-mono`}
          style={{
            color: value === opt.value ? 'var(--accent)' : 'var(--ink-muted)',
          }}
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
