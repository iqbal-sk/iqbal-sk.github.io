import React, { useMemo, useRef, useState } from "react";
import { useRole } from "../context/RoleContext";

// Calm, recruiter-friendly constellation map of skills.

// Design tokens for this section, referencing CSS variables for theme.
const THEME = {
  accent: "var(--primary)",
  edgeNeutral: "var(--graph-edge)",
  spokeNeutral: "var(--graph-spoke)",
  hubCore: "var(--foreground)",
  text: "var(--graph-label)",
  haloInner: "var(--primary)",
  haloOuter: "var(--primary)",
};

// Center label polish for a recruiter-friendly tone.
const CENTER_LABELS = {
  // ML
  Modeling: 'Modeling & Tuning',
  Retrieval: 'Retrieval & Knowledge',
  Serving: 'Model Serving',
  MLOps: 'MLOps & Tracking',
  // Backend
  APIs: 'API Layer',
  Data: 'Data Layer',
  Infra: 'Platform & Infra',
  Frontend: 'Frontend & UX',
};

const ML = {
  centers: [
    { id: "Modeling", x: 180, y: 150 },
    { id: "Retrieval", x: 480, y: 90 },
    { id: "Serving", x: 760, y: 170 },
    { id: "MLOps", x: 520, y: 320 },
  ],
  nodes: [
    { id: "Python", center: "Modeling", x: 120, y: 210 },
    { id: "PyTorch", center: "Modeling", x: 210, y: 110 },
    { id: "C++", center: "Modeling", x: 70, y: 120 },
    { id: "HuggingFace", center: "Modeling", x: 250, y: 200 },
    { id: "Transformers", center: "Modeling", x: 160, y: 60 },
    { id: "NumPy", center: "Modeling", x: 90, y: 180 },
    { id: "Pandas", center: "Modeling", x: 140, y: 260 },
    { id: "scikit-learn", center: "Modeling", x: 235, y: 75 },
    { id: "XGBoost", center: "Modeling", x: 260, y: 135 },
    { id: "LangChain", center: "Retrieval", x: 450, y: 170 },
    { id: "RAG", center: "Retrieval", x: 540, y: 120 },
    { id: "FAISS", center: "Retrieval", x: 410, y: 40 },
    { id: "Pinecone", center: "Retrieval", x: 560, y: 50 },
    { id: "FastAPI", center: "Serving", x: 740, y: 100 },
    { id: "vLLM", center: "Serving", x: 840, y: 160 },
    { id: "gRPC", center: "Serving", x: 700, y: 220 },
    { id: "MLflow", center: "MLOps", x: 470, y: 370 },
    { id: "ZenML", center: "MLOps", x: 590, y: 350 },
    { id: "Docker", center: "MLOps", x: 610, y: 420 },
  ],
  edges: [
    ["Python", "PyTorch"],
    ["Python", "scikit-learn"],
    ["scikit-learn", "XGBoost"],
    ["PyTorch", "MLflow"],
    ["HuggingFace", "Transformers"],
    ["LangChain", "RAG"],
    ["RAG", "FAISS"],
    ["RAG", "Pinecone"],
    ["FastAPI", "vLLM"],
    ["MLflow", "Docker"],
    ["MLflow", "ZenML"],
    ["FastAPI", "LangChain"],
    ["NumPy", "Pandas"],
    ["Python", "Pandas"],
  ],
};

