import React from "react";
import { useRole } from "../context/RoleContext";

const ML = ["Python","PyTorch","LangChain","RAG","FAISS","Pinecone","FastAPI","MLflow","vLLM"];
const BE = ["Java","Spring Boot","FastAPI","PostgreSQL","MongoDB","Redis","Docker","Terraform","Jenkins","React"];

export default function ToolbeltShelf() {
  const { role } = useRole();
  const items = role === "Backend" ? BE : ML;

  const setFilter = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white/70 p-3 overflow-x-auto">
      <div className="flex gap-3 will-change-transform">
        {items.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-2 text-sm text-gray-800 bg-white rounded-[10px] border border-gray-300 shadow-sm hover:-translate-y-0.5 hover:shadow transition transform"
            style={{ perspective: '800px' }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

