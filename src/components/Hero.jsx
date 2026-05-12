import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Hero — editorial title block.

   Massive stacked name in EB Garamond. Profile photo overlaps the
   right side of the type. As you scroll the first 600px, the name
   subtly scales + fades; the photo parallaxes up. The rest of the
   hero (tagline / pitch / meta) sits below in normal flow.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const TAGLINE_WORDS = ['I', 'build', 'software', 'that', 'learns.'];
const ACCENT_WORD = 'learns.';

const Hero = () => {
  const { identity, calendlyUrl, calendlyLabel } = siteConfig;
  const titleRef = useRef(null);
  const reduced = useReducedMotion();

  // Scroll-driven scale + opacity on the giant name.
  const { scrollY } = useScroll();
  const titleScale = useTransform(scrollY, [0, 600], reduced ? [1, 1] : [1, 0.92]);
  const titleOpacity = useTransform(scrollY, [0, 700], reduced ? [1, 1] : [1, 0.35]);
  const photoY = useTransform(scrollY, [0, 600], reduced ? [0, 0] : [0, -60]);
  const photoScale = useTransform(scrollY, [0, 600], reduced ? [1, 1] : [1, 0.94]);

  return (
    <section
      id="hero"
      className="relative pt-24 md:pt-28 lg:pt-32 pb-28 md:pb-36 overflow-hidden"
    >
      <div className="mx-auto max-w-page px-6 md:px-10">
        {/* Affiliation line — small, mono, uppercase */}
        <motion.p
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          University at Buffalo · Reasoning Models
        </motion.p>

        {/* Giant title block with photo overlay */}
        <motion.div
          ref={titleRef}
          className="relative mt-3 md:mt-4"
          style={{
            scale: titleScale,
            opacity: titleOpacity,
            transformOrigin: 'left top',
          }}
        >
          <motion.h1
            className="font-display hero-mega"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
          >
            <span className="block">{identity.short}</span>
            <span className="block">Shaik.</span>
          </motion.h1>

          {/* Photo overlapping the right portion of the type */}
          <motion.div
            className="hero-photo"
            style={{ y: photoY, scale: photoScale, transformOrigin: 'center' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          >
            <img
              src="/profile.jpg"
              alt={identity.name}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'grayscale(0.1) contrast(1.03)',
              }}
            />
            <span
              className="hero-photo-label font-mono"
              aria-hidden
            >
              {identity.short.toLowerCase()}.jpg · 2024
            </span>
          </motion.div>
        </motion.div>

        {/* Tagline with penned-underline accent */}
        <motion.h2
          className="font-display mt-12 md:mt-16"
          style={{
            fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.75rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.005em',
            fontWeight: 400,
            maxWidth: '40ch',
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.55 } },
          }}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: EASE }}
              className="inline-block mr-[0.28em]"
            >
              {word === ACCENT_WORD ? (
                <span className="penned">
                  {word}
                  <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden>
                    <path d="M 1 4.5 Q 18 2 38 4.2 T 76 4.6 T 99 4.2" />
                  </svg>
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h2>

        {/* Pitch paragraph */}
        <motion.p
          className="mt-7 max-w-[58ch]"
          style={{
            color: 'var(--ink-muted)',
            fontSize: '1.0625rem',
            lineHeight: 1.65,
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
        >
          {identity.pitch}
        </motion.p>

        {/* Mono meta line */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--ink-muted)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.15, ease: EASE }}
        >
          <span>{identity.location}</span>
          <span style={{ color: 'var(--ink-faint)' }}>·</span>
          <span>{identity.role}</span>
          <span style={{ color: 'var(--ink-faint)' }}>·</span>
          {calendlyUrl && (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="link link-ext"
              style={{ color: 'var(--accent)' }}
            >
              {calendlyLabel || 'schedule.sh'}
              <span className="ext-glyph">↗</span>
            </a>
          )}
        </motion.div>

        {/* Quiet down-arrow hint */}
        <motion.div
          className="mt-16 font-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.55 }}
        >
          ↓ scroll
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
