import { useEffect, useState, useRef } from "react";
import CalendlyButton from "./CalendlyButton";
import siteConfig from "../siteConfig";

/* --- visibility hook --- */
function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

function useTypewriter(text, { speed = 65, start = true } = {}) {
  const [out, setOut] = useState(start ? "" : text);
  const [done, setDone] = useState(!start);
  useEffect(() => {
    if (!start) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { out, done };
}

// put this OUTSIDE the component so it’s stable
const DEFAULT_EASING = (t) => 1 - Math.pow(1 - t, 3);

function useRafTween(active, { duration = 900, easing = DEFAULT_EASING } = {}) {
  const [p, setP] = useState(0); // 0..1

  useEffect(() => {
    if (!active) {
      setP(0);
      return;
    }
    let raf, start;

    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      setP(easing(t)); // <- use stable function
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // ✅ do NOT depend on `easing` (it changes identity across renders)
  }, [active, duration]);

  return p;
}

const Hero = ({ title, subtitle, className = "", dense = false }) => {
  const line1 =
    "Building software that learns — and helps people do the same.";
  const line2 = ""; // no second line for the new hero

  const { out: typed1, done: done1 } = useTypewriter(line1, {
    speed: 65,
    start: false, // render immediately (no typing animation)
  });

  // track first time both: typed is done AND line1 is on screen
  const [revealed, setRevealed] = useState(false);

  // watch visibility of line1
  const line1Ref = useRef(null);
  const line1OnScreen = useOnScreen(line1Ref);

  // delay before showing line2 once both conditions met
  useEffect(() => {
    if (revealed || !done1 || !line1OnScreen) return;
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, [revealed, done1, line1OnScreen]);

  const s =
    subtitle ??
    "From backend systems to large language models, I love shaping ideas that grow smarter over time.";

  // animate line2 reveal when `revealed` becomes true
  const reveal = useRafTween(revealed, { duration: 900 });

  const headlineSize = dense
    ? "text-[40px] leading-tight md:text-[56px] lg:text-[72px]"
    : "text-[44px] leading-tight md:text-[64px] lg:text-[80px]";

  const padY = dense
    ? "pt-20 md:pt-28 lg:pt-32 pb-16"
    : "pt-28 md:pt-36 lg:pt-44 pb-28";

  return (
    <section
      id="hero"
      className={`relative -mt-12 overflow-x-hidden overflow-y-visible ${className}`}
    >
      {/* ---- Background: single gradient + grain (no dark mode) ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* diagonal glassy gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #e8f2ff 0%, #d1e7fe 8%, #b8d4f1 16%, #9fb8e3 24%, #f8fafc 32%, #e2e8f0 40%, #cbd5e1 48%, #94a3b8 56%, #f1f5f9 64%, #c7d2fe 72%, #a5b4fc 80%, #8b5cf6 88%, #e8f2ff 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 90%, transparent 100%)",
          }}
        />
        {/* soft radial overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(241,243,251,0.4) 0%, rgba(233,237,247,0.2) 35%, rgba(218,223,236,0.1) 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.3) 60%, rgba(248,250,252,0.8) 85%, #f8fafc 100%)",
          }}
        />
        {/* grain */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22 viewBox=%220 0 140 140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')",
            backgroundSize: "140px 140px",
          }}
        />
        {/* soft white veil */}
        <div className="absolute inset-0 backdrop-blur-3xl backdrop-saturate-200 bg-white/8" />
        {/* subtle shimmer */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* removed top haze here to avoid visible band under the header; header provides its own glass gradient */}

      {/* Pull content closer to top: was py-40/52/60; now tighter */}
      <div className={`${padY} bg-transparent`}>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="mx-auto max-w-[36rem] lg:max-w-[42rem]">
            {/* Headline */}
            <h1
              className="
              relative z-10 flex flex-col
              font-semibold tracking-[-0.02em]
              ${headlineSize}
              text-transparent bg-clip-text
              bg-[linear-gradient(183deg,rgba(236,241,253,0)_13.9%,rgba(236,241,253,0.30)_121.71%),linear-gradient(0deg,#2E3038,#2E3038)]"
            >
              {/* First line */}
              <span ref={line1Ref} className="whitespace-nowrap">
                {typed1}
              </span>

              {/* No second line in new hero */}
            </h1>
            {/* Subtitle */}
            <p
              className="
                mt-3 text-transparent bg-clip-text
                text-lg md:text-xl lg:text-2xl font-medium tracking-tight
                bg-[linear-gradient(183deg,rgba(236,241,253,0)_13.9%,rgba(236,241,253,0.30)_121.71%),linear-gradient(0deg,#2E3038,#2E3038)]
              "
            >
              {s}
            </p>

            {/* CTAs removed per new concise hero */}
          </div>
        </div>
      </div>

      {/* bottom haze strip (single) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-10 h-20 w-full backdrop-blur-2xl
                  [mask-image:linear-gradient(to_bottom,black_65%,rgba(0,0,0,0.88)_75%,transparent_100%)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(221,226,238,0.40) 0%, rgba(221,226,238,0.00) 100%)",
        }}
      />
    </section>
  );
};

export default Hero;
