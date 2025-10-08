import React from "react";
import imageUrl from "../assets/self-img.png";

const CompactAbout = () => {
  return (
    <section id="about" className="py-10">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="rounded-2xl border border-white/60 bg-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_1px_2px_rgba(15,23,42,0.03),0_12px_40px_-12px_rgba(15,23,42,0.18)] supports-[backdrop-filter]:backdrop-blur-2xl p-5">
          <div className="flex items-start gap-4">
            <img
              src={imageUrl}
              alt="Iqbal's picture"
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-900">About Me</h2>
              <p className="mt-1 text-gray-700 text-sm">
                I’m Iqbal — I build practical ML/AI systems and reliable software with a focus on clear value, strong engineering, and measurable impact.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Recent work: LLM fine‑tuning, agentic systems, semantic search</li>
                <li>Backends: FastAPI, Spring Boot • Data: MongoDB, Postgres, Redis</li>
                <li>MLOps: ZenML, MLflow, Airflow, Docker, CI/CD</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/iqbal-sk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/iqbal-sk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactAbout;

