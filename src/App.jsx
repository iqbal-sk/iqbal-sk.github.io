import { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

import Topbar from './components/Topbar';
import Hero from './components/Hero';
// import PulseSparkline from './components/PulseSparkline';
import Experience from './components/Experience';
import WhyMicroscale from './components/WhyMicroscale';
import CaseStudies from './components/CaseStudies';
import Skills from './components/Skills';
import Education from './components/Education';
import Footer from './components/Footer';

import { RoleProvider } from './context/RoleContext';

const App = () => {
  const links = [
    { href: 'https://www.linkedin.com/in/iqbal-sk/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:mahammad@buffalo.edu', icon: Mail, label: 'Email' },
    { href: 'https://github.com/iqbal-sk', icon: Github, label: 'GitHub' },
  ];

  const [openNavigation, setOpenNavigation] = useState(false);
  const toggleNavigation = () => setOpenNavigation((v) => !v);

  // Smooth-scroll nav handler. Lenis (window.__lenis) drives scroll when present;
  // falls back to native scrollIntoView under prefers-reduced-motion.
  const handleClick = (e, url) => {
    e.preventDefault();
    if (openNavigation) toggleNavigation();

    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', '/');
      return;
    }

    if (url.startsWith('#')) {
      const target = document.querySelector(url);
      if (!target) return;
      const lenis = window.__lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { offset: -72, duration: 1.0 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      history.replaceState(null, '', url);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  return (
    <RoleProvider>
      <div className="relative paper-grain" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
        <Topbar
          handleClick={handleClick}
          openNavigation={openNavigation}
          toggleNavigation={toggleNavigation}
          links={links}
        />

        <main className="relative">
          <Hero />
          {/* <PulseSparkline days={30} microcopy="30-day pulse · shipped iterations." /> */}
          <Experience />
          <CaseStudies />
          <WhyMicroscale />
          <Skills />
          <Education />
        </main>

        <Footer links={links} />
      </div>
    </RoleProvider>
  );
};

export default App;
