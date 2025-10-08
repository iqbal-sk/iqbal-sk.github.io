import React from "react";
import { useRole } from "../context/RoleContext";

const ML = [
  { title: "Modeling", skills: ["Python", "PyTorch", "scikit‑learn", "XGBoost"] },
  { title: "Retrieval", skills: ["RAG", "LangChain", "FAISS", "Pinecone"] },
  { title: "Serving", skills: ["FastAPI", "vLLM"] },
  { title: "MLOps", skills: ["MLflow", "ZenML", "Docker"] },
];

const BE = [
  { title: "APIs", skills: ["Java", "Spring Boot", "FastAPI"] },
  { title: "Data", skills: ["PostgreSQL", "MongoDB", "Redis"] },
  { title: "Infra", skills: ["Docker", "Terraform", "Jenkins"] },
  { title: "Frontend", skills: ["React"] },
];

export default function CapabilityPillars() {
  const { role } = useRole();
  const groups = role === "Backend" ? BE : ML;

  const setFilter = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {groups.map((g) => (
        <div key={g.title} className="rounded-[12px] border border-gray-200 bg-white/70 p-4">
          <div className="text-sm font-semibold text-gray-900">{g.title}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.skills.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="rounded-full border border-gray-300 bg-white/70 px-3 py-1 text-xs text-gray-800 hover:bg-gray-50"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFilter(g.skills[0])}
            className="mt-3 text-xs text-indigo-600 hover:underline"
          >
            Show projects
          </button>
        </div>
      ))}
    </div>
  );
}

