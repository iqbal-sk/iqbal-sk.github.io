import React from "react";

const CompactHero = () => {
  return (
    <section id="hero" className="pt-20 pb-10">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Iqbal</h1>
          <p className="text-base md:text-lg text-gray-600">
            ML/AI Engineer • Building reliable, user‑focused software
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="/Iqbal-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 rounded-lg px-5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-10 rounded-lg px-5 text-sm font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-50"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactHero;

