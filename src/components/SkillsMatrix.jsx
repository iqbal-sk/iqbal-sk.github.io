import React from "react";
import { useRole } from "../context/RoleContext";

const DATA = {
  ML: {
    Languages: ["Python", "C++"],
    Frameworks: ["PyTorch", "LangChain", "LangGraph"],
    Retrieval: ["RAG", "FAISS", "Pinecone"],
    Serving: ["FastAPI", "vLLM"],
    MLOps: ["MLflow", "ZenML", "Docker"],
  },
  Backend: {
    Languages: ["Java", "JavaScript", "SQL"],
    Frameworks: ["Spring Boot", "FastAPI", "React"],
    Data: ["PostgreSQL", "MongoDB", "Redis"],
    Infra: ["Docker", "Terraform", "Jenkins"],
  },
};

export default function SkillsMatrix() {
  const { role } = useRole();
  const groups = role === "Backend" ? DATA.Backend : DATA.ML;

  const setFilter = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white/70 p-4">
      {Object.entries(groups).map(([cat, skills]) => (
        <div key={cat} className="mb-3 last:mb-0">
          <div className="text-sm font-semibold text-gray-900 mb-2">{cat}</div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="relative rounded-full border border-gray-300 bg-white/70 px-3 py-1 text-xs text-gray-800 hover:bg-gray-50"
              >
                <span className="absolute -left-1 -top-1 w-1.5 h-1.5 rounded-full bg-gray-400" />
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

