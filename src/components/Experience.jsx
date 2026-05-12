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
      'When models start to reason, personality matters. I explored how large language models can hold consistent voices while thinking step-by-step. Fine-tuned Llama-3 70B with lightweight QLoRA adapters over hundreds of thousands of persona-rich dialogues, and built the evaluation suite that tracked reasoning gains. Where I learned to balance scale with intent — making intelligence efficient instead of excessive.',
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
      'Restaurant owners in Buffalo and Rochester asking their data a question and getting an answer before the next order prints. I built the semantic backbone behind that — FastAPI services and a Pinecone-powered retrieval layer turning raw operational data into natural-language insights. Rewired how I think about AI products: real-time usefulness beats academic perfection every time.',
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
      'Two worlds at once. On the academic side, productionized a grammar-feedback system that gave K-12 students personalized writing suggestions within an hour — piloted at a 2K-student school, scaled across the network. On the business side, engineered ETL pipelines spanning 150K schools to surface adoption patterns and guide outreach. Pedagogy and pipelines: machine learning only matters when it closes a human feedback loop.',
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
      'My crash course in invisible reliability. Built Redis-backed server-sent events and caching layers that kept MagicJack’s live user data flowing while cutting database load. Automated billing orchestration and CI/CD pipelines. No AI here — just the discipline that keeps future intelligence grounded in solid infrastructure.',
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
    </header>
  );
}

function ExperienceRow({ item, i }) {
  return (
    <motion.li
      className="grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12 py-10"
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
            fontWeight: 500,
          }}
        >
          {item.company}
          <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}> — </span>
          <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>{item.role}</span>
        </h3>

        {/* Metric line with count-ups */}
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
        <div />
        <div>
          <SectionHeading number="1" title="Experience." />

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
