import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/* ---------------------------------------------------------------
   CountUp — RAF-driven number tween, fires once on viewport entry.
   Handles integers + decimals, optional prefix/suffix.

     <CountUp to={7}    prefix="+"  suffix="pp" />
     <CountUp to={95}   prefix="≈"  suffix="%"  />
     <CountUp to={800}                suffix="K" />
   --------------------------------------------------------------- */

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  duration = 1200,
  delay = 0,
  decimals = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf;
    let start;
    const tick = (ts) => {
      if (!start) start = ts + delay;
      const elapsed = ts - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      const next = from + (to - from) * eased;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration, delay, reduced]);

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toString();

  return (
    <span ref={ref} className="tabular">
      {prefix}{display}{suffix}
    </span>
  );
}
