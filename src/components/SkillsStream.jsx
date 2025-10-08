import React, { useMemo, useRef } from "react";
import { useRole } from "../context/RoleContext";

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

function Track({ items = [], speed = 30, reverse = false, top = 0, tilt = -18, onClick }) {
  // Duplicate items to create a seamless marquee
  const repeated = [...items, ...items, ...items];
  const dir = reverse ? "reverse" : "normal";
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap select-none"
      style={{ top, transform: `translateX(-50%) rotate(${tilt}deg)` }}
    >
      <div
        className="inline-flex gap-3 will-change-transform"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: dir,
        }}
      >
        {repeated.map((it, i) => (
          <button
            key={`${it.t}-${i}`}
            onClick={() => onClick?.(it.t)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-1 text-xs text-gray-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform"
          >
            <span className="text-base" aria-hidden>{it.e}</span>
            {it.t}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SkillsStream() {
  const { role } = useRole();
  const wrap = useRef(null);

  const items = useMemo(() => TOKENS.filter(
    (x) => x.role === "both" || (role === "Backend" ? x.role === "BE" : x.role === "ML")
  ), [role]);

  const onMove = (e) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrap.current.style.setProperty("--tilt", `${x * 2}deg`);
    wrap.current.style.setProperty("--lift", `${y * -6}px`);
  };

  const click = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Compose the section edge-to-edge with overflowing streams
  return (
    <section
      ref={wrap}
      className="relative w-[100vw] -ml-[50vw] left-1/2 right-1/2 translate-x-1/2 overflow-visible"
      onMouseMove={onMove}
      onMouseLeave={() => { if (wrap.current){ wrap.current.style.removeProperty('--tilt'); wrap.current.style.removeProperty('--lift'); } }}
    >
      {/* Soft wash background */}
      <div className="absolute inset-0 -z-10" style={{
        background: "radial-gradient(1200px 600px at 10% 60%, rgba(59,130,246,0.08), transparent), radial-gradient(900px 500px at 90% 20%, rgba(244,114,182,0.08), transparent)",
        maskImage: "radial-gradient(80% 60% at 50% 50%, black 60%, transparent 100%)",
      }} />

      {/* Large typographic header */}
      <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-20">
        <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Tools that orbit my work
        </h3>
        <p className="mt-3 text-gray-700 max-w-2xl">
          A living stream of the technologies I use across {role === 'Backend' ? 'backend systems' : 'LLMs and MLOps'}. Hover to tilt, click any to filter projects.
        </p>
      </div>

      {/* Streams crossing the viewport. Tracks are wider than the screen and rotate slightly. */}
      <div className="relative h-[36rem] sm:h-[32rem] md:h-[34rem] lg:h-[36rem] overflow-visible">
        <Track items={items} speed={38} reverse={false} top={"20%"} tilt={-18} onClick={click} />
        <Track items={items} speed={46} reverse={true} top={"48%"} tilt={-12} onClick={click} />
        <Track items={items} speed={52} reverse={false} top={"76%"} tilt={-20} onClick={click} />
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) rotate(var(--tilt,0)) translateY(var(--lift,0)); }
          to { transform: translateX(-50%) rotate(var(--tilt,0)) translateY(var(--lift,0)); }
        }
      `}</style>
    </section>
  );
}

