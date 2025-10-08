import React from "react";

// Compact education summary for Recruiter Snapshot
const educationData = [
  {
    degree: "M.S. in Artificial Intelligence",
    school: "University at Buffalo (SUNY)",
    date: "Aug 2023 – Jan 2025",
    gpa: "CGPA 3.97",
    logo: `${import.meta.env.BASE_URL}ub.png`,
  },
  {
    degree: "B.Tech in Computer Science",
    school: "Jawaharlal Nehru Technological University, India",
    date: "Aug 2016 – May 2020",
    logo: `${import.meta.env.BASE_URL}JNTUK.png`,
  },
];

export default function EducationInline() {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Education</div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {educationData.map((e, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-border bg-secondary px-3 py-2 w-full"
          >
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Left: logo + degree */}
              <div className="col-span-12 sm:col-span-6 flex items-center gap-2 min-w-0">
                {e.logo && (
                  <img
                    src={e.logo}
                    alt={`${e.school} logo`}
                    className="w-7 h-7 rounded-md object-contain bg-background border border-border p-0.5"
                    loading="lazy"
                  />
                )}
                <div className="text-[12.5px] font-semibold text-foreground leading-snug break-words">
                  {e.degree}
                </div>
              </div>
              {/* Right: school (line 1) + date/GPA (line 2) */}
              <div className="col-span-12 sm:col-span-6 text-right">
                <div className="text-[12px] text-muted-foreground leading-tight truncate" title={e.school}>{e.school}</div>
                <div className="text-[11px] text-muted-foreground leading-tight whitespace-nowrap">{e.date}{e.gpa ? ` · ${e.gpa}` : ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="#education" className="mt-2 inline-flex text-xs text-primary hover:underline">
        View details
      </a>
    </div>
  );
}