const BE = {
  centers: [
    { id: "APIs", x: 200, y: 130 },
    { id: "Data", x: 520, y: 90 },
    { id: "Infra", x: 760, y: 180 },
    { id: "Frontend", x: 520, y: 320 },
  ],
  nodes: [
    { id: "Java", center: "APIs", x: 140, y: 190 },
    { id: "Spring Boot", center: "APIs", x: 230, y: 90 },
    { id: "Spring Security", center: "APIs", x: 180, y: 80 },
    { id: "Hibernate", center: "APIs", x: 260, y: 150 },
    { id: "Node.js", center: "APIs", x: 80, y: 170 },
    { id: "Express", center: "APIs", x: 60, y: 100 },
    { id: "FastAPI", center: "APIs", x: 90, y: 110 },
    { id: "PostgreSQL", center: "Data", x: 470, y: 160 },
    { id: "MongoDB", center: "Data", x: 560, y: 140 },
    { id: "Redis", center: "Data", x: 520, y: 30 },
    { id: "MySQL", center: "Data", x: 600, y: 80 },
    { id: "DynamoDB", center: "Data", x: 610, y: 140 },
    { id: "Kafka", center: "Data", x: 430, y: 40 },
    { id: "RabbitMQ", center: "Data", x: 640, y: 30 },
    { id: "Docker", center: "Infra", x: 720, y: 110 },
    { id: "Terraform", center: "Infra", x: 830, y: 180 },
    { id: "Jenkins", center: "Infra", x: 720, y: 250 },
    { id: "Kubernetes", center: "Infra", x: 820, y: 110 },
    { id: "AWS", center: "Infra", x: 800, y: 240 },
    { id: "Azure", center: "Infra", x: 880, y: 210 },
    { id: "Git", center: "Infra", x: 760, y: 300 },
    { id: "React", center: "Frontend", x: 470, y: 380 },
    { id: "Next.js", center: "Frontend", x: 440, y: 330 },
    { id: "Tailwind", center: "Frontend", x: 560, y: 360 },
    { id: "Vite", center: "Frontend", x: 610, y: 420 },
  ],
  edges: [
    ["Java", "Spring Boot"],
    ["Java", "Hibernate"],
    ["Spring Boot", "Spring Security"],
    ["Spring Boot", "PostgreSQL"],
    ["MongoDB", "Redis"],
    ["Node.js", "Express"],
    ["Express", "MongoDB"],
    ["Docker", "Terraform"],
    ["Docker", "Jenkins"],
    ["Docker", "Kubernetes"],
    ["Kubernetes", "AWS"],
    ["AWS", "Terraform"],
    ["Azure", "Terraform"],
    ["React", "Vite"],
    ["React", "Tailwind"],
    ["PostgreSQL", "Redis"],
    ["MySQL", "Java"],
    ["Kafka", "Java"],
    ["RabbitMQ", "Java"],
    ["Next.js", "React"],
  ],
};

const SIZE = { w: 900, h: 480 };

function Dot({ x, y, r = 2, o = 0.2 }) {
  return <circle cx={x} cy={y} r={r} fill={`rgba(0,0,0,${o})`} />;
}

