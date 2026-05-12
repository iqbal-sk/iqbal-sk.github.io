import { motion } from 'framer-motion';
import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Hero — Approach A. Austere.
   Name. One short paragraph. Five quiet links. That's it.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const Hero = () => {
  const { identity } = siteConfig;
  const { links } = identity;

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
      className="relative pt-32 md:pt-40 lg:pt-48 pb-28 md:pb-36"
    >
      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="md:grid md:grid-cols-[120px_minmax(0,640px)] md:gap-x-12">
          {/* Left margin: small portrait */}
          <motion.aside
            className="hidden md:block pt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <img
              src="/profile.jpg"
              alt={identity.name}
              loading="eager"
              decoding="async"
              className="w-[96px] h-[96px] rounded-md object-cover"
            />
          </motion.aside>

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
              {identity.pitch}
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
