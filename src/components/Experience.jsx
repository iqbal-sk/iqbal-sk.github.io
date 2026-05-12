import { motion } from 'framer-motion';
import CountUp from './CountUp';

/* ---------------------------------------------------------------
   §1 Experience — document timeline.

   Date/theme/location in the left gutter, prose + chips in the
   reading column. Split-entry choreography: aside in from left,
   content in from right, chips fade up below.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const experience = [
  {
    company: 'Haiva',
    role: 'Member of Technical Staff',
    location: 'Remote',
    date: '2025 → now',
    theme: 'research + voice',
    current: true,
    metrics: [],
    prose:
      'Etora compresses the gap between a research question and a defensible answer. Biomedical teams use it to search literature by claim and evidence strength, surface contradictions with traceable provenance, run statistical analysis and image work on their own data without leaving the conversation, and explore the knowledge graph of what’s known versus contested — all inside a scoped workspace their team can share. The voice agent platform handles live phone calls under real conditions: barge-in that doesn’t make the agent feel jumpy, transparent fallback when a customer’s provider key dies mid-call, hangup state that survives carrier weirdness. Built the backend, the intelligence layer, and the real-time inference path. The throughline across both: AI that survives contact with reality.',
    tags: ['Python', 'FastAPI', 'Qdrant', 'Memgraph', 'WebRTC', 'Docker'],
  },
  {
    company: 'Microscale Academy',
    role: 'Author',
    location: 'microscale.academy',
    date: '2026 → now',
    theme: 'SLM judgment',
    current: true,
    metrics: [],
    prose:
      'For engineers who have to choose, fine-tune, and serve small language models — not just read papers about them. A nine-act curriculum built around judgment over benchmark trivia: twelve hands-on labs, architecture autopsies of eleven production SLMs, and a browser-based capstone where the learner picks a real serving stack and watches it run. The bet underneath: inference patterns are architecture, and good SLM decisions earn back their parameter count in serving cost.',
    tags: ['SLM', 'Transformer', 'LoRA', 'DPO', 'Quantization', 'vLLM'],
  },
  {
    company: 'University at Buffalo',
    role: 'Research Assistant',
    location: 'Buffalo, NY',
    date: '2025 → now',
    theme: 'reasoning-models',
    metrics: [
      { value: 7, suffix: 'pp', prefix: '+', label: 'reasoning gain' },
      { value: 70, suffix: 'B', label: 'params' },
      { value: 800, suffix: 'K', label: 'dialogues' },
    ],
    prose:
      'When reasoning models start thinking out loud, they often forget who they’re supposed to be. Fine-tuned Llama-3 70B with QLoRA over hundreds of thousands of persona-rich dialogues to keep voice consistent through multi-step reasoning. Built the eval suite that measured whether intent survived chain-of-thought.',
    tags: ['Llama-3', 'QLoRA', 'Reasoning', 'PyTorch', 'Eval'],
  },
  {
    company: 'Order Appetit',
    role: 'ML / AI Engineer Intern',
    location: 'Buffalo · Rochester, NY',
    date: '2024-09 → 2024-12',
    theme: 'applied-intelligence',
    metrics: [
      { value: 95, suffix: '%', prefix: '≈', label: 'accuracy' },
    ],
    prose:
      'Restaurant owners in Buffalo and Rochester needed to ask their operational data a question and get a useful answer before the next order prints — without a data team. Built the semantic backbone behind that: turning raw ops data into natural-language answers small operators could actually act on, served fast enough to fit between tickets.',
    tags: ['FastAPI', 'Pinecone', 'RAG', 'MongoDB', 'Agents'],
  },
  {
    company: 'Next Education',
    role: 'Senior Software Engineer (R&D)',
    location: 'Hyderabad, India',
    date: '2022-04 → 2023-07',
    theme: 'learning-pipelines',
    metrics: [
      { value: 2, suffix: 'K', label: 'students' },
      { value: 150, suffix: 'K', label: 'schools' },
      { value: 90, suffix: '%', prefix: '−', label: 'faster ETL', negative: true },
    ],
    prose:
      'K-12 students who wrote an essay on Monday and got personalized grammar feedback before lunch on Tuesday — when the suggestions still meant something. Productionized the system after a 2K-student pilot and scaled it across the network. Separately, engineered ETL pipelines across 150K schools so the outreach team could see adoption patterns instead of guessing at them.',
    tags: ['MLOps', 'Airflow', 'DVC', 'MLflow', 'OpenCV', 'NLP'],
  },
  {
    company: 'United Online',
    role: 'Software Engineer',
    location: 'Hyderabad, India',
    date: '2020-06 → 2022-03',
    theme: 'systems-reliability',
    metrics: [
      { value: 40, suffix: '%', prefix: '−', label: 'DB load' },
    ],
    prose:
      'MagicJack users on live calls don’t notice infrastructure until it fails them. Built Redis-backed server-sent events and caching layers that kept live session data flowing while cutting database load, automated billing orchestration so the back-office stopped reconciling spreadsheets by hand, and the CI/CD that took the manual work out of releases.',
    tags: ['Java', 'Spring Boot', 'SSE', 'Redis', 'CI/CD', 'Testcontainers'],
  },
];

/* ---------- Section heading: §N inline with serif title ---------- */
function SectionHeading({ number, title }) {
  return (
    <header className="mb-10">
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
    </header>
  );
}

