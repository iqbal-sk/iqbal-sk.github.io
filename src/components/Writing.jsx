import React from "react";

export default function Writing() {
  return (
    <section className="pt-6 pb-8">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <h3 className="text-xl font-semibold text-[#33373f] mb-3">Writing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="rounded-2xl border border-white/60 bg-white/55 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_1px_2px_rgba(15,23,42,0.03),0_12px_40px_-12px_rgba(15,23,42,0.18)] supports-[backdrop-filter]:backdrop-blur-2xl">
            <h4 className="text-lg font-semibold text-gray-900">How I debug production models</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Start with a failing slice: reproduce with a frozen seed + input logs.</li>
              <li>Establish a baseline: add unit eval + golden examples; watch drift.</li>
              <li>Trace data → embedding → retrieval → model; measure at each hop.</li>
              <li>Change one thing: prompt/tool/threshold/feature at a time.</li>
              <li>Close the loop: add regression checks and dashboards to prevent re‑occurrence.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-white/60 bg-white/55 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_1px_2px_rgba(15,23,42,0.03),0_12px_40px_-12px_rgba(15,23,42,0.18)] supports-[backdrop-filter]:backdrop-blur-2xl">
            <h4 className="text-lg font-semibold text-gray-900">When RAG beats fine‑tuning</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Your ground truth evolves weekly: RAG updates faster than model weights.</li>
              <li>Domain knowledge is long‑tail: retrieval narrows the context sharply.</li>
              <li>Latency/cost targets allow caching: reuse chunks + answers effectively.</li>
              <li>Compliance/traceability matters: citations and provenance come for free.</li>
              <li>Blend: fine‑tune for style/tool use; RAG for facts and recall.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

