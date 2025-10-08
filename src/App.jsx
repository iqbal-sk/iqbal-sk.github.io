import React, { useState } from "react";
import ExperienceProjects from "./components/ExperienceProjects";
import Topbar from "./components/Topbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Education from "./components/Education";
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import siteConfig from "./siteConfig";
import PulseSparkline from "./components/PulseSparkline";
import SubstackHighlights from "./components/SubstackHighlights";
import { RoleProvider } from "./context/RoleContext";

import { Github, Linkedin, Mail } from "lucide-react";

const App = () => {
  const links = [
    {
      href: "https://www.linkedin.com/in/iqbal-sk/",
      icon: Linkedin,
    },
    {
      href: "mailto:mahammad@buffalo.edu",
      icon: Mail,
    },
    {
      href: "https://github.com/iqbal-sk",
      icon: Github,
    },
  ];

  const [openNavigation, setOpenNavigation] = useState(false);

  // Toggle the navigation menu
  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
  };

  // Handle link clicks with smooth scrolling and page refresh for Home
  const handleClick = (e, url) => {
    e.preventDefault();
    if (openNavigation) toggleNavigation();

    // External links
    if (url.startsWith("http")) {
      window.open(url, "_blank");
      return;
    }

    // Home route refresh
    if (url === "/") {
      window.history.pushState(null, "", "/");
      window.location.reload();
      return;
    }

    // In-page anchor targets (e.g. #experience, #portfolio, #about)
    if (url.startsWith("#")) {
      const target = document.querySelector(url);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", url);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      return;
    }

    // Section selectors (like "#contact" already handled above) or other local selectors
    const targetSection = document.querySelector(url);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <RoleProvider>
      <div className="bg-surface text-foreground">
        <Topbar
          handleClick={handleClick}
          openNavigation={openNavigation}
          toggleNavigation={toggleNavigation}
        />
        <Hero dense={siteConfig.heroDense} />
        <AboutMe compact={siteConfig.aboutCompact} links={links} />
        <PulseSparkline days={30} microcopy="30-day pulse: shipped iterations." />
        <ExperienceProjects />
        <SubstackHighlights />
        <Skills />
        <Education />
        {false}
        <Footer links={links} />
      </div>
    </RoleProvider>
  );
};

export default App;
