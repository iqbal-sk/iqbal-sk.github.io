import React, { useMemo, useRef } from "react";
import { useRole } from "../context/RoleContext";

// Interactive, polished orbit inspired by the Status hero

const TOKENS = [
  { t: "Python", e: "🐍", role: "ML" },
  { t: "PyTorch", e: "🔥", role: "ML" },
  { t: "LangChain", e: "🧩", role: "ML" },
  { t: "RAG", e: "🗂️", role: "ML" },
  { t: "FAISS", e: "🔎", role: "ML" },
  { t: "vLLM", e: "⚡", role: "ML" },
  { t: "MLflow", e: "📈", role: "ML" },
  { t: "ZenML", e: "🧪", role: "ML" },
  { t: "C++", e: "➕", role: "ML" },
  { t: "FastAPI", e: "🚀", role: "both" },
  { t: "Java", e: "☕", role: "BE" },
  { t: "Spring", e: "🌿", role: "BE" },
  { t: "PostgreSQL", e: "🛢️", role: "BE" },
  { t: "MongoDB", e: "🍃", role: "BE" },
  { t: "Redis", e: "🧠", role: "BE" },
  { t: "Docker", e: "🐳", role: "both" },
  { t: "Terraform", e: "🏗️", role: "BE" },
  { t: "React", e: "⚛️", role: "BE" },
];

export default function SkillsWhirl() {
  const { role } = useRole();
  const wrapRef = useRef(null);

  const items = useMemo(() => {
    return TOKENS.filter(
      (x) => x.role === "both" || (role === "Backend" ? x.role === "BE" : x.role === "ML")
    );
  }, [role]);

  const path = `path('M 20 300 C 120 60 280 540 420 300 S 640 240 760 180')`;

  const handleMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrapRef.current.style.setProperty("--rx", `${y * -5}deg`);
    wrapRef.current.style.setProperty("--ry", `${x * 6}deg`);
  };

  const handleLeave = () => {
    if (!wrapRef.current) return;
    wrapRef.current.style.setProperty("--rx", `0deg`);
    wrapRef.current.style.setProperty("--ry", `0deg`);
  };

  const click = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full overflow-hidden rounded-[14px] border border-gray-200 bg-white"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background confetti */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 8% 32%, rgba(255,205,178,.35) 0 2px, transparent 3px)," +
              "radial-gradient(circle at 82% 22%, rgba(186,230,253,.35) 0 2px, transparent 3px)," +
              "radial-gradient(circle at 28% 78%, rgba(196,181,253,.35) 0 2px, transparent 3px)",
            backgroundSize: "180px 180px, 220px 220px, 200px 200px",
            transform: "translateZ(-30px)",
          }}
        />
      </div>

      <div className="relative grid md:grid-cols-2 gap-6 items-center px-6 py-10">
        {/* Headline */}
        <div className="text-center md:text-left" style={{ transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 bg-white/70">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Role-aware skills
          </span>
          <h3 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Make the jump to your stack
          </h3>
          <p className="mt-3 text-gray-700">
            Curated tools I use across {role === 'Backend' ? 'backend systems, data, and infra' : 'LLMs, retrieval, and MLOps'}.
          </p>
        </div>

        {/* Right: orbit path */}
        <div className="relative h-[360px]">
          {items.map((it, i) => {
            const n = items.length;
            const from = (i * (85 / n)) + 5; // spread along 5..90%
            const to = from + 8 + (i % 3); // small oscillation range
            const dur = 5 + (i % 5) * 0.6;
            const dir = i % 2 === 0 ? "alternate" : "alternate-reverse";
            return (
              <button
                key={it.t}
                onClick={() => click(it.t)}
                className="token absolute will-change-transform"
                style={{
                  offsetPath: path,
                  animation: `orbit ${dur}s ease-in-out ${dir} infinite`,
                  // custom props for keyframes
                  ['--from']: `${from}%`,
                  ['--to']: `${to}%`,
                }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-900 shadow-sm hover:shadow-md transition-transform">
                  <span className="text-base" aria-hidden>{it.e}</span>
                  {it.t}
                </span>
              </button>
            );
          })}

          {/* soft right-hand vignette to mimic hero */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white" />
        </div>
      </div>

      <style>{`
        .token { transform: translateZ(20px) rotateX(var(--rx,0)) rotateY(var(--ry,0)); }
        .token:hover { transform: translateZ(40px) scale(1.06) rotateX(var(--rx,0)) rotateY(var(--ry,0)); }
        @keyframes orbit {
          0% { offset-distance: var(--from); }
          100% { offset-distance: var(--to); }
        }
      `}</style>
    </div>
  );
}
