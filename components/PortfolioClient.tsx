"use client";

import { useMemo, useState } from "react";
import { TextReveal } from "@/components/TextReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { MarqueeBar } from "@/components/MarqueeBar";
import { GlitchText } from "@/components/GlitchText";
import { PageHero } from "@/components/PageHero";
import type { ProjectCardData } from "@/lib/content";
import portfolioPageConfig from "@/content/pages/portfolio.json";

type Props = {
  projects: ProjectCardData[];
};

export function PortfolioClient({ projects }: Props) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category))).filter(Boolean)],
    [projects]
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((project) => project.category === active);
  const pageConfig = portfolioPageConfig;

  return (
    <>
      <PageHero
        title={pageConfig.hero.title || "WORK"}
        eyebrow={pageConfig.hero.eyebrow || "Portfolio"}
        background={pageConfig.hero.backgroundType === "pattern" ? { type: "pattern", patternColor: pageConfig.hero.background } : undefined}
        accent={(pageConfig.hero.accent as "volt" | "plasma" | "ice" | "blood") || "plasma"}
      />

      <section className="bg-void border-b border-smoke">
        <div className="container-punk pb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={[
                "font-label text-[0.68rem] tracking-widest uppercase px-5 py-2.5 border transition-all duration-200 cursor-none",
                active === cat
                  ? "border-volt text-volt bg-volt/10"
                  : "border-smoke text-ghost hover:border-paper hover:text-paper",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
          <span className="font-label text-[0.62rem] text-ghost tracking-widest uppercase self-center ml-auto">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <MarqueeBar items={categories.filter((item) => item !== "All")} accent="plasma" />

      <section className="section-padding bg-void">
        <div className="container-punk">
          {filtered.length === 0 ? (
            <p className="font-mono text-ghost text-center py-20">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              {filtered.map((project, i) => (
                <div key={project.slug} className={i === 0 && active === "All" ? "md:col-span-2 xl:col-span-2" : ""}>
                  <ProjectCard {...project} featured={i === 0 && active === "All"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ink border-t border-smoke section-padding">
        <div className="container-punk">
          <TextReveal
            as="h2"
            split="words"
            className="font-display text-fluid-xl leading-none tracking-tightest text-chalk uppercase mb-6"
          >
            {pageConfig.builtFromRealWork.headline || "Built From Real Work"}
          </TextReveal>
          <p className="font-mono text-sm text-ghost max-w-2xl leading-relaxed">
            {pageConfig.builtFromRealWork.description || "These pieces come from Kyle's existing portfolio archive: design, coding, illustration, community tooling, and visual experiments rebuilt inside the punk visual system."}
          </p>
        </div>
      </section>
    </>
  );
}
