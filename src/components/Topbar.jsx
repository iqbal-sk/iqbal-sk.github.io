import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import MenuSvg from './MenuSvg';
import ThemeToggle from './ThemeToggle';
import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Topbar — see DESIGN.md "Signature Elements"

   Three quiet things happen as you scroll:
     1. Backdrop blur + hairline fade in past 24px
     2. Active section pill morphs via framer-motion layoutId
     3. 1px scroll-progress hairline at the very top of viewport
   --------------------------------------------------------------- */

const NAV = [
  { id: 'hero',         label: 'Home',         url: '#hero' },
  { id: 'experience',   label: 'Experience',   url: '#experience' },
  { id: 'case-studies', label: 'Case Studies', url: '#case-studies' },
  { id: 'microscale',   label: 'Microscale',   url: '#microscale' },
  { id: 'skills',       label: 'Skills',       url: '#skills' },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!ids.length) return;
    const observers = [];
    let visibility = new Map();

    const handle = (entry) => {
      visibility.set(entry.target.id, entry.intersectionRatio);
      // Pick the section with the highest intersection ratio that's >0.
      let best = { id: null, ratio: 0 };
      for (const [id, ratio] of visibility.entries()) {
        if (ratio > best.ratio) best = { id, ratio };
      }
      if (best.id && best.ratio > 0.05) setActive(best.id);
    };

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach(handle),
        {
          // Reward sections that are near vertical center of viewport.
          rootMargin: '-30% 0px -40% 0px',
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // ids is a static array literal; joining is just to derive a stable dep key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);
  return active;
}

const Topbar = ({ handleClick, openNavigation, toggleNavigation }) => {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(NAV.map((n) => n.id));

  // Scroll-progress hairline (smoothed via spring)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = openNavigation ? 'hidden' : prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [openNavigation]);

  return (
    <>
      {/* Top-of-viewport progress hairline (always present, 1px) */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[60] h-px origin-left"
        style={{
          scaleX: progress,
          background: 'var(--accent)',
        }}
      />

      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
        style={{
          background: scrolled
            ? 'color-mix(in oklab, var(--bg) 78%, transparent)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(10px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px) saturate(140%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--rule)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex w-full max-w-page items-center justify-between px-6 md:px-10 py-3">
          {/* Brand — academic-author abbreviation */}
          <a
            href="/"
            onClick={(e) => handleClick(e, '/')}
            className="font-mono text-sm tracking-tight"
            style={{ color: 'var(--ink)', letterSpacing: '0.04em' }}
          >
            I. Shaik
          </a>

          {/* Desktop nav with morphing pill */}
          <nav className="hidden md:flex items-center gap-1 relative">
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={(e) => handleClick(e, item.url)}
                  className="relative px-3 py-1.5 text-sm font-mono transition-colors duration-150"
                  style={{
                    color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-sm"
                      style={{
                        background: 'var(--accent-soft)',
                        border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right cluster: theme + mono schedule link */}
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            {siteConfig.calendlyUrl && (
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex link link-ext font-mono text-sm"
                style={{ color: 'var(--accent)' }}
              >
                {siteConfig.calendlyLabel || 'schedule.sh'}
                <span className="ext-glyph">↗</span>
              </a>
            )}
            <div className="md:hidden">
              <MenuSvg toggleNavigation={toggleNavigation} openNavigation={openNavigation} />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {openNavigation && (
          <nav
            id="mobile-menu"
            className="md:hidden absolute inset-x-0 top-full"
            style={{
              background: 'var(--bg)',
              borderBottom: '1px solid var(--rule)',
              backdropFilter: 'blur(12px) saturate(140%)',
              WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    onClick={(e) => handleClick(e, item.url)}
                    className="px-3 py-3 font-mono text-base rounded-sm"
                    style={{
                      color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                      background: isActive ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
              {siteConfig.calendlyUrl && (
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-3 font-mono text-base"
                  style={{ color: 'var(--accent)' }}
                >
                  {siteConfig.calendlyLabel || 'schedule.sh'} ↗
                </a>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Spacer so content isn't hidden under the fixed header */}
      <div aria-hidden style={{ height: '56px' }} />
    </>
  );
};

export default Topbar;
