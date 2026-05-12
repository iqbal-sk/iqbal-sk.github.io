import { useState } from 'react';
import { motion } from 'framer-motion';

import SkillsConstellation from './SkillsConstellation';
import SegmentedSwitch from './SegmentedSwitch';

/* ---------------------------------------------------------------
   Skills — see DESIGN.md "Skills"

   Section wrapper around the constellation graph. Document-style
   heading with terminal prompt + caret. Mode switch is mono and
   quiet.
   --------------------------------------------------------------- */

const EASE = [0.23, 1, 0.32, 1];

export default function Skills() {
  const [mode, setMode] = useState('combined');

  return (
    <section
      id="skills"
      className="relative max-w-page mx-auto px-6 md:px-10 py-24 md:py-32"
    >
      <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
        <div />
        <div>
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
                §4
              </span>
              <span style={{ fontWeight: 500 }}>Skills.</span>
            </motion.h2>
            <p
              className="mt-3 max-w-[60ch]"
              style={{
                fontSize: '1rem',
                color: 'var(--ink-muted)',
                lineHeight: 1.65,
              }}
            >
              How my stack actually connects. Hover a node to see its name; the cluster headings show the territory each lives in.
            </p>
          </header>

          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--ink-faint)',
                letterSpacing: '0.02em',
              }}
            >
              view:
            </span>
            <SegmentedSwitch
              value={mode}
              onChange={setMode}
              options={[
                { label: 'combined', value: 'combined' },
                { label: 'ml',       value: 'ML' },
                { label: 'backend',  value: 'Backend' },
              ]}
              buttonClassName="px-2.5 py-1 text-xs"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          >
            <SkillsConstellation key={mode} mode={mode} />
          </motion.div>

          <p
            className="mt-4 font-mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.02em',
            }}
          >
            {'// hover to explore'}
</p>
        </div>
      </div>
    </section>
  );
}
