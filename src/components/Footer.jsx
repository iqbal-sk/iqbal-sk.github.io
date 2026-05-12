import siteConfig from '../siteConfig';

/* ---------------------------------------------------------------
   Footer — see DESIGN.md "Footer"

   Quiet single line. Mono. No big logo, no social icon row.
   --------------------------------------------------------------- */

const Footer = () => {
  const { identity, calendlyUrl, calendlyLabel } = siteConfig;
  const year = new Date().getFullYear();

  const links = [
    identity?.email && { label: 'email',    href: `mailto:${identity.email}` },
    identity?.links?.github   && { label: 'github',   href: identity.links.github,   ext: true },
    identity?.links?.linkedin && { label: 'linkedin', href: identity.links.linkedin, ext: true },
    identity?.links?.substack && { label: 'substack', href: identity.links.substack, ext: true },
    calendlyUrl && { label: calendlyLabel || 'schedule.sh', href: calendlyUrl, ext: true, accent: true },
  ].filter(Boolean);

  return (
    <footer
      className="relative"
      style={{ borderTop: '1px solid var(--rule)' }}
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-10">
        <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-12">
          <div
            className="font-mono mb-3 md:mb-0"
            style={{
              fontSize: '0.75rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Contact
          </div>
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--ink-muted)',
            }}
          >
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={l.ext ? '_blank' : undefined}
                rel={l.ext ? 'noopener noreferrer' : undefined}
                className={l.ext ? 'link link-ext' : 'link'}
                style={l.accent ? { color: 'var(--accent)' } : undefined}
              >
                {l.label}
                {l.ext && <span className="ext-glyph">↗</span>}
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-8 font-mono flex flex-wrap items-center justify-between gap-y-2"
          style={{
            fontSize: '0.6875rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.02em',
          }}
        >
          <span>{`// ${identity?.name} · ${year}`}</span>
          <span className="tabular">built with care, deployed nightly</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
