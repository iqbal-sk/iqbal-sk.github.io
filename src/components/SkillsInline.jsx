import React from "react";
import { useRole } from "../context/RoleContext";

// Curated, industry-relevant shortlist (<=12) for quick scanning
const ML_SKILLS = [
  "Python",
  "PyTorch",
  "LangChain",
  "LangGraph",
  "RAG",
  "FAISS",
  "Pinecone",
  "PEFT/LoRA",
  "DPO",
  "vLLM",
  "FastAPI",
  "MLflow",
];

const BE_SKILLS = [
  "Java",
  "Spring Boot",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Terraform",
  "Jenkins",
  "Git",
  "React",
  "CI/CD",
];

export default function SkillsInline() {
  const { role } = useRole();
  const items = role === "Backend" ? BE_SKILLS : ML_SKILLS;

  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Industry Focus</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground/90"
          >
            {s}
          </span>
        ))}
      </div>
      <a href="#skills" className="mt-2 inline-flex text-xs text-primary hover:underline">
        View all skills
      </a>
    </div>
  );
}
