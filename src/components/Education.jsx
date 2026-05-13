import { motion } from 'framer-motion';

/* ---------------------------------------------------------------
   Education — document-style, see DESIGN.md
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

const educationData = [
  {
    degree: 'M.S. Artificial Intelligence',
    school: 'University at Buffalo (SUNY)',
  },
  {
    degree: 'B.Tech Computer Science',
    school: 'Jawaharlal Nehru Technological University',
  },
];

const Education = () => {
  return (
    <section
      id="education"
      className="relative max-w-page mx-auto px-6 md:px-10 py-12 md:py-16"
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        <div />
        <div>
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
                §5
              </span>
              <span style={{ fontWeight: 500 }}>Education.</span>
            </motion.h2>
          </header>

          <ol className="list-none" style={{ borderTop: '1px solid var(--rule)' }}>
            {educationData.map((edu, i) => (
              <motion.li
                key={i}
                className="py-6"
                style={{ borderBottom: '1px solid var(--rule)' }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
              >
                <h3
                  className="font-display"
                  style={{
                    fontSize: '1.375rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.005em',
                    fontWeight: 500,
                  }}
                >
                  {edu.degree}
                </h3>
                <p
                  className="mt-1"
                  style={{
                    fontSize: '1rem',
                    color: 'var(--ink-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {edu.school}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Education;
