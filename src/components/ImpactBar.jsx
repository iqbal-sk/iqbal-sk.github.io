import React from "react";
import siteConfig from "../siteConfig";

export default function ImpactBar() {
  const items = siteConfig.highlights && siteConfig.highlights.length
    ? siteConfig.highlights
    : [
        { label: "+15% Retrieval MRR", href: "#portfolio" },
        { label: "95% Data Accuracy", href: "#portfolio" },
        { label: "200+ Users Served", href: "#portfolio" },
        { label: "−40% DB Load", href: "#experience" },
      ];

  return (
    <section aria-label="Impact highlights" className="pt-6 pb-4">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <a
              key={i}
              href={it.href || "#portfolio"}
              className="group rounded-[12px] border border-border bg-secondary/90 px-4 py-3 text-center text-sm text-foreground hover:bg-secondary transition-colors select-none"
            >
              <span className="inline-block transition-transform group-hover:-translate-y-0.5">
                {it.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

