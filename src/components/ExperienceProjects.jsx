// src/components/ExperienceProjects.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { GraduationCap, Keyboard, ArrowRight } from "lucide-react";
import SegmentedSwitch from "./SegmentedSwitch";
import { useRole } from "../context/RoleContext";
import siteConfig from "../siteConfig";
// Removed recommended repos section per user's preference
// project images intentionally omitted per user's request (no visuals)

/* -------------------------- Scroll-in animation hook -------------------------- */
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map()); // id -> element
  const queuedCheck = useRef(new Set()); // ids scheduled for a RAF check

  const markVisible = (id) => {
    if (!id) return;
    setVisibleElements((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const isInViewport = (node) => {
    if (!node) return false;
    const r = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    if (r.width === 0 && r.height === 0) return false;
    const height = Math.max(r.height, 1);
    const visibleY = Math.min(
      vh,
      Math.max(0, vh - Math.max(0, r.top) - Math.max(0, r.bottom - vh))
    );
    return r.left < vw && r.right > 0 && visibleY / height >= 0.1;
  };

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisibleElements(new Set(["__all__"]));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            markVisible(entry.target.getAttribute("data-animate-id"));
            obs.unobserve(entry.target); // animate once
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observerRef.current = obs;

    const flush = () => {
      for (const [id, el] of elementsRef.current.entries()) {
        if (!visibleElements.has(id) && isInViewport(el)) markVisible(id);
      }
    };

    const onScroll = () => flush();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    requestAnimationFrame(flush);
    const t = setTimeout(flush, 120);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const observeElement = (el, id) => {
    if (!el || !id) return;

    el.setAttribute("data-animate-id", id);
    elementsRef.current.set(id, el);

    const obs = observerRef.current;
    if (obs) obs.observe(el);

    if (!queuedCheck.current.has(id)) {
      queuedCheck.current.add(id);
      requestAnimationFrame(() => {
        queuedCheck.current.delete(id);
        if (isInViewport(el)) markVisible(id);
      });
    }
  };

  return { visibleElements, observeElement };
};

/* ------------------------------------------------------------------------ */

/* --------------------------------- Data --------------------------------- */
const experienceData = [
  {
    title: "Research Assistant",
    company: "University at Buffalo, NY",
    date: "Feb 2025 – Present",
    theme: "Reasoning Models",
    metricLine: "+7 pp reasoning (65→72) | 70B params | 800K dialogues",
    prose:
      "When models start to reason, personality matters. At Buffalo I explored how large language models can hold consistent “voices” while thinking step‑by‑step. I fine‑tuned Llama‑3 70B with lightweight QLoRA adapters over hundreds of thousands of persona‑rich dialogues and built the evaluation suite that tracked reasoning gains. It’s where I learned to balance scale with intent—making intelligence efficient instead of excessive.",
    tags: ["LLMs", "Llama‑3", "QLoRA", "Reasoning", "Evaluation", "PyTorch", "Python"],
    icon: GraduationCap,
  },
  {
    title: "ML/AI Engineer Intern",
    company: "Order Appetit, NY",
    date: "Sep 2024 – Dec 2024",
    theme: "Applied Intelligence",
    metricLine: "Restaurants across the Buffalo and Rochester region | ≈95 % accuracy | Real‑time analytics",
    prose:
      "Imagine restaurant owners in Buffalo and Rochester asking their data a question and getting an answer before the next order prints. I built the semantic backbone behind that—FastAPI services and a Pinecone‑powered retrieval layer turning raw operational data into natural‑language insights. That experience rewired how I think about AI products: real‑time usefulness beats academic perfection every time.",
    tags: ["FastAPI", "Semantic Search", "Pinecone", "MongoDB", "RAG", "Agents", "Python"],
    icon: Keyboard,
  },
  {
    title: "Senior Software Engineer (R&D)",
    company: "Next Education, India",
    date: "Apr 2022 – Jul 2023",
    theme: "Learning Pipelines",
    metricLine: "<1h feedback for 2K students | 150K schools | 90% faster ETL",
    prose:
      "At Next Education I helped classrooms and sales teams learn faster for entirely different reasons. On the academic side, I productionized a grammar‑feedback system that gave K‑12 students personalized writing suggestions within an hour—first piloted at a 2 K‑student school, later scaled across the network. For the business side, I engineered ETL pipelines spanning 150 K schools to surface adoption patterns and guide outreach. Two worlds—pedagogy and pipelines—taught me that machine learning matters only when it closes a human feedback loop.",
    tags: ["MLOps", "Airflow", "DVC", "MLflow", "ETL", "OpenCV", "NLP"],
    icon: Keyboard,
  },
  {
    title: "Software Engineer",
    company: "United Online, India",
    date: "Jun 2020 – Mar 2022",
    theme: "Systems Reliability",
    metricLine: "−40% DB load | Real‑time profile updates | Billing orchestration",
    prose:
      "This was my crash course in invisible reliability. I built Redis‑backed server‑sent events and caching layers that kept MagicJack’s live user data flowing while cutting database load. I also automated billing orchestration and CI/CD pipelines. Nothing “AI” here—just the discipline that keeps future intelligence grounded in solid infrastructure.",
    tags: ["Java", "Spring Boot", "SSE", "Redis", "CI/CD", "Testcontainers", "WireMock"],
    icon: Keyboard,
  },
];

const projectData = [
  {
    title: "Detecting Persuasion Techniques in Memes — SemEval 2024 Task 4",
    summary:
      "Core contribution: a consistency‑enforcing hierarchical loss for multilingual, multimodal persuasion classification (no OCR; uses provided post text + images). Achieved state‑of‑the‑art on the official SemEval‘24 Task 4 leaderboard.",
    oneLiner:
      "SOTA with a depth‑aware hierarchical loss that enforces parent→child consistency in multilingual, multimodal meme persuasion classification.",
    githubLink: "https://github.com/iqbal-sk/Detecting-Persuasion-Techniques-in-Memes",
    hostingLink: null,
    visual: {
      src: "/h-loss.png",
      alt: "Hierarchical loss: base BCE + parent→child consistency penalty",
      caption: "Hierarchical loss: base BCE + parent→child consistency (depth‑weighted)",
      hoverSrc: "/h-loss.png",
    },
    stats: ["SOTA (SemEval‘24 Task 4)", "Multilingual + Multimodal"],
    scale: "4 languages; multi‑label hierarchy",
    scope: "Owner — hierarchical loss, fusion, evaluation",
    proofs: [
      { src: "/h-loss.png", alt: "Loss diagram" },
      { src: "/visuals/hierarchical-loss.svg", alt: "Loss SVG" },
    ],
    actions: [
      { label: "Open Repo", href: "https://github.com/iqbal-sk/Detecting-Persuasion-Techniques-in-Memes" },
    ],
    sections: [
      { title: "The Spark", body: "Persuasion cues are hierarchical and often emerge from image+text jointly. I targeted SemEval‘24 Task 4 with a loss that respects the taxonomy." },
      { title: "Constraints", body: "Multi‑label, long‑tail classes with depth‑based dependencies lead to inconsistent predictions (child positive, parent negative). Inputs: post text and image; multilingual, culturally varied." },
      { title: "Architecture", body: "Text (multilingual transformer) + image (vision backbone) → projections → gated fusion → classifier. Vectorized tree masks built from adjacency; class‑balanced sampler, label smoothing, and temperature scaling for stability." },
      { title: "Experiments", body: "Ablations showed hierarchical loss > flat BCE/CE by reducing hierarchy violations; multimodal fusion > text‑only on the image+text split; per‑depth threshold calibration improved recall on deeper nodes." },
      { title: "Outcomes", body: "State‑of‑the‑art on the official SemEval‘24 Task 4 leaderboard across languages, validating the hierarchical, multimodal approach." },
      { title: "What I’d do next", body: "Tighten image–text alignment with contrastive pretraining; refine per‑depth calibration; add language‑aware augmentation for robustness on colloquial text." },
    ],
    skills: [
      "Multimodal",
      "Multilingual",
      "NLP",
      "Computer Vision",
      "Transformers",
      "PyTorch",
      "Multimodal Embeddings",
      "Hierarchical Loss",
      "Hierarchical Classification",
      "Consistency Regularization",
    ],
    role: "ML",
  },
  {
    title: "Kafka Wire Protocol — Python Implementation",
    summary:
      "From‑scratch Kafka client/server that speaks the official wire protocol — request/response framing, CRC, and a minimal broker loop supporting Produce/Fetch + Metadata.",
    githubLink: "https://github.com/iqbal-sk",
    hostingLink: null,
    visual: {
      src: "/Kafka.png",
      alt: "Kafka wire protocol implementation in Python — request/response framing, CRC, Produce/Fetch, Metadata",
      caption: "Kafka wire protocol: request/response framing, CRC, Produce/Fetch + Metadata",
      hoverSrc: "/Kafka.png",
    },
    oneLiner: "Implements Kafka’s wire protocol from scratch with CRC and a minimal broker loop for Produce/Fetch + Metadata.",
    stats: ["Throughput +81% (bench)", "Wireshark‑verified"],
    scale: "1 partition; 1 KB batch size",
    scope: "Owner — request parser, broker loop",
    actions: [
      { label: "Open Repo", href: "https://github.com/iqbal-sk" },
      // { label: "Open Bench", href: "#" },
      // { label: "Open PCAP", href: "#" },
    ],
    proofs: [
      { src: "/Kafka.png", alt: "Kafka diagram" },
      { src: "/placeholder.svg", alt: "Bench chart" },
      { src: "/placeholder.svg", alt: "Latency chart" },
    ],
    sections: [
      { title: "Why I Built It Myself", body: "Internalize how Kafka actually talks on the wire — beyond client SDKs — and practice building a production‑style protocol surface." },
      { title: "Dissecting the Protocol", body: "Read the protocol spec; decoded request headers, correlation IDs, varint/zigzag, CRC32; verified message frames with Wireshark." },
      { title: "Architecture from the Ground Up", body: "Encoder/decoder with strict byte‑ordering; minimal broker loop that serves Metadata and handles Produce/Fetch to a simple on‑disk append log." },
      { title: "Making It Speak the Language", body: "Validated with Kafka tooling: produced and fetched basic records; confirmed checksums and framing via packet captures." },
      { title: "Debugging Reality", body: "Fixed endian mismatches and partial reads; added back‑pressure on socket writes; instrumented logs for correlation across request/response pairs." },
      { title: "What I Learned", body: "How batching, checksums, and request pipelining shape throughput; why protocol evolution/versioning matters for compatibility." },
    ],
    skills: ["Python", "Networking", "Kafka", "Binary Protocols"],
    role: "Backend",
  },
  {
    title: "CodeForge — FastAPI + Sandboxed Judge (CSES)",
    oneLiner:
      "Backend + judge that brings a smooth submit→run→verdict loop to the CSES problem set with SSE live updates.",
    summary:
      "FastAPI APIs, JWT auth, Mongo persistence, Redis queue/pubsub, an async judge worker, and a scraper that imports problems/testcases.",
    githubLink: "https://github.com/iqbal-sk/CodeForge",
    hostingLink: null,
    stats: ["SSE live status", "Sandboxed judge"],
    scale: "Docker Compose: Mongo, Redis, API, Judge; multi‑language submissions (Py/C++/Java/JS)",
    scope: "Owner — API, judge, scraper, infra",
    actions: [
      { label: "Open Repo", href: "https://github.com/iqbal-sk/CodeForge" },
    ],
    sections: [
      { title: "The Spark", body: "CSES lacks a built‑in code‑and‑run flow. I built a local platform to submit code, watch live verdicts, and inspect results quickly." },
      { title: "Constraints", body: "Isolated execution, async job flow, live feedback, and reproducible local setup; handle hidden/public testcases safely." },
      { title: "Architecture", body: "FastAPI platform (auth, problems, submissions) + Redis queue/pubsub + async judge worker + SSE for live events; Mongo stores problems/cases/submissions." },
      { title: "Experiments", body: "Sandbox profiles, multi‑language toolchains inside judge image, volume‑mounted testcase data, and scraper that imports CSES problems (requires PHPSESSID)." },
      { title: "Outcomes", body: "Smooth submit→run→verdict loop with durable storage and real‑time status; one‑command Docker Compose bootstraps everything." },
      { title: "What I’d do next", body: "More languages, tighter sandboxes, cached toolchains, search and difficulty filters, and submission insights." },
    ],
    skills: ["FastAPI", "Redis", "MongoDB", "SSE", "Docker", "Python", "Async"],
    role: "Backend",
  },
  {
    title: "Redis-Compatible Server — C",
    summary:
      "Work‑in‑progress Redis‑compatible server in C. RESP parser, non‑blocking event loop, in‑memory store; supports PING/ECHO/SET/GET with TTL scaffolding.",
    githubLink: "https://github.com/iqbal-sk",
    hostingLink: null,
    sections: [
      { title: "Why I Built It Myself", body: "Learn event loops, non‑blocking I/O, and memory management by implementing a real protocol in C." },
      { title: "Dissecting the Protocol", body: "Studied RESP; wrote a zero‑allocation tokenizer for simple bulk strings and arrays; verified packets against redis‑cli." },
      { title: "Architecture from the Ground Up", body: "Single‑threaded loop using select/epoll; in‑memory dict for keys; TTL scaffolding and a simple time wheel for expirations." },
      { title: "Making It Speak the Language", body: "SET/GET/PING/ECHO interop with redis‑cli; RESP serialization kept compatible with mainstream clients." },
      { title: "Debugging Reality", body: "Solved partial reads and stale writes; guarded against buffer overruns; added simple unit tests for parser edge cases." },
      { title: "What I Learned", body: "Atomicity and event ordering; why careful buffer management and back‑pressure are the core of networked KV stores." },
    ],
    skills: ["C", "Redis", "RESP", "Event Loop", "Systems"],
    role: "Backend",
  },
  {
    title: "LLMTwin — Personal Knowledge Base ETL",
    oneLiner:
      "Crawls GitHub/Medium into typed, Mongo‑backed documents with a ZenML pipeline — an LLM‑ready knowledge base for RAG and analytics.",
    summary:
      "Production‑lean ETL: dispatcher‑based crawlers, Pydantic models, minimal Mongo ODM, and a CLI that runs the end‑to‑end ZenML pipeline.",
    githubLink: "https://github.com/iqbal-sk/LLMTwin",
    hostingLink: null,
    stats: ["ZenML‑orchestrated", "Mongo + Pydantic"],
    scale: "Repos + posts; per‑domain success counts via step metadata",
    scope: "Owner — crawlers, ODM, pipeline, CLI",
    actions: [
      { label: "Open Repo", href: "https://github.com/iqbal-sk/LLMTwin" },
    ],
    sections: [
      { title: "The Spark", body: "Turn my public footprint into a durable, queryable corpus — one run that structures repos and posts for downstream LLM work." },
      { title: "Constraints", body: "Heterogeneous sources and formats; avoid brittle scrapes; keep runs reproducible and observable; keep dependencies light." },
      { title: "Architecture", body: "ZenML pipeline (user → crawl) with a dispatcher that routes links to site‑specific crawlers (GitHub, Medium, generic). Documents are Pydantic models saved via a minimal Mongo ODM; settings come from .env or ZenML secrets." },
      { title: "Experiments", body: "Mixed Selenium + fast HTML loaders; text‑only GitHub tree for token‑friendly storage; step metadata records success/total per domain for quick diagnostics." },
      { title: "Outcomes", body: "LLM‑ready corpus in Mongo; reproducible ETL via CLI; easy to add new crawlers without touching pipeline code." },
      { title: "What I’d do next", body: "Add incremental crawl/backfill, indexing strategy, and a RAG/summarization pipeline on top of the stored corpus." },
    ],
    skills: ["ZenML", "MongoDB", "Pydantic", "Selenium", "Python", "ETL"],
    role: "ML",
  },
];

/* -------------------------------- Component ------------------------------- */
const ExperienceProjects = () => {
  const [tab, setTab] = useState("experience");
  const { visibleElements, observeElement } = useScrollAnimation();
  const [skillFilter, setSkillFilter] = useState("");
  const [originEl, setOriginEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const originRef = useRef(null);
  originRef.current = originEl ? { current: originEl } : null;

  // Global visual sizing (configurable via siteConfig.visuals.project)
  const figureSizeClass = (siteConfig?.visuals?.project?.figureSizeClass) || 'max-w-xl md:max-w-2xl mx-auto';
  const imgSizeClass = (siteConfig?.visuals?.project?.imgSizeClass) || 'max-h-64 md:max-h-80 object-contain';

  // Sync with hash (both directions)
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash;
      setTab(h === "#portfolio" ? "portfolio" : "experience");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    const handler = (e) => setSkillFilter(e.detail || "");
    window.addEventListener("skill:filter", handler);
    return () => window.removeEventListener("skill:filter", handler);
  }, []);

  const handleTabChange = (v) => {
    setTab(v);
    const targetHash = v === "portfolio" ? "#portfolio" : "#experience";
    history.replaceState(null, "", targetHash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  // Role is shown for tone, but do not hide projects by role
  const { role: activeRole } = useRole();
  const filteredProjects = projectData; // always show full list
  // Simplified: removed JSON-LD to keep component lean

  return (
    <section
      id="experience"
      ref={(el) => observeElement(el, "section-root")}
      className={[
        "pb-10 pt-[6em] mt-5 max-w-5xl mx-auto transition-all duration-700",
        "text-gray-800",
        "scroll-mt-24", // offset for sticky header
        visibleElements.has("section-root")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
        "[@media(prefers-reduced-motion:reduce)]:transition-none",
      ].join(" ")}
    >
      {/* Always-present alias anchor so #portfolio can scroll here even when the tab is inactive */}
      <div id="portfolio" className="relative -top-24 h-0 w-0" aria-hidden />

      <h2
        ref={(el) => observeElement(el, "header")}
        className={`text-4xl font-bold mb-6 text-center text-foreground transition-all duration-700 ${
          visibleElements.has("header")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        Experience & Portfolio
      </h2>

      <div className="w-full">
        <div
          ref={(el) => observeElement(el, "tabs")}
          className={`flex justify-center mb-8 transition-all duration-700 delay-200 ${
            visibleElements.has("tabs")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <SegmentedSwitch
            value={tab}
            onChange={(v) => handleTabChange(v)}
            className="shadow-sm"
            options={[
              { label: 'Experience', value: 'experience' },
              { label: 'Case Studies', value: 'portfolio' },
            ]}
          />
          {/* Optional: small hash hint for accessibility */}
          <span className="sr-only">
            {tab === "portfolio" ? "Case Studies tab active" : "Experience tab active"}
          </span>
        </div>

        {/* No content animation on switch; only the control animates */}
        {/* EXPERIENCE */}
        {tab === "experience" && (
          <div className="mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 px-4">
                {experienceData.map((experience, index) => (
                  <article
                    key={index}
                    ref={(el) => observeElement(el, `experience-${index}`)}
                    className={`transition-all duration-700 ${
                      visibleElements.has(`experience-${index}`)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                    style={{ transitionDelay: `${index * 100 + 300}ms` }}
                  >
                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Left: company / role / time */}
                        <div className="col-span-12 md:col-span-4">
                          {experience.theme && (
                            <div className="text-[11px] tracking-wide uppercase text-foreground/60 mb-1">{experience.theme}</div>
                          )}
                          <h3 className="text-xl font-bold text-foreground leading-tight">{experience.company}</h3>
                          <div className="text-foreground/75">{experience.title}</div>
                          <div className="text-sm text-foreground/60 mt-1">{experience.date}</div>
                        </div>

                        {/* Right: narrative + metrics */}
                        <div className="col-span-12 md:col-span-8">
                          {experience.metricLine && (
                            <div className="text-[12px] text-foreground/70 mb-1">{experience.metricLine}</div>
                          )}
                          <p className="text-sm text-muted-foreground leading-relaxed">{experience.prose || experience.description}</p>

                          {experience.tags && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {experience.tags.slice(0,8).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="rounded-full px-2.5 py-0.5 text-[11px] bg-muted border border-border text-foreground/80"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === "portfolio" && (
          <div className="mt-0">
            <div className="mx-5">
              <p
                ref={(el) => observeElement(el, "portfolio-desc")}
                className={`text-center text-muted-foreground mb-10 transition-all duration-700 delay-300 ${
                  visibleElements.has("portfolio-desc")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Hands‑on case studies for {activeRole} work — each shows the problem, approach, and outcome with code.
              </p>
              {/* Top-level filter chips (editable via siteConfig.caseStudyTags) */}
              <div className="mx-auto max-w-3xl -mt-6 mb-8 flex flex-wrap items-center justify-center gap-2">
                {(siteConfig.caseStudyTags || []).map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSkillFilter(t.label)}
                    className={`rounded-full px-3 py-1 text-xs border ${
                      skillFilter === t.label
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-foreground/90 border-border hover:bg-muted/80'
                    }`}
                    title={`Filter: ${t.label}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {skillFilter && (
                <div className="mx-auto max-w-3xl mb-6 flex items-center justify-center gap-3">
                  <span className="text-sm text-muted-foreground">Filtered by skill:</span>
                  <span className="px-3 py-1 rounded-full bg-muted text-foreground/90 border border-border text-xs">{skillFilter}</span>
                  <button className="text-xs text-primary hover:underline" onClick={() => setSkillFilter("")}>Clear</button>
                </div>
              )}

              {/* GitHub activity moved into Recruiter Snapshot for cleaner flow */}

              {/* Pinned repos removed per user's request */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {((filteredProjects.length ? filteredProjects : projectData)
                .filter((p) => {
                  if (!skillFilter) return true;
                  if ((p.skills || []).includes(skillFilter)) return true;
                  const tag = (siteConfig.caseStudyTags || []).find((t) => t.label === skillFilter);
                  if (!tag) return false;
                  const skills = (p.skills || []).join(' ').toLowerCase();
                  return (tag.match || []).some((m) => skills.includes(String(m).toLowerCase()));
                })
              ).map((project, index) => (
                <article
                  key={index}
                  ref={(el) => observeElement(el, `project-${index}`)}
                  className={`mb-6 transition-all duration-700 ${
                    visibleElements.has('project-' + index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 120 + 300}ms` }}
                >
                  <div
                    className="group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 h-full flex flex-col"
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                  >
                    {/* Thumbnail (3:2) with hover swap */}
                    {project.visual && (
                      <div className="relative w-full aspect-[21/9] bg-muted/40">
                        <img
                          src={project.visual.src}
                          alt={project.visual.alt || project.title}
                          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                          loading="lazy"
                          decoding="async"
                        />
                        <img
                          src={project.visual.hoverSrc || project.visual.src}
                          alt={(project.visual.alt || project.title) + ' (diagram)'}
                          className="absolute inset-0 h-full w-full object-contain bg-card transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Hover cue: gradient + label */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
                        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 text-[12px] font-medium text-white/95 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                          <span>View case study</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </div>
                      </div>
                    )}

                    <div className="p-3 flex flex-col flex-1 min-h-[120px]">
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      {(project.oneLiner || project.summary || project.description) && (
                        <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">{project.oneLiner || project.summary || project.description}</p>
                      )}

                      {/* Stat pills (max 2) */}
                      {project.stats && project.stats.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.stats.slice(0,2).map((s, i) => (
                            <span
                              key={i}
                              className="rounded-full px-2.5 py-0.5 text-[11px] bg-muted border border-border text-foreground/80 translate-y-0 group-hover:-translate-y-1 transition-transform"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.skills.slice(0,6).map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-full px-2 py-0.5 text-[10px] bg-muted/60 border border-border text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action row */}
                      <div className="mt-auto pt-3 flex flex-wrap items-center gap-2.5">
                        {(project.actions && project.actions.length > 0) ? (
                          project.actions.map((a, i) => (
                            <a
                              key={i}
                              href={a.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center rounded-full px-2.5 py-1.25 text-[11px] font-medium border transition-colors ${i === 0 ? 'bg-primary text-primary-foreground border-primary hover:brightness-110' : 'bg-muted text-foreground/90 border-border hover:bg-muted/80'}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {a.label}
                            </a>
                          ))
                        ) : (
                          project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-full px-2.5 py-1.25 text-[11px] font-medium bg-primary text-primary-foreground border border-primary hover:brightness-110"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Open Repo
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* Case Study Detail Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProject(null)} />
          <div className="relative z-10 w-full max-w-[960px]">
            <div className="rounded-2xl border border-border bg-background/95 supports-[backdrop-filter]:backdrop-blur-xl p-4 md:p-5 max-h-[85vh] overflow-auto">
              {/* Title row */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-12 md:col-span-8">
                  <h2 className="text-lg md:text-xl font-bold text-foreground">{selectedProject.title}</h2>
                  {(selectedProject.oneLiner || selectedProject.summary) && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{selectedProject.oneLiner || selectedProject.summary}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-4 flex md:justify-end gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title: selectedProject.title, url }).catch(() => {});
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(url).catch(() => {});
                      }
                    }}
                    className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-muted text-foreground/90 border border-border hover:bg-muted/80"
                  >
                    Share
                  </button>
                  {((selectedProject.actions && selectedProject.actions[0]) || (selectedProject.githubLink ? { label: 'Open Repo', href: selectedProject.githubLink } : null)) && (
                    <a
                      href={(selectedProject.actions && selectedProject.actions[0]?.href) || selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground border border-primary hover:brightness-110"
                    >
                      {(selectedProject.actions && selectedProject.actions[0]?.label) || 'Open Repo'}
                    </a>
                  )}
                  <button onClick={() => setSelectedProject(null)} className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-muted text-foreground/90 border border-border hover:bg-muted/80">Close</button>
                </div>
              </div>

              <hr className="my-4 border-border" />

              {/* Hero visual (compact) */}
              {selectedProject.visual && (
                <div className="w-full">
                  <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden rounded-xl border border-border bg-muted/30">
                    <img src={selectedProject.visual.src} alt={selectedProject.visual.alt || selectedProject.title} className="absolute inset-0 h-full w-full object-contain" />
                  </div>
                  {selectedProject.visual.caption && (
                    <p className="text-center text-xs text-muted-foreground mt-2">{selectedProject.visual.caption}</p>
                  )}
                </div>
              )}

              {/* Main grid: 12 cols */}
              <div className="mt-4 grid grid-cols-12 gap-4">
                {/* Left: 8 cols */}
                <div className="col-span-12 md:col-span-8 max-w-prose">
                  {(selectedProject.sections || []).map((s, i) => (
                    <section key={i} className="mb-4">
                      <h3 className="text-base font-semibold text-foreground">{i + 1}. {s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{s.body}</p>
                    </section>
                  ))}

                  {/* Proof strip removed per request */}
                </div>

                {/* Right: 4 cols sticky rail */}
                <aside className="col-span-12 md:col-span-4 self-start">
                  <div className="rounded-xl border border-border bg-card p-3">
                    <h4 className="text-sm font-semibold text-foreground">Result</h4>
                    {selectedProject.stats && selectedProject.stats.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {selectedProject.stats.map((s, i) => (<li key={i}>• {s}</li>))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">See repository for details</p>
                    )}

                    {selectedProject.scale && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-foreground">Scale</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{selectedProject.scale}</p>
                      </div>
                    )}

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-foreground">Scope</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedProject.scope || 'Owner — end‑to‑end implementation'}</p>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-foreground">Links</h4>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs">
                        {selectedProject.actions && selectedProject.actions.map((a, i) => (
                          <a key={i} href={a.href} target="_blank" rel="noopener noreferrer" className="text-foreground/90 underline underline-offset-2 hover:text-foreground">
                            {a.label}
                          </a>
                        ))}
                        {selectedProject.githubLink && (!selectedProject.actions || !selectedProject.actions.length) && (
                          <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="text-foreground/90 underline underline-offset-2 hover:text-foreground">Repo</a>
                        )}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ExperienceProjects;
