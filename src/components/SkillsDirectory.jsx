import React from "react";
import { useRole } from "../context/RoleContext";

// Directory-style, label/value grid inspired by godly.website info panels
// Clickable skills dispatch a global filter event consumed by Projects section.

const DATA = {
  ML: [
    { label: "Languages", items: ["Python", "C++", "SQL"] },
    { label: "Frameworks", items: ["PyTorch", "LangChain", "LangGraph"] },
    { label: "GenAI", items: ["RAG", "FAISS", "Pinecone", "vLLM"] },
    { label: "Serving", items: ["FastAPI", "gRPC", "REST"] },
    { label: "MLOps", items: ["MLflow", "ZenML", "Docker"] },
    { label: "Cloud", items: ["AWS Bedrock", "Azure AI"] },
  ],
  Backend: [
    { label: "Languages", items: ["Java", "JavaScript", "Python", "SQL"] },
    { label: "Frameworks", items: ["Spring Boot", "FastAPI", "React"] },
    { label: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "DynamoDB"] },
    { label: "Infra", items: ["Docker", "Terraform", "Jenkins"] },
    { label: "APIs", items: ["REST", "GraphQL", "WebSocket"] },
    { label: "Cloud", items: ["AWS", "Azure"] },
  ],
};

export default function SkillsDirectory() {
  const { role } = useRole();
  const groups = role === "Backend" ? DATA.Backend : DATA.ML;

  const setFilter = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white/70 p-5">
      {/* 2-column layout like the reference: left label, right values */}
      <div className="divide-y divide-gray-200">
        {groups.map(({ label, items }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-3 py-3">
            <div className="sm:w-40 shrink-0 text-sm font-semibold text-gray-900">
              {label}
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="rounded-full border border-gray-300 bg-white/80 px-3 py-1 text-xs text-gray-800 hover:bg-gray-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

