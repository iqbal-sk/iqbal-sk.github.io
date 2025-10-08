import React, { useMemo, useState } from "react";
import { useRole } from "../context/RoleContext";
import GitHubActivity from "./GitHubActivity";
import EducationInline from "./EducationInline";
import SkillsInline from "./SkillsInline";
import Crossfade from "./Crossfade";
import SegmentedSwitch from "./SegmentedSwitch";
import CalendlyButton from "./CalendlyButton";
import siteConfig from "../siteConfig";
import { Linkedin as LinkedinIcon, Mail } from "lucide-react";

// Local snapshot of projects to avoid cross-file coupling.
// If you later move projects to a shared data file, import from there.
const PROJECTS = [
  {
    title: "Kafka Wire Protocol — Python",
    outcome: "From‑scratch client/server; Produce/Fetch + Metadata",
    role: "Backend",
    repo: "https://github.com/iqbal-sk",
  },
  {
    title: "Redis‑Compatible Server — C",
    outcome: "RESP parser + non‑blocking event loop; SET/GET",
    role: "Backend",
    repo: "https://github.com/iqbal-sk",
  },
];

const METRICS = [
  { label: "LLM reasoning", value: "+7 pp" },
  { label: "Data accuracy", value: "95%" },
  { label: "Retrieval MRR", value: "+15%" },
  { label: "Scale served", value: "200+ users" },
  { label: "DB load cut", value: "−40%" },
];

export default function RecruiterMode({ links = [] }) {
  const { role, setRole } = useRole();

  const topProjects = useMemo(() => {
    const filtered = PROJECTS.filter((p) => p.role === role);
    return (filtered.length ? filtered : PROJECTS).slice(0, 3);
  }, [role]);

  const email = links.find((l) => String(l.href || "").startsWith("mailto:"))?.href;
  const linkedin = links.find((l) => String(l.href || "").includes("linkedin.com"))?.href;

  return (
    <section id="recruiter" className="pt-10 pb-6">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="relative overflow-hidden p-6 rounded-[12px] border border-border bg-card shadow-sm supports-[backdrop-filter]:backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">Recruiter Snapshot</h2>
            {/* Role segmented control */}
            <SegmentedSwitch
              value={role}
              onChange={(v)=> setRole(v)}
              options={[{label:'ML', value:'ML'}, {label:'Backend', value:'Backend'}]}
            />
          </div>
          {/* No content animation; switch animates only in control */}
            {/* Metrics + Heatmap in a 12-col grid */}
            <div className="mt-4 grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 md:col-span-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {METRICS.map((m) => (
                    <div key={m.label} className="h-[84px] rounded-[12px] border border-border bg-secondary px-4 py-3 flex flex-col items-center justify-center text-center">
                      <div className="text-base font-semibold text-foreground leading-tight">{m.value}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-2">
                <div className="flex items-center justify-end">
                  <div className="h-[84px] flex items-center gap-2 rounded-[12px] border border-border bg-secondary px-3 py-2" aria-label="GitHub activity, last 30 days">
                    <div className="text-[11px] leading-tight text-muted-foreground text-right select-none">
                      <div>GitHub</div>
                      <div>Activity</div>
                    </div>
                    <GitHubActivity mini days={30} showTotals={false} showEvents={false} className="m-0 p-0 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-border" />

            {/* Inline education summary */}
            <div className="mt-4">
              <EducationInline />
            </div>

            {/* Inline skills summary */}
            <div className="mt-4">
              <SkillsInline />
            </div>

            {/* Top projects */}
            <div className="mt-5 text-[11px] uppercase tracking-wide text-muted-foreground">Top projects</div>
            <div className="mt-2 md:mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {topProjects.map((p, i) => (
                <div key={i} className="rounded-[12px] border border-border bg-secondary p-4">
                  <div className="font-semibold text-foreground">{p.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground" style={{display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{p.outcome}</div>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-sm text-primary hover:underline"
                    >
                      View repo
                    </a>
                  )}
                </div>
              ))}
            </div>

          {/* Contact */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/Iqbal-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 rounded-lg px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
            >
              View Resume
            </a>
            {siteConfig.calendlyUrl && (
              <CalendlyButton url={siteConfig.calendlyUrl} label={siteConfig.calendlyLabel || 'Let\'s chat'} variant="primary" />
            )}
            {/* Icon links (not buttons) */}
            <div className="ml-auto flex items-center gap-3">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
              {email && (
                <a
                  href={email}
                  aria-label="Email"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