export default function SkillsConstellation({ mode = 'combined' }) {
  const { role } = useRole();
  // compute data based on mode; combined is curated subset to avoid clutter
  const COMBINED = useMemo(() => ({
    centers: [
      { id: "Modeling", x: 160, y: 140 },
      { id: "Retrieval", x: 430, y: 90 },
      { id: "Serving", x: 750, y: 150 },
      { id: "APIs", x: 200, y: 240 },
      { id: "Data", x: 520, y: 260 },
      { id: "Infra", x: 760, y: 260 },
      { id: "Frontend", x: 520, y: 380 },
    ],
    nodes: [
      // ML subset
      { id: "Python", center: "Modeling", x: 120, y: 200 },
      { id: "PyTorch", center: "Modeling", x: 210, y: 110 },
      { id: "Transformers", center: "Modeling", x: 165, y: 70 },
      { id: "scikit-learn", center: "Modeling", x: 240, y: 85 },
      { id: "XGBoost", center: "Modeling", x: 250, y: 145 },
      { id: "LangChain", center: "Retrieval", x: 450, y: 170 },
      { id: "FAISS", center: "Retrieval", x: 410, y: 40 },
      { id: "Pinecone", center: "Retrieval", x: 560, y: 70 },
      { id: "FastAPI", center: "Serving", x: 740, y: 100 },
      { id: "vLLM", center: "Serving", x: 840, y: 160 },
      // Backend subset
      { id: "Java", center: "APIs", x: 140, y: 290 },
      { id: "Spring Boot", center: "APIs", x: 240, y: 230 },
      { id: "Node.js", center: "APIs", x: 85, y: 260 },
      { id: "PostgreSQL", center: "Data", x: 470, y: 320 },
      { id: "MongoDB", center: "Data", x: 560, y: 320 },
      { id: "Redis", center: "Data", x: 520, y: 210 },
      { id: "Docker", center: "Infra", x: 720, y: 210 },
      { id: "Kubernetes", center: "Infra", x: 820, y: 210 },
      { id: "Terraform", center: "Infra", x: 830, y: 280 },
      { id: "React", center: "Frontend", x: 470, y: 430 },
      { id: "Next.js", center: "Frontend", x: 440, y: 350 },
      { id: "Tailwind", center: "Frontend", x: 560, y: 360 },
    ],
    edges: [
      ["Python","PyTorch"], ["Python","scikit-learn"], ["scikit-learn","XGBoost"],
      ["LangChain","FAISS"], ["LangChain","Pinecone"], ["FastAPI","vLLM"],
      ["APIs","FastAPI"], ["Infra","vLLM"],
      ["Java","Spring Boot"], ["Node.js","PostgreSQL"], ["PostgreSQL","Redis"],
      ["Docker","Kubernetes"], ["Docker","Terraform"], ["React","Next.js"], ["React","Tailwind"],
    ],
  }), []);

  const data = mode === 'ML' ? ML : mode === 'Backend' ? BE : COMBINED;
  const [active, setActive] = useState(null);
  const wrap = useRef(null);

  // Map skill -> logo slug in /public/logos/<slug>.svg
  // Prefer user's color logos in public/svg_color_logos, then fall back to Devicon classes.
  const COLOR = useMemo(() => ({
    // color set present under svg_color_logos/svg_color_logos
    Python: 'svg_color_logos/svg_color_logos/python.svg',
    'PyTorch': 'svg_color_logos/svg_color_logos/pytorch-icon.svg',
    FastAPI: 'svg_color_logos/svg_color_logos/fastapi.svg',
    HuggingFace: 'svg_color_logos/svg_color_logos/huggingface.svg',
    Jenkins: 'svg_color_logos/svg_color_logos/jenkins.svg',
    PostgreSQL: 'svg_color_logos/svg_color_logos/postgresql.svg',
    'C++': 'svg_color_logos/svg_color_logos/cplusplus.svg',
    React: 'svg_color_logos/svg_color_logos/react.svg',
    Redis: 'svg_color_logos/svg_color_logos/redis.svg',
    Tailwind: 'svg_color_logos/svg_color_logos/tailwindcss.svg',
    Vite: 'svg_color_logos/svg_color_logos/vite.svg',
    MLflow: 'svg_color_logos/svg_color_logos/MLflow.svg',
    Pinecone: 'svg_color_logos/svg_color_logos/Pinecone.png',
    'vLLM': 'svg_color_logos/svg_color_logos/vllm-color.svg',
    ZenML: 'svg_color_logos/svg_color_logos/zenml.jpeg',
    // Color logos added by user
    Airflow: 'svg_color_logos/svg_color_logos/Airflow.svg',
    FAISS: 'svg_color_logos/svg_color_logos/FIASS.png',
    'gRPC': 'svg_color_logos/svg_color_logos/Grpc.svg',
    Hibernate: 'svg_color_logos/svg_color_logos/Hibernate.svg',
    NumPy: 'svg_color_logos/svg_color_logos/numpy.png',
    Pandas: 'svg_color_logos/svg_color_logos/pandas.png',
    'scikit-learn': 'svg_color_logos/svg_color_logos/sk-learn.png',
    RabbitMQ: 'svg_color_logos/svg_color_logos/Rabbitmq.svg',
    // Use HuggingFace logo for Transformers
    Transformers: 'svg_color_logos/svg_color_logos/huggingface.svg',
    // monochrome fallbacks located in svg_color_logos/svg_logos
    Docker: 'svg_color_logos/svg_color_logos/docker-mark-blue.svg',
    MongoDB: 'svg_color_logos/svg_logos/mongodb.svg',
    'Spring Boot': 'svg_color_logos/svg_logos/spring.svg',
    Terraform: 'svg_color_logos/svg_logos/terraform.svg',
    LangChain: 'svg_color_logos/svg_color_logos/langchain-color.svg',
  }), []);
  const LOGO = useMemo(() => ({
    // values are Devicon class names (monochrome); leave null if unavailable
    Python: 'devicon-python-plain',
    'PyTorch': 'devicon-pytorch-original',
    'HuggingFace': 'devicon-huggingface-plain',
    'LangChain': null,
    RAG: null,
    FAISS: null,
    Pinecone: null,
    FastAPI: 'devicon-fastapi-plain',
    vLLM: null,
    gRPC: null,
    MLflow: 'devicon-mlflow-plain',
    ZenML: null,
    'C++': 'devicon-cplusplus-plain',
    'scikit-learn': 'devicon-scikitlearn-plain',
    XGBoost: null,
    'Node.js': 'devicon-nodejs-plain',
    Express: 'devicon-express-original',
    'Next.js': 'devicon-nextjs-original',
    MySQL: 'devicon-mysql-plain',
    DynamoDB: 'devicon-amazonwebservices-plain',
    Kafka: 'devicon-apachekafka-original',
    RabbitMQ: 'devicon-rabbitmq-original',
    Kubernetes: 'devicon-kubernetes-plain',
    AWS: 'devicon-amazonwebservices-plain',
    Azure: 'devicon-azure-plain',
    Git: 'devicon-git-plain',
    Hibernate: 'devicon-hibernate-plain',
    'Spring Security': 'devicon-spring-plain',
    // Backend
    Java: 'devicon-java-plain',
    'Spring Boot': 'devicon-spring-plain',
    PostgreSQL: 'devicon-postgresql-plain',
    MongoDB: 'devicon-mongodb-plain',
    Redis: 'devicon-redis-plain',
    Docker: 'devicon-docker-plain',
    Terraform: 'devicon-terraform-plain',
    Jenkins: 'devicon-jenkins-plain',
    React: 'devicon-react-original',
    Tailwind: 'devicon-tailwindcss-plain',
    Vite: 'devicon-vitejs-plain',
  }), []);

  const onMove = (e) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrap.current.style.setProperty("--tx", `${x * 8}px`);
    wrap.current.style.setProperty("--ty", `${y * 6}px`);
  };

  const click = (skill) => {
    window.dispatchEvent(new CustomEvent("skill:filter", { detail: skill }));
    const el = document.querySelector('#portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const bgStars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push({ x: Math.random() * SIZE.w, y: Math.random() * SIZE.h, r: Math.random() * 1 + 0.3, o: 0.06 });
    }
    return arr;
  }, []);

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={() => { if (wrap.current){ wrap.current.style.setProperty('--tx','0px'); wrap.current.style.setProperty('--ty','0px'); }}}
      className="relative w-full rounded-[12px] border border-border bg-card p-4"
      style={{ overflow: 'hidden' }}
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="text-sm font-semibold text-foreground">{mode === 'combined' ? 'Combined' : mode} Map</div>
      </div>

      <svg viewBox={`0 0 ${SIZE.w} ${SIZE.h}`} className="w-full h-[420px] md:h-[480px]">
        {/* gradient wash */}
        <defs>
          <linearGradient id="edgeActive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={THEME.accent} stopOpacity="0.65" />
            <stop offset="100%" stopColor={THEME.accent} stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={THEME.haloInner} stopOpacity="0.10" />
            <stop offset="100%" stopColor={THEME.haloOuter} stopOpacity="0" />
          </radialGradient>
          {/* soft glow to lift edges on dark backgrounds */}
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="spokeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* soft background stars */}
        <g style={{ transform: 'translate(var(--tx,0), var(--ty,0))' }}>
          {bgStars.map((s, i) => (
            <Dot key={i} x={s.x} y={s.y} r={s.r} o={s.o} />
          ))}
        </g>

        {/* hub -> node spokes */}
        <g stroke={THEME.spokeNeutral} fill="none" strokeLinecap="round"
           style={{
             opacity: 'var(--graph-spoke-opacity)',
             mixBlendMode: 'var(--graph-blend)',
             filter: 'var(--graph-spoke-filter)',
             strokeWidth: 'var(--graph-spoke-w)'
           }}>
          {data.nodes.map((n, i) => {
            const c = data.centers.find((x) => x.id === n.center);
            if (!c) return null;
            const on = !active || active === n.id || active === n.center;
            const mx = (c.x + n.x) / 2;
            const my = (c.y + n.y) / 2;
            const dx = n.x - c.x; const dy = n.y - c.y;
            const len = Math.hypot(dx, dy) || 1;
            const px = -dy / len; const py = dx / len; // perpendicular
            const bend = 10; // curvature amount
            const cx1 = mx + px * bend; const cy1 = my + py * bend;
            const d = `M ${c.x} ${c.y} Q ${cx1} ${cy1} ${n.x} ${n.y}`;
            const stroke = on ? "url(#edgeActive)" : THEME.spokeNeutral;
            const sw = on ? 'calc(var(--graph-spoke-w) + 0.2)' : 'var(--graph-spoke-w)';
            const op = on ? 'var(--graph-spoke-active-opacity)' : 'var(--graph-spoke-inactive-opacity)';
            return <path key={`l-${i}`} d={d} stroke={stroke} strokeWidth={sw} opacity={op} />;
          })}
        </g>

        {/* curated cross-links forming a readable graph */}
        <g stroke={THEME.edgeNeutral} strokeLinecap="round"
           style={{
             opacity: 'var(--graph-edge-opacity)',
             mixBlendMode: 'var(--graph-blend)',
             filter: 'var(--graph-edge-filter)',
             strokeWidth: 'var(--graph-edge-w)'
           }}>
          {data.edges.map(([a,b], i) => {
            const A = data.nodes.find(n => n.id === a) || data.centers.find(c => c.id === a);
            const B = data.nodes.find(n => n.id === b) || data.centers.find(c => c.id === b);
            if (!A || !B) return null;
            const on = !active || active === a || active === b;
            const mx = (A.x + B.x) / 2;
            const my = (A.y + B.y) / 2;
            const dx = B.x - A.x; const dy = B.y - A.y;
            const len = Math.hypot(dx, dy) || 1;
            const px = -dy / len; const py = dx / len;
            const bend = 6; // lighter curve for cross links
            const cx1 = mx + px * bend; const cy1 = my + py * bend;
            const d = `M ${A.x} ${A.y} Q ${cx1} ${cy1} ${B.x} ${B.y}`;
            const sw = on ? 'calc(var(--graph-edge-w) + 0.2)' : 'var(--graph-edge-w)';
            const op = on ? 'var(--graph-edge-active-opacity)' : 'var(--graph-edge-inactive-opacity)';
            return <path key={`e-${i}`} d={d} stroke={on ? "url(#edgeActive)" : THEME.edgeNeutral} opacity={op} strokeWidth={sw} />
          })}
        </g>

        {/* centers with designer-friendly labels */}
        <g>
          {data.centers.map((c) => (
            <g key={c.id} onMouseEnter={() => setActive(c.id)} onMouseLeave={() => setActive(null)}>
              <circle cx={c.x} cy={c.y} r={24} fill="url(#hubHalo)" />
              <circle cx={c.x} cy={c.y} r={6} fill={THEME.hubCore} />
              <text x={c.x + 12} y={c.y + 4} fontSize="12" fill={THEME.text} fontWeight="700">{CENTER_LABELS[c.id] || c.id}</text>
            </g>
          ))}
        </g>

        {/* nodes */}
        <g>
          {data.nodes.map((n) => {
            const colorPath = COLOR[n.id] ? `${import.meta.env.BASE_URL}${COLOR[n.id]}` : null;
            const klass = (!colorPath) ? (LOGO[n.id] || null) : null;
            const size = 22;
            return (
              <g key={n.id}
                 onMouseEnter={() => setActive(n.id)} onMouseLeave={() => setActive(null)}
                 onClick={() => click(n.id)} style={{ cursor: 'pointer' }}>
                {colorPath ? (
                  <>
                    <rect x={n.x - size/2 - 2} y={n.y - size/2 - 2} width={size + 4} height={size + 4} rx="6" ry="6" fill="var(--card)" stroke="var(--border)" />
                    <image href={colorPath} x={n.x - size/2} y={n.y - size/2} width={size} height={size} />
                  </>
                ) : klass ? (
                  <foreignObject x={n.x - size/2 - 2} y={n.y - size/2 - 2} width={size + 4} height={size + 4}>
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="devicon-tile"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', height: '100%', background: 'var(--card)',
                        border: '1px solid var(--border)', borderRadius: 6, color: 'var(--foreground)'
                      }}
                    >
                      <i className={klass} style={{ fontSize: `${size - 2}px`, lineHeight: 1 }} />
                    </div>
                  </foreignObject>
                ) : (
                  <circle cx={n.x} cy={n.y} r={7} fill={active === n.id ? THEME.accent : 'var(--muted-foreground)'} />
                )}
                <text
                  x={n.x + 13}
                  y={n.y + 4}
                  fontSize="10.5"
                  fill={THEME.text}
                  style={{ opacity: (active && (active === n.id || active === n.center)) ? 1 : 0, transition: 'opacity .15s', pointerEvents: 'none' }}
                >
                  {n.id}
                </text>
              </g>
            );
          })}
        </g>

      </svg>

      <div className="mt-2 text-xs text-muted-foreground">Hover to explore; click a skill to filter case studies.</div>
    </div>
  );
}
