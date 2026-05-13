import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Hero — Approach A. Austere.
   Name. One short paragraph. Five quiet links. That's it.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const Hero = () => {
  const { identity } = siteConfig;
  const { links } = identity;

  // Scroll-driven parallax on the portrait (disabled under prefers-reduced-motion).
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 600], reduced ? [0, 0] : [0, -60]);
  const photoScale = useTransform(scrollY, [0, 600], reduced ? [1, 1] : [1, 0.94]);

  const ROW = [
    { label: 'microscale.academy',      href: links.microscale,  note: 'a field journal for small language models' },
    { label: 'etora.ai',                href: links.etora,       note: 'research intelligence, in beta with Yale' },
    { label: 'hellotensor.substack.com', href: links.substack,   note: 'notes from the work' },
    { label: 'github.com/iqbal-sk',     href: links.github,      note: 'code' },
    { label: 'linkedin',                href: links.linkedin,    note: '' },
  ];

  return (
    <section
      id="hero"
      className="relative pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16"
    >
      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="md:grid md:grid-cols-[minmax(0,640px)_220px] md:gap-x-16 md:items-start">
          {/* Reading column */}
          <div className="md:max-w-reading">
            <motion.h1
              className="font-display"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {identity.name}.
            </motion.h1>

            <motion.p
              className="mt-8 max-w-[58ch]"
              style={{
                color: 'var(--ink)',
                fontSize: '1.125rem',
                lineHeight: 1.65,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            >
              {Array.isArray(identity.pitch)
                ? identity.pitch.map((seg, i) =>
                    typeof seg === 'string' ? (
                      <span key={i}>{seg}</span>
                    ) : (
                      <strong key={i} style={{ fontWeight: 500, color: 'var(--ink)' }}>
                        {seg.strong}
                      </strong>
                    ),
                  )
                : identity.pitch}
            </motion.p>

            <motion.ul
              className="mt-12 list-none"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.6 } },
              }}
            >
              {ROW.map((row, i) => (
                <motion.li
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-y-1 md:gap-x-8 py-2.5"
                  style={{ borderTop: '1px solid var(--rule)' }}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-ext font-mono"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ink)',
                    }}
                  >
                    {row.label}
                    <span className="ext-glyph">↗</span>
                  </a>
                  {row.note && (
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      {row.note}
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right column: portrait with scroll-driven parallax */}
          <motion.aside
            className="hidden md:block pt-3"
            style={{ y: photoY, scale: photoScale, transformOrigin: 'center top' }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            <img
              src="/profile.jpg"
              alt={identity.name}
              loading="eager"
              decoding="async"
              className="rounded-md object-cover"
              style={{ width: '220px', height: '264px' }}
            />
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default Hero;
