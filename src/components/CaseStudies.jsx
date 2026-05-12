import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/* ---------------------------------------------------------------
   §3 Case Studies — horizontal pinned scroll on desktop, vertical on mobile.

   Desktop: section is N×100vh tall, contents sticky, horizontal
   translation driven by scroll progress. Mobile: simple vertical
   list of compact rows.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const projects = [
  {
    title: 'Detecting Persuasion Techniques in Memes',
    subtitle: 'SemEval 2024 Task 4',
    year: '2024',
    summary:
      'State-of-the-art on the official leaderboard with a depth-aware hierarchical loss that enforces parent→child consistency in multilingual, multimodal classification.',
    detail:
      'Multilingual text encoder + vision backbone → projections → gated fusion → classifier. Vectorized tree masks built from adjacency; class-balanced sampler, label smoothing, temperature scaling. Hierarchical loss eliminated parent-child violations that flat BCE produced.',
    repo: 'https://github.com/iqbal-sk/Detecting-Persuasion-Techniques-in-Memes',
    tags: ['Multimodal', 'Transformers', 'PyTorch', 'Hierarchical Loss'],
    visual: { src: '/h-loss.png', alt: 'Hierarchical loss diagram' },
  },
  {
    title: 'Kafka Wire Protocol',
    subtitle: 'from-scratch implementation in Python',
    year: '2024',
    summary:
      'A working Kafka client/server that speaks the official wire protocol — request/response framing, CRC, and a minimal broker loop supporting Produce/Fetch + Metadata.',
    detail:
      'Encoder/decoder with strict byte-ordering. Minimal broker loop serving Metadata + Produce/Fetch against a simple append log. Wireshark-verified frames. Compatible with mainstream Kafka tooling.',
    repo: 'https://github.com/iqbal-sk/kafka-python',
    tags: ['Python', 'Binary Protocols', 'Networking'],
    visual: { src: '/Kafka.png', alt: 'Kafka protocol diagram' },
  },
  {
    title: 'CodeForge',
    subtitle: 'FastAPI + sandboxed judge for CSES',
    year: '2024',
    summary:
      'Backend + judge that brings a smooth submit → run → verdict loop to the CSES problem set, with live SSE status updates and a Dockerized sandbox.',
    detail:
      'FastAPI + Redis pubsub queue + async judge worker + SSE for live events. Mongo stores problems/cases/submissions. Docker Compose bootstraps everything. Multi-language toolchains inside judge image.',
    repo: 'https://github.com/iqbal-sk/CodeForge',
    tags: ['FastAPI', 'Redis', 'SSE', 'Docker', 'MongoDB'],
    visual: null,
  },
  {
    title: 'Redis-Compatible Server in C',
    subtitle: 'event loop, RESP, in-memory store',
    year: '2025',
    summary:
      'Redis-compatible server in C with a non-blocking event loop, RESP parser, in-memory store, and TTL scaffolding. Speaks SET/GET/PING/ECHO with redis-cli.',
    detail:
      'Single-threaded loop on select/epoll. Zero-allocation tokenizer for RESP. In-memory dict + simple time wheel for expirations. Solved partial reads, stale writes, and back-pressure on socket buffers.',
    repo: 'https://github.com/iqbal-sk/redis-c',
    tags: ['C', 'RESP', 'Event Loop', 'Systems'],
    visual: null,
  },
  {
    title: 'LLMTwin',
    subtitle: 'personal-knowledge-base ETL with ZenML',
    year: '2024',
    summary:
      'Crawls GitHub and Medium into typed, Mongo-backed documents with a ZenML pipeline. An LLM-ready knowledge base for RAG and analytics.',
    detail:
      'ZenML pipeline (user → crawl) with a dispatcher routing links to site-specific crawlers. Documents as Pydantic models via a minimal Mongo ODM. Reproducible ETL via CLI; easy to add new crawlers without touching pipeline code.',
    repo: 'https://github.com/iqbal-sk/LLMTwin',
    tags: ['ZenML', 'MongoDB', 'Pydantic', 'ETL', 'Python'],
    visual: null,
  },
];

/* ---------- Section heading ---------- */
function SectionHeading() {
  return (
    <header className="max-w-page mx-auto px-6 md:px-10 mb-10">
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        <div />
        <div>
          <motion.h2
            className="font-display flex items-baseline gap-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span
              className="font-mono section-marker"
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
            <span style={{ fontWeight: 500 }}>Case Studies.</span>
          </motion.h2>
          <p
            className="mt-3 max-w-[60ch]"
            style={{
              fontSize: '1rem',
              color: 'var(--ink-muted)',
              lineHeight: 1.65,
            }}
          >
            Things I've built end-to-end — for research, for production, or just to understand a system by writing it myself.
          </p>
          <p
            className="mt-4 font-mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Scroll → to move between panels
          </p>
        </div>
      </div>
    </header>
  );
}

