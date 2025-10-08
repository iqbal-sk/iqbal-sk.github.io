import React, { useEffect, useRef, useState } from "react";

// Tiny crossfade wrapper without external deps.
// Renders outgoing content underneath while fading in the incoming content.
export default function Crossfade({ id, duration = 280, className = "", children }) {
  const [prev, setPrev] = useState(null);
  const [curr, setCurr] = useState(children);
  const [anim, setAnim] = useState(false);
  const lastId = useRef(id);

  useEffect(() => {
    if (id === lastId.current) return;
    lastId.current = id;
    setPrev(curr);
    setCurr(children);
    setAnim(true);
    const t = setTimeout(() => setAnim(false), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, children]);

  return (
    <div className={"relative " + className} style={{ minHeight: 10 }}>
      {prev && anim && (
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity"
          style={{ opacity: 0.0 }}
        >
          {prev}
        </div>
      )}
      <div
        key={String(id)}
        className="transition-opacity"
        style={{ opacity: anim ? 0 : 1, transitionDuration: duration + "ms" }}
      >
        {curr}
      </div>
    </div>
  );
}

