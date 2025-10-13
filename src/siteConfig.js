export default {
  // Legacy ultra-compact landing (hides gradient hero). Keep off.
  compact: false,
  // Keep gradient hero but reduce spacing/font sizes.
  heroDense: true,
  // Make About section smaller and static (no scroll-expand).
  aboutCompact: true,
  // Optional Calendly booking link. Example: 'https://calendly.com/your-handle/intro-call'
  calendlyUrl: 'https://calendly.com/mahammadiqbal1304/30min',
  // Friendly label for Calendly buttons (e.g., 'Quick chat', 'Let’s chat')
  calendlyLabel: 'Quick chat',
  // Impact bar (customize later)
  highlights: [
    { label: '+15% Retrieval MRR', href: '#portfolio' },
    { label: '95% Data Accuracy', href: '#portfolio' },
    { label: '200+ Users Served', href: '#portfolio' },
    { label: '−40% DB Load', href: '#experience' },
  ],
  // Case study top-level tags (maps to underlying skills; easy to change later)
  caseStudyTags: [
    { label: 'LLM', match: ['Llama', 'Llama‑3', 'DPO', 'PEFT', 'QLoRA', 'PyTorch'] },
    { label: 'RAG', match: ['RAG', 'FAISS', 'Pinecone', 'Retrieval'] },
    { label: 'Backend', match: ['FastAPI', 'Java', 'Spring', 'API', 'Redis'] },
    { label: 'MLOps', match: ['MLflow', 'DVC', 'Airflow', 'CI/CD', 'ZenML'] },
  ],
  // Substack highlights section
  substack: {
    feedUrl: 'https://mlwithiqbal.substack.com/feed', // e.g., 'https://yourname.substack.com/feed'
    home: 'https://mlwithiqbal.substack.com/',
    maxPosts: 3,
    title: 'Where I Think Out Loud',
    tagline: 'I document what I learn while building — experiments, design notes, and the philosophy of iteration.',
    cta: { label: 'Read more on Substack', href: '' },
  },
  // Typography configuration (designer-led defaults)
  fonts: {
    mode: 'web', // 'web' | 'system'
    // Primary body/UI font
    sans: {
      family: 'Inter',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap',
      fallback: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
    },
    // Expressive headings (more distinctive so you can see the change)
    display: {
      family: 'Space Grotesk',
      url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500..700&display=swap',
      fallback: "var(--font-sans)",
    },
    // Code/monospace
    mono: {
      family: 'JetBrains Mono',
      url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap',
      fallback: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  },
  // Global visuals configuration
  visuals: {
    project: {
      // Figure/container sizing for project visuals (Tailwind classes)
      // Common width presets:
      // - Narrow:  'max-w-md'
      // - Medium:  'max-w-lg'
      // - Large:   'max-w-xl'
      // - XL:      'max-w-2xl'
      // - 3XL:     'max-w-3xl'
      // Pair with responsive variants, e.g., 'max-w-xl md:max-w-2xl'
      // Centering: add 'mx-auto'
      // Example combos:
      // - 'max-w-lg mx-auto'
      // - 'max-w-xl md:max-w-2xl mx-auto'
      // - 'max-w-2xl md:max-w-3xl mx-auto'
      figureSizeClass: 'max-w-lg mx-auto',

      // Image sizing & fit for project visuals (Tailwind classes)
      // Height presets (no crop when paired with 'object-contain'):
      // - Smaller:  'max-h-56'
      // - Default:  'max-h-64'
      // - Taller:   'max-h-72'
      // - Tall:     'max-h-80'
      // - X‑Tall:   'max-h-96'
      // Arbitrary sizes also work, e.g., 'max-h-[28rem]'
      // Fit mode:
      // - 'object-contain' to letterbox (no cropping)
      // - 'object-cover' to fill and crop
      // Example combos:
      // - 'max-h-64 object-contain'
      // - 'max-h-80 md:max-h-[28rem] object-contain'
      // - 'max-h-64 object-cover'
      imgSizeClass: 'max-h-56 md:max-h-80 object-contain',
    },
  },
};
