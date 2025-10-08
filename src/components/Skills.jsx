// src/components/Skills.jsx  (Vite/React)
import { lazy, Suspense, useCallback, useState } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));
import { useRole } from "../context/RoleContext";
// Only the keyboard section is kept
import SkillsConstellation from "./SkillsConstellation";
import SegmentedSwitch from "./SegmentedSwitch";
import Crossfade from "./Crossfade";

// Optional: map Spline object names -> nice labels/descriptions
// Note: Object names depend on the Spline scene; this map powers on-hover labels.
// We also render a static skills grid below to reliably showcase your stack.
const LABELS = {
  // Web/General
  js: { label: "JavaScript", desc: "ES6+, async/await" },
  ts: { label: "TypeScript", desc: "Types, generics" },
  react: { label: "React", desc: "Hooks, Suspense" },
  next: { label: "Next.js", desc: "App Router, SSR/ISR" },
  node: { label: "Node.js", desc: "Express, REST" },
  tailwind: { label: "Tailwind", desc: "Utility-first CSS" },
  docker: { label: "Docker", desc: "Containers, Compose" },
  aws: { label: "AWS", desc: "Bedrock, S3" },
  postgres: { label: "PostgreSQL", desc: "SQL, indexes" },

  // Your stack highlights
  python: { label: "Python", desc: "LLMs, tooling" },
  java: { label: "Java", desc: "Spring Boot APIs" },
  cpp: { label: "C++", desc: "Systems & DS/Algos" },
  sql: { label: "SQL", desc: "RDBMS, queries" },
  mongodb: { label: "MongoDB", desc: "Doc store" },
  redis: { label: "Redis", desc: "Caching" },
  dynamodb: { label: "DynamoDB", desc: "KV/NoSQL" },
  pytorch: { label: "PyTorch", desc: "Training & finetune" },
  langchain: { label: "LangChain", desc: "RAG, tools" },
  langgraph: { label: "LangGraph", desc: "Agents/graphs" },
  crewai: { label: "Crew AI", desc: "Agents" },
  huggingface: { label: "HuggingFace", desc: "Models/Datasets" },
  fastapi: { label: "FastAPI", desc: "LLM backends" },
  spring: { label: "Spring Boot", desc: "REST, SSE" },
  autogen: { label: "AutoGen", desc: "Agents" },
  xgboost: { label: "XGBoost", desc: "Tabular ML" },
  sklearn: { label: "scikit‑learn", desc: "Classical ML" },
  cv: { label: "Computer Vision", desc: "OpenCV" },
  nlp: { label: "NLP", desc: "Tokenization, eval" },
  rag: { label: "RAG", desc: "Retrieval, eval" },
  pinecone: { label: "Pinecone", desc: "Vector DB" },
  milvus: { label: "Milvus", desc: "Vector DB" },
  faiss: { label: "FAISS", desc: "ANN index" },
  peft: { label: "PEFT/LoRA", desc: "Efficient FT" },
  dpo: { label: "DPO/GRPO", desc: "Alignment" },
  git: { label: "Git", desc: "Flow, reviews" },
  jenkins: { label: "Jenkins", desc: "CI" },
  terraform: { label: "Terraform", desc: "IaC" },
  zenml: { label: "ZenML", desc: "Pipelines" },
  mlflow: { label: "MLflow", desc: "Tracking" },
  vllm: { label: "vLLM", desc: "Serving" },
  azure: { label: "Azure AI", desc: "Foundry" },
};

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Python", "Java", "C++", "JavaScript", "SQL"],
  },
  {
    title: "Databases",
    items: ["MySQL", "MongoDB", "PostgreSQL", "Redis", "DynamoDB"],
  },
  {
    title: "Frameworks",
    items: [
      "PyTorch",
      "LangChain",
      "LangGraph",
      "Crew AI",
      "HuggingFace",
      "FastAPI",
      "Spring Boot",
      "React",
      "AutoGen",
    ],
  },
  {
    title: "ML/DL",
    items: [
      "XGBoost",
      "scikit‑learn",
      "Computer Vision",
      "NLP",
      "Predictive Modeling",
      "Supervised/Unsupervised",
    ],
  },
  {
    title: "GenAI",
    items: [
      "RAG",
      "Pinecone",
      "Milvus",
      "FAISS",
      "LLM FT (PEFT/LoRA)",
      "Preference Align (DPO/GRPO)",
    ],
  },
  {
    title: "MLOps / LLMOps",
    items: [
      "Git",
      "Docker",
      "Jenkins",
      "Terraform",
      "ZenML",
      "MLflow",
      "vLLM",
      "Azure AI Foundry",
      "AWS Bedrock",
    ],
  },
];

