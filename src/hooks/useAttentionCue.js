import { useEffect, useRef, useState } from "react";

// Simple once-per-session attention cue with IntersectionObserver.
// Returns {shouldCue, markSeen, inView}.
export default function useAttentionCue(key, opts = {}) {
  const { root = null, rootMargin = "0px", threshold = 0.15 } = opts;
  const [seen, setSeen] = useState(() => sessionStorage.getItem(key) === "1");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => setInView(e.isIntersecting));
    }, { root, rootMargin, threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);

  const markSeen = () => {
    try { sessionStorage.setItem(key, "1"); } catch {}
    setSeen(true);
  };

  return { ref, shouldCue: !seen, markSeen, inView };
}
