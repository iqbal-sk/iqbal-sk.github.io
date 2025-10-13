import React, { useEffect, useRef, useState } from "react";
import MenuSvg from "./MenuSvg";
import ThemeToggle from "./ThemeToggle";
import CalendlyButton from "./CalendlyButton";
import siteConfig from "../siteConfig";

const Topbar = ({ handleClick, openNavigation, toggleNavigation }) => {
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(64);

  // Track header height (for precise mobile overlay offset)
  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.offsetHeight || 64;
      setHeaderH(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const navigation = [
    { id: 1, title: "Home", url: "#hero" },
    { id: 2, title: "About", url: "#about" },
    { id: 3, title: "Portfolio", url: "#portfolio" },
    siteConfig?.substack?.home
      ? { id: 4, title: "Substack", url: siteConfig.substack.home }
      : null,
    { id: 6, title: "Skills", url: "#skills" },
    { id: 5, title: "Experience", url: "#experience" },
    // Keep core anchors only; hide external Github from topbar for now
  ].filter(Boolean);


  // Lock scroll only for mobile overlay
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (openNavigation) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [openNavigation]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 relative flex items-center py-3 lg:py-[9px] supports-[backdrop-filter]:backdrop-blur-md"
      style={{ background: 'var(--header-bg)' }}
    >
      {/* header row */}
      <div className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-5 md:px-8 lg:justify-start">
        {/* Brand */}
        <a href="/" className="mr-3 inline-flex shrink-0 items-center lg:mr-7">
          <span className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
            Iqbal
          </span>
          <span className="sr-only">Home</span>
        </a>

        {/* Desktop nav (inline) */}
        <nav className="hidden md:flex md:mx-auto">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.url}
              onClick={(e) => handleClick(e, item.url)}
              className="px-4 py-2 text-sm font-medium tracking-tight text-foreground hover:text-primary"
              style={{ textShadow: '0 1px 1px rgba(0,0,0,0.4)' }}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex grow items-center justify-end gap-x-3.5">
          <ThemeToggle compact />
          {siteConfig.calendlyUrl && (
            <CalendlyButton url={siteConfig.calendlyUrl} label={siteConfig.calendlyLabel || 'Quick chat'} />
          )}
        </div>

        {/* Mobile: CTA next to name only when menu open */}
        {openNavigation && siteConfig.calendlyUrl && (
          <div className="md:hidden mr-auto ml-3">
            <CalendlyButton url={siteConfig.calendlyUrl} label={siteConfig.calendlyLabel || 'Quick chat'} />
          </div>
        )}


        {/* Mobile theme toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact className="" />
          <MenuSvg toggleNavigation={toggleNavigation} openNavigation={openNavigation} />
        </div>
      </div>

      {/* Mobile fullscreen MENU (below header, above backdrop) */}
      {openNavigation && (
        <nav
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
          style={{
            top: headerH,
            minHeight: `calc(100vh - ${headerH}px)`,
            background: 'var(--mobile-overlay)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="m-auto flex h-full flex-col items-center justify-center p-8">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={(e) => handleClick(e, item.url)}
                className="block px-6 py-6 text-base uppercase tracking-wide text-foreground hover:underline"
              >
                {item.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* no extra overlays; keep header transparent to avoid any banding */}
    </header>
  );
};

export default Topbar;
