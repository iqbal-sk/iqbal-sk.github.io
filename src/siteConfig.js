// Single source of behavioral config. Visual tokens live in DESIGN.md / index.css.
export default {
  // Optional Calendly booking link (rendered as a quiet mono link, not a button)
  calendlyUrl: 'https://calendly.com/mahammadiqbal1304/30min',
  calendlyLabel: 'schedule.sh',

  // Substack section
  substack: {
    feedUrl: 'https://hellotensor.substack.com/feed',
    home: 'https://hellotensor.substack.com/',
    maxPosts: 3,
    title: 'Where I think out loud',
    tagline: 'Notes from building — experiments, design decisions, and the philosophy of iteration.',
  },

  // Identity / hero copy (Approach A — austere)
  identity: {
    name: 'Iqbal Shaik',
    short: 'Iqbal',
    pitch: [
      'Currently at Haiva, building ',
      { strong: 'configurable agent orchestration' },
      ' — the runtime behind Etora, a research workspace where biomedical teams read literature, analyze their own data, and explore the knowledge graph in one conversation, ',
      { strong: 'in beta with a Yale lab' },
      ', and the voice-agent platform behind live phone conversations. On the side, Microscale Academy, a field journal for small language models.',
    ],
    email: 'mahammad@buffalo.edu',
    links: {
      microscale: 'https://microscale.academy',
      etora: 'https://etora.ai',
      substack: 'https://hellotensor.substack.com/',
      github: 'https://github.com/iqbal-sk',
      linkedin: 'https://www.linkedin.com/in/iqbal-sk/',
    },
  },

  // Typography — three voices, three roles. See DESIGN.md.
  fonts: {
    mode: 'web',
    sans: {
      family: 'IBM Plex Sans',
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap',
      fallback: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    display: {
      family: 'EB Garamond',
      url: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
      fallback: "ui-serif, Georgia, 'Times New Roman', serif",
    },
    mono: {
      family: 'IBM Plex Mono',
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
      fallback: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  },

  // Skill graph tags (used by ExperienceProjects → Skills filter wiring)
  caseStudyTags: [
    { label: 'LLM',     match: ['Llama', 'Llama-3', 'Llama‑3', 'DPO', 'PEFT', 'QLoRA', 'PyTorch'] },
    { label: 'RAG',     match: ['RAG', 'FAISS', 'Pinecone', 'Retrieval', 'Semantic Search'] },
    { label: 'Backend', match: ['FastAPI', 'Java', 'Spring', 'Spring Boot', 'API', 'Redis', 'SSE'] },
    { label: 'MLOps',   match: ['MLflow', 'DVC', 'Airflow', 'CI/CD', 'ZenML', 'Docker'] },
  ],

  // Project visual sizing
  visuals: {
    project: {
      figureSizeClass: 'max-w-lg',
      imgSizeClass: 'max-h-56 md:max-h-80 object-contain',
    },
  },
};
