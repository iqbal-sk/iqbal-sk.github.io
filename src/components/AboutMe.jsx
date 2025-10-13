"use client";

import { useState, useEffect } from "react";
import CalendlyButton from "./CalendlyButton";
import siteConfig from "../siteConfig";
import { Linkedin as LinkedinIcon } from "lucide-react";
import { Minus, Square, X } from "lucide-react";
// Prefer a public image if provided; fallback to bundled placeholder
const imageUrl = "/profile.jpg";
const AboutMe = ({ compact = false }) => {
  // In compact mode, content should be expanded immediately
  const [isExpanded, setIsExpanded] = useState(compact ? true : false);
  const [showContent, setShowContent] = useState(compact ? true : false);

  // Compact tuning: slightly reduce paddings, gaps, and font sizes
  const sectionPad = compact ? "pt-16 pb-10" : "min-h-screen pt-20";
  const wrapperPad = compact ? "p-4 space-y-4" : "p-6 space-y-6";
  const profileGap = compact ? "gap-4" : "gap-6";
  const paraText = compact
    ? "mb-3 text-[16px] leading-7 text-[#33373f]"
    : "mb-4 text-[18px] leading-7 text-[#33373f]";
  const imgMax = compact ? "max-w-xs" : "max-w-sm";
  const imgWidth = compact ? "w-[80%]" : "w-full";

  useEffect(() => {
    if (compact) return; // no scroll behavior in compact mode
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && !isExpanded) {
        setIsExpanded(true);
        setTimeout(() => setShowContent(true), 300);
      } else if (scrollY <= 100 && isExpanded) {
        setShowContent(false);
        setTimeout(() => setIsExpanded(false), 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded, compact]);

  return (
    <section id="about" className={`${sectionPad} px-4`}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#f8fafc]/90 via-[#e2e8f0]/80 to-[#f1f5f9]/90 backdrop-blur-xl rounded-xl border border-[#cbd5e1]/30 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#f8fafc]/95 via-[#e2e8f0]/90 to-[#cbd5e1]/85 backdrop-blur-sm px-4 py-3 border-b border-[#94a3b8]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Traffic Light Buttons */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group">
                  <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center group">
                  <Minus className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center group">
                  <Square className="w-1.5 h-1.5 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
            {/* Window Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-sm font-medium text-[#94a3b8]">About Me</h1>
            </div>
            <div></div> {/* Spacer for flexbox */}
          </div>

          <div className={`${wrapperPad} bg-gradient-to-br from-[#e8f2ff]/30 via-[#d1e7fe]/20 to-[#c7d2fe]/25`}>
            {/* User Message */}
            <div className="flex justify-end">
              <div className="flex items-start space-x-3 max-w-xs">
                <div className="bg-gradient-to-r from-[#9fb8e3] to-[#b8d4f1] text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg backdrop-blur-sm border border-[#94a3b8]/20">
                  <p className="text-sm font-medium">Tell me about yourself!</p>
                </div>
              </div>
            </div>

            {/* AI Response - Expandable */}
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 w-full">
                <div
                  className={`
                    bg-gradient-to-br from-[#f8fafc]/60 via-[#e2e8f0]/50 to-[#f1f5f9]/60 backdrop-blur-xl rounded-2xl rounded-tl-sm border border-[#cbd5e1]/40 shadow-xl
                    transition-all duration-700 ease-out overflow-hidden
                    ${isExpanded ? "max-w-full" : "max-w-md"}
                  `}
                  style={
                    compact
                      ? undefined
                      : {
                          height: isExpanded ? "auto" : "60px",
                          minHeight: isExpanded ? "400px" : "60px",
                        }
                  }
                >
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      className={`px-4 py-4 transition-opacity duration-500 ${
                        showContent ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f2ff]/8 via-[#d1e7fe]/6 to-[#c7d2fe]/8 pointer-events-none rounded-2xl"></div>

                      <div className="relative z-10 space-y-6">
                        {/* Profile Section */}
                        <div className={`flex flex-col md:flex-row items-center ${profileGap}`}>
                          <div className="md:w-1/2 space-y-4">
                            <div className="space-y-3 text-sm text-[#33373f] leading-relaxed">
                              <p className={"" + paraText}>
                                Hi, I’m Iqbal. I love taking ideas that sound slightly impossible and nudging them into reality with code. I’m happiest when I’m deep in a system — tracing why something works (or doesn’t), connecting small details to big design decisions.
                              </p>
                              <p className={"" + paraText}>
                                I’ve bounced between research, engineering, and a bit of teaching — which taught me that good tech isn’t just about performance; it’s about clarity, empathy, and usefulneess.
                              </p>
                              {/*<p className={"" + paraText}>*/}
                              {/*  If a product makes someone’s day smoother, that’s real impact to me — and the best kind of engineering happens when it feels collaborative, not transactional. I love working on AI and backend systems that make tech a little more human — and if that excites you too, let’s chat.*/}
                              {/*</p>*/}
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                {siteConfig.calendlyUrl && (
                                  <CalendlyButton url={siteConfig.calendlyUrl} label={siteConfig.calendlyLabel || 'Quick chat'} />
                                )}
                                <a
                                  href="https://www.linkedin.com/in/iqbal-sk/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 h-10 rounded-lg px-3 text-sm font-medium text-[#0E1116] bg-white border border-[#cbd5e1] hover:bg-[#f8fafc]"
                                >
                                  <LinkedinIcon className="h-4 w-4" />
                                  Connect on LinkedIn
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="md:w-1/2 flex justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#b8d4f1]/30 via-[#c7d2fe]/20 to-[#9fb8e3]/25 rounded-xl blur-lg"></div>
                              <img
                                src={imageUrl}
                                alt="Iqbal's picture"
                                className={`rounded-[20px] ${imgWidth} ${imgMax} shadow-lg relative z-10 object-cover`}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isExpanded && !compact && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="bg-gradient-to-r from-[#f8fafc]/80 to-[#e2e8f0]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#cbd5e1]/40 shadow-lg">
                <p className="text-xs text-[#94a3b8] font-medium">
                  Scroll down to expand
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