export default function Skills() {
  const { role } = useRole();
  // Keep keyboard code in file, but render only constellation
  const [graphMode, setGraphMode] = useState("combined"); // combined | ML | Backend
  const handleLoad = useCallback((app) => {
    // 1) Shrink + position the keyboard once
    const kbd =
      app.findObjectByName("keyboard") || app.findObjectByName("Keyboard");
    if (kbd) {
      // Slightly smaller + softer tilt for a calmer look
      const s = 0.22;
      kbd.scale.x = s;
      kbd.scale.y = s;
      kbd.scale.z = s;
      kbd.position.x = 0;
      kbd.position.y = -20;
      kbd.position.z = 0;
      kbd.rotation.x = -0.08;
      kbd.rotation.y = Math.PI / 18; // ~10 degrees
      kbd.rotation.z = 0;
    }

    // 2) Force keycaps visible (original site reveals them via GSAP) and mute colors a touch
    const all = app.getAllObjects();
    all
      .filter((o) =>
        ["keycap", "keycap-desktop", "keycap-mobile"].includes(o.name)
      )
      .forEach((o) => {
        o.visible = true;
        // Desaturate vivid colors slightly to fit site theme
        try {
          const m = o.material || o.__material || o.mat;
          if (m && m.color && m.color.setRGB) {
            const c = m.color;
            const r = c.r * 0.8 + 0.2 * 0.85;
            const g = c.g * 0.8 + 0.2 * 0.87;
            const b = c.b * 0.8 + 0.2 * 0.90;
            c.setRGB(r, g, b);
          }
          if (m && typeof m.metalness === 'number') m.metalness = Math.min(0.2, m.metalness);
          if (m && typeof m.roughness === 'number') m.roughness = Math.max(0.6, m.roughness);
        } catch {}
      });

    // Hide any remaining big 3D text overlays from the scene
    try {
      all.forEach((o) => {
        const nm = (o.name || '').toLowerCase();
        const tp = (o.type || '').toLowerCase();
        if (tp.includes('text') || /text|label|javascript|heading/.test(nm)) {
          o.visible = false;
        }
      });
    } catch {}

    // 3) Hide built-in labels; they are too loud for this theme
    const desktop = app.findObjectByName("text-desktop");
    const desktopDark = app.findObjectByName("text-desktop-dark");
    const mobile = app.findObjectByName("text-mobile");
    const mobileDark = app.findObjectByName("text-mobile-dark");
    if (desktop) desktop.visible = false;
    if (desktopDark) desktopDark.visible = false;
    if (mobile) mobile.visible = false;
    if (mobileDark) mobileDark.visible = false;

    // 4) Show/update label text when you hover/press a keycap
    const show = (name) => {
      const s = LABELS[name];
      if (s) {
        app.setVariable("heading", s.label);
        app.setVariable("desc", s.desc);
      } else {
        app.setVariable("heading", "");
        app.setVariable("desc", "");
      }
    };

    app.addEventListener("mouseHover", (e) => {
      if (
        !e.target ||
        e.target.name === "body" ||
        e.target.name === "platform"
      ) {
        show(null);
      } else {
        show(e.target.name);
      }
    });
    app.addEventListener("keyDown", (e) => show(e.target?.name));
    app.addEventListener("keyUp", () => show(null));

    // Helper: print all object names so you can extend LABELS to match your scene
    console.log("Spline object names:", [...new Set(all.map((o) => o.name))]);
  }, []);

  return (
    <section
      id="skills"
      className="relative w-full pt-[6em] pb-16 mt-5 flex flex-col items-center"
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-4xl font-bold text-foreground text-center">Skills</h2>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Graph</span>
          <SegmentedSwitch
            value={graphMode}
            onChange={(v)=> setGraphMode(v)}
            options={[
              { label: 'combined', value: 'combined' },
              { label: 'ML', value: 'ML' },
              { label: 'Backend', value: 'Backend' },
            ]}
          />
        </div>
      </div>
      <div className="mt-6 w-full max-w-6xl px-4">
        <SkillsConstellation key={graphMode} mode={graphMode} />
      </div>
    </section>
  );
}
