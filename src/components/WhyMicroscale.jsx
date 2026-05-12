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
          className="font-mono"
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
        <div />
        <div>
          <SectionHeading
            number="1"
            title="Microscale — the slow path."
            subtitle="Why I started building a curriculum for small language models, and what I want learners to leave with."
          />

          <Paragraph delay={0}>
            Small language models in 2026 are no longer the consolation prize — the thing you settled for when you couldn’t afford the big one. LoRA and QLoRA specialize a 4B model on a single consumer GPU. DPO, GRPO, and RLVR replace the RLHF pipelines that used to need entire teams. vLLM, SGLang, and MLX have dropped the cost per token to where production math finally works. And constrained decoding lets a 1B model emit valid tool calls that once required 70B. For a wide list of real work — extraction, routing, summarization, structured generation, agentic decisions inside a larger system — the right model is now the small one, sharpened on the task that actually matters. The hard part is no longer training it. It’s knowing how to choose, specialize, and serve it well — a real skill that almost no one teaches.
          </Paragraph>

          <Paragraph delay={0.08}>
            Microscale is the curriculum I wished existed when I started. Before the site, I had a graph of fifteen reference notes — correct but cold, a graph to consult, not a path to walk. What I’m building is the slow path: nine acts, every lesson moving through hook, model, formalism, practice, quiz, every claim traceable to a shipped model or a paper you can read. Orientation ends with a 300M model running live in your browser. The capstone asks you to design a whole pipeline — base, training, serving, constraints — and then runs your choices as a tool-calling agent in the tab; either your reasoning held up, or it didn’t. The bet underneath all of it: <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>inference patterns are architecture.</strong> The way tokens flow through a system decides what latency you can tolerate, what topology you can afford, what product you can ship. Not facts about small models. Judgment.
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
