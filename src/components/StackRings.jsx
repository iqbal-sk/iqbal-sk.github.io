import React from "react";

const DOTS = [
  { label: "Modeling", r: 70, angle: -10 },
  { label: "Retrieval", r: 55, angle: 40 },
  { label: "Serving", r: 40, angle: 100 },
  { label: "MLOps", r: 25, angle: 160 },
];

export default function StackRings() {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0">
        {[70, 55, 40, 25].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={i===0?2:1} />
        ))}
        {DOTS.map((d) => {
          const rad = (Math.PI / 180) * d.angle;
          const x = cx + d.r * Math.cos(rad);
          const y = cy + d.r * Math.sin(rad);
          return <circle key={d.label} cx={x} cy={y} r={4} fill="#64748b" />;
        })}
      </svg>
      <ul className="text-sm text-gray-700">
        {DOTS.map((d) => (
          <li key={d.label} className="mb-1 last:mb-0">{d.label}</li>
        ))}
      </ul>
    </div>
  );
}

