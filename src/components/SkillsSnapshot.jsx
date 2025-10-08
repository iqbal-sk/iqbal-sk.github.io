import React from "react";
import { useRole } from "../context/RoleContext";

// Recruiter-friendly, calm snapshot of skills.

const DATA = {
  ML: {
    top: ["Python", "PyTorch", "LangChain", "RAG", "FAISS", "FastAPI", "MLflow", "Docker"],
    strengths: [
      { title: "Modeling", level: 5, items: ["PyTorch", "PEFT/LoRA", "XGBoost"] },
      { title: "Retrieval", level: 5, items: ["FAISS", "Pinecone", "LangChain"] },
      { title: "Serving", level: 4, items: ["FastAPI", "vLLM", "gRPC"] },
      { title: "MLOps", level: 4, items: ["MLflow", "ZenML", "Docker"] },
    ],
  },
  Backend: {
    top: ["Java", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "Docker", "FastAPI", "React"],
    strengths: [
      { title: "APIs", level: 5, items: ["REST", "Spring Boot", "FastAPI"] },
      { title: "Data", level: 4, items: ["PostgreSQL", "MongoDB", "Redis"] },
      { title: "Infra", level: 4, items: ["Docker", "Terraform", "Jenkins"] },
      { title: "Frontend", level: 3, items: ["React", "Tailwind", "Vite"] },
    ],
  },
};

function Meter({ level = 0 }) {
  return (
    <div className="flex gap-1" aria-label={`Proficiency ${level}/5`}>
      {[1,2,3,4,5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-full ${i <= level ? 'bg-gray-900' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}

function Chip({ label, onClick }) {
  return (
    <button
      onClick={() => onClick?.(label)}
      className="rounded-full border border-gray-300 bg-white/90 px-3 py-1 text-xs text-gray-900 hover:bg-gray-50"
    >
      {label}
    </button>
  );
}

export default function SkillsSnapshot() {
  const { role } = useRole();
  const data = role === "Backend" ? DATA.Backend : DATA.ML;

  const click = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white/80 p-6">
      {/* Top tools */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-2">Top Tools</div>
        <div className="flex flex-wrap gap-2">
          {data.top.map((t) => (
            <Chip key={t} label={t} onClick={click} />
          ))}
        </div>
      </div>

      {/* Strengths grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {data.strengths.map((s) => (
          <div key={s.title} className="rounded-[10px] border border-gray-200 bg-white/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">{s.title}</div>
              <Meter level={s.level} />
            </div>
            <div className="flex flex-wrap gap-2">
              {s.items.map((t) => (
                <Chip key={t} label={t} onClick={click} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Light footer note */}
      <div className="mt-5 text-xs text-gray-500">
        Click any skill to filter case studies below.
      </div>
    </div>
  );
}

