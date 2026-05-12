import { motion } from 'framer-motion';

/* ---------------------------------------------------------------
   §2 Microscale — the slow path.

   Long-form essay on the motive behind the curriculum. Read-first
   prose, single column, slightly wider reading measure. Same gutter
   layout as Experience and Case Studies.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

function Paragraph({ children, delay = 0 }) {
  return (
    <motion.p
      className="mt-6"
      style={{
        fontSize: '1.0625rem',
        color: 'var(--ink)',
        lineHeight: 1.7,
        maxWidth: '68ch',
      }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.p>
  );
}

function SectionHeading({ number, title, subtitle }) {
  return (
    <header className="mb-8">
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
          §{number}
        </span>
        <span style={{ fontWeight: 500 }}>{title}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-3 max-w-[60ch]"
          style={{
            fontSize: '1rem',
            color: 'var(--ink-muted)',
            lineHeight: 1.65,
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}

export default function WhyMicroscale() {
  return (
    <section
      id="microscale"
      className="relative max-w-page mx-auto px-6 md:px-10 py-24 md:py-32"
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        {/* Left gutter: sticky folio mark + reading-progress rail */}
        <div className="hidden md:block relative" aria-hidden>
          {/* Folio mark — pins as you read through the section */}
          <div
            className="sticky"
            style={{
              top: '5rem',
              textAlign: 'right',
              paddingRight: '1.75rem',
              zIndex: 1,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent)',
                letterSpacing: '0.04em',
                fontWeight: 500,
                opacity: 0.55,
              }}
            >
              §1
            </span>
          </div>
          {/* Reading-progress rail (absolute, fills gutter height) */}
          <div className="absolute inset-y-0 right-3 microscale-rail-track">
            <div className="microscale-rail-fill" />
          </div>
        </div>
        <div>
          <SectionHeading
            number="1"
            title="Microscale — the slow path."
            subtitle="Why I started building a curriculum for small language models, and what I want learners to leave with."
          />

          <Paragraph delay={0}>
            Small language models used to be the runner-up — what you settled for when you couldn’t afford the big one. That isn’t the situation anymore. Three things changed at once. Customizing a small model became something you can do on a single consumer machine instead of a data center. The cost of running them dropped to a fraction of what it was. And new techniques made them reliable enough to handle the parts of an AI product that actually need to work — pulling fields out of a document, routing a support ticket, summarizing a long email thread, powering a step in a larger AI system. For a long list of real production work, the right model is now the small one, sharpened on the specific job that matters. The hard part is no longer training one. It’s knowing how to choose, customize, and serve one well — a real skill that almost no one teaches.
          </Paragraph>

          <Paragraph delay={0.08}>
            Microscale is the curriculum I wished existed when I started. Before the site, I had a graph of fifteen reference notes — correct but cold, a graph to consult, not a path to walk. What I’m building is the slow path: nine acts, each lesson moving through a hook, a working model you can play with, the idea behind it, a practice round, and a short quiz, every claim traceable to a real shipped model or a paper you can read. Orientation ends with a real working model running live in your browser — small enough to fit, real enough to feel. The final challenge has you assemble a complete system — picking the model, teaching it your task, deciding how to run it, setting the right guardrails — and then watch your choices come alive as a working agent in the tab; either your reasoning held up, or it didn’t. The bet underneath everything: <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>the choices that go into building a model aren’t side details — they’re the product itself.</strong> They decide how fast it responds, how much it costs to run, and what it can actually do for the person using it. That’s what I want a learner to leave with.
          </Paragraph>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          >
            <a
              href="https://microscale.academy"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-ext font-mono"
              style={{
                fontSize: '0.875rem',
                color: 'var(--accent)',
              }}
            >
              microscale.academy<span className="ext-glyph">↗</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