function ExperienceRow({ item, i }) {
  return (
    <motion.li
      className={`grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12 ${i === 0 ? 'pt-14 pb-10' : 'py-10'}`}
      style={{ borderTop: i === 0 ? 'none' : '1px solid var(--rule)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE, delayChildren: i * 0.04, staggerChildren: 0.08 }}
      variants={{}}
    >
      {/* Left aside slides in from -40px */}
      <motion.aside
        className="font-mono mb-3 md:mb-0 md:pt-1.5"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--ink-muted)',
        }}
        variants={{
          hidden: { opacity: 0, x: -36 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div className="tabular">{item.date}</div>
        <div className="mt-1" style={{ color: 'var(--ink-faint)' }}>{item.location}</div>
        <div className="mt-3" style={{ color: 'var(--ink-faint)' }}>{item.theme}</div>
      </motion.aside>

      {/* Right content slides in from +28px */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 28 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <h3
          className="font-display"
          style={{
            fontSize: '1.5rem',
            lineHeight: 1.25,
            letterSpacing: '-0.005em',
            fontWeight: item.current ? 600 : 400,
          }}
        >
          {item.company}
          <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}> — </span>
          <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>{item.role}</span>
        </h3>

        {/* Metric line with count-ups (only when metrics exist) */}
        {item.metrics.length > 0 && (
        <div
          className="font-mono mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--ink-muted)',
          }}
        >
          {item.metrics.map((m, k) => (
            <span key={k} className="tabular inline-flex items-baseline">
              <span style={{ color: 'var(--ink)', fontWeight: 500 }}>
                <CountUp
                  to={m.value}
                  prefix={m.prefix || ''}
                  suffix={m.suffix || ''}
                  duration={1200}
                  delay={300 + i * 40 + k * 80}
                />
              </span>
              <span className="ml-2" style={{ color: 'var(--ink-faint)' }}>
                {m.label}
              </span>
              {k < item.metrics.length - 1 && (
                <span className="ml-4" style={{ color: 'var(--ink-faint)' }}>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
        )}

        <p
          className="mt-5"
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--ink)',
          }}
        >
          {item.prose}
        </p>

        {/* Tech chips fade up */}
        <motion.div
          className="mt-5 flex flex-wrap gap-2"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {item.tags.map((t, j) => (
            <span key={j} className="chip">{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

const Experience = () => {
  return (
    <section
      id="experience"
      className="relative max-w-page mx-auto px-6 md:px-10 py-24 md:py-32"
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        {/* Left gutter: sticky folio mark — pins as you read */}
        <div className="hidden md:block relative" aria-hidden>
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
              §2
            </span>
          </div>
        </div>
        <div>
          <SectionHeading number="2" title="Experience." />

          <ol className="list-none" style={{ borderTop: '1px solid var(--rule)' }}>
            {experience.map((item, i) => (
              <ExperienceRow key={item.company} item={item} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