/* ---------- One horizontal panel ---------- */
function Panel({ item, index, total }) {
  const hasVisual = Boolean(item.visual);
  return (
    <div
      className="case-panel"
      style={{
        flex: '0 0 100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5vw',
      }}
    >
      <div
        className={
          hasVisual
            ? 'grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full max-w-[1400px] mx-auto items-center'
            : 'w-full max-w-[760px] mx-auto'
        }
      >
        {/* Text column */}
        <div className={hasVisual ? 'md:col-span-5' : ''}>
          <div
            className="font-mono mb-4"
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            §3.{index + 1}  ·  {item.year}  ·  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: hasVisual
                ? 'clamp(2rem, 3.6vw, 3.25rem)'
                : 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              fontWeight: 500,
            }}
          >
            {item.title}
          </h3>
          <p
            className="mt-3 font-display italic"
            style={{
              fontSize: hasVisual ? '1.125rem' : '1.375rem',
              color: 'var(--ink-muted)',
              lineHeight: 1.4,
            }}
          >
            {item.subtitle}
          </p>
          <p
            className="mt-6"
            style={{
              fontSize: hasVisual ? '1rem' : '1.125rem',
              color: 'var(--ink)',
              lineHeight: 1.65,
              maxWidth: hasVisual ? '52ch' : '60ch',
            }}
          >
            {item.summary}
          </p>
          <p
            className="mt-3"
            style={{
              fontSize: hasVisual ? '0.9375rem' : '1rem',
              color: 'var(--ink-muted)',
              lineHeight: 1.6,
              maxWidth: hasVisual ? '52ch' : '60ch',
            }}
          >
            {item.detail}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((t, j) => (
                <span key={j} className="chip">{t}</span>
              ))}
            </div>
            {item.repo && (
              <a
                href={item.repo}
                target="_blank"
                rel="noreferrer"
                className="link link-ext font-mono ml-1"
                style={{ color: 'var(--accent)', fontSize: '0.8125rem' }}
              >
                open repo<span className="ext-glyph">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Visual column — only rendered when there's an actual visual */}
        {hasVisual && (
          <div className="md:col-span-7">
            <div
              className="overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--rule)',
                borderRadius: '6px',
              }}
            >
              <img
                src={item.visual.src}
                alt={item.visual.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Desktop: horizontal-pinned scroll ---------- */
function HorizontalCaseStudies() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Translate the panels horizontally. With N panels, we need to move them
  // by -(N-1) viewport widths total to expose them all.
  const totalShiftPct = -(projects.length - 1) * 100;
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, totalShiftPct]);
  // Smooth with a spring for a slight lag (feels like physical inertia)
  const x = useSpring(xRaw, { stiffness: 220, damping: 32, mass: 0.5 });

  // Progress indicator at the bottom
  const progressX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="case-studies"
      ref={containerRef}
      className="relative hidden md:block"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full will-change-transform"
          style={{ x: useTransform(x, (v) => `${v}vw`) }}
        >
          {projects.map((item, i) => (
            <Panel key={item.title} item={item} index={i} total={projects.length} />
          ))}
        </motion.div>

        {/* Bottom progress hairline */}
        <div
          aria-hidden
          className="absolute bottom-8 left-[5vw] right-[5vw] flex items-center gap-4"
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'var(--rule)',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: '-1px',
                left: 0,
                height: '3px',
                width: progressX,
                background: 'var(--accent)',
                transformOrigin: 'left',
              }}
            />
          </div>
          <div
            className="font-mono tabular"
            style={{
              fontSize: '0.6875rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              minWidth: '8ch',
              textAlign: 'right',
            }}
          >
            scroll ↓
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mobile: stacked vertical accordion ---------- */
function VerticalCaseStudies() {
  const [open, setOpen] = useState(-1);

  return (
    <section
      id="case-studies-mobile"
      className="md:hidden max-w-page mx-auto px-6 pb-24"
    >
      <ol className="list-none" style={{ borderTop: '1px solid var(--rule)' }}>
        {projects.map((item, i) => (
          <motion.li
            key={item.title}
            className="py-8"
            style={{ borderBottom: '1px solid var(--rule)' }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.04 }}
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="block w-full text-left"
              aria-expanded={open === i}
            >
              <div
                className="font-mono mb-2"
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                §3.{i + 1}  ·  {item.year}
              </div>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.375rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.005em',
                  fontWeight: 500,
                }}
              >
                {item.title}
              </h3>
              <p
                className="mt-2 font-display italic"
                style={{ fontSize: '1rem', color: 'var(--ink-muted)' }}
              >
                {item.subtitle}
              </p>
              <p
                className="mt-3"
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  lineHeight: 1.6,
                }}
              >
                {item.summary}
              </p>
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t, j) => (
                  <span key={j} className="chip">{t}</span>
                ))}
              </div>
              {item.repo && (
                <a
                  href={item.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-ext font-mono"
                  style={{ color: 'var(--accent)', fontSize: '0.8125rem' }}
                >
                  open repo<span className="ext-glyph">↗</span>
                </a>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Main export ---------- */
export default function CaseStudies() {
  const reduced = useReducedMotion();
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    const apply = () => setIsWide(m.matches);
    apply();
    m.addEventListener('change', apply);
    return () => m.removeEventListener('change', apply);
  }, []);

  return (
    <>
      <div className="pt-24 md:pt-32">
        <SectionHeading />
      </div>
      {isWide && !reduced ? <HorizontalCaseStudies /> : <VerticalCaseStudies />}
    </>
  );
}
