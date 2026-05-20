import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/TextReveal";
import { MarqueeBar } from "@/components/MarqueeBar";
import { MagneticButton } from "@/components/MagneticButton";
import { GlitchText } from "@/components/GlitchText";
import { PageHero } from "@/components/PageHero";
import { renderMarkdown } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import aboutPageConfig from "@/content/pages/about.json";

export const metadata: Metadata = {
  title: "About",
  description: "About Kyle De Vares, creative digital artist and web builder.",
};

export default function AboutPage() {
  const pageConfig = aboutPageConfig;

  return (
    <>
      <PageHero
        title={pageConfig.hero.title || "CREATIVE"}
        subtitle={pageConfig.hero.subtitle || "SYSTEMS"}
        eyebrow={pageConfig.hero.eyebrow || "About Kyle"}
        background={pageConfig.hero.backgroundType === "pattern" ? { type: "pattern", patternColor: pageConfig.hero.background } : undefined}
        accent={(pageConfig.hero.accent as "volt" | "plasma" | "ice" | "blood") || "volt"}
      >
        <div className="hr-punk container-punk pb-8">Digital Artist - Web Builder - Visual Storyteller</div>
      </PageHero>

      <MarqueeBar
        items={pageConfig.marqueeItems || ["Digital Art", "Branding", "Illustration", "Web", "Commissions", "Queer Creativity", "Community"]}
        accent="plasma"
        direction="right"
      />

      <section className="section-padding bg-ink border-y border-smoke">
        <div className="container-punk grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="relative aspect-[2/3] overflow-hidden max-w-[500px]">
            <Image
              src={pageConfig.profileImage ? (pageConfig.profileImage.startsWith('/') ? pageConfig.profileImage : `/assets/uploads/${pageConfig.profileImage}`) : "/assets/uploads/redesign.png"}
              alt="Kyle De Vares visual work"
              fill
              className="object-cover grayscale-[30%] contrast-110"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-plasma/5 mix-blend-color" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-label text-[0.6rem] text-ghost tracking-widest uppercase mb-1">Studio</p>
              <p className="font-display text-3xl text-volt leading-none uppercase">Kyle De Vares</p>
            </div>
          </div>

          <div className="lg:pt-4">
            <TextReveal
              as="h2"
              split="lines"
              className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-tightest text-chalk uppercase mb-10"
            >
              Bold visuals with code behind them.
            </TextReveal>

            <MarkdownRenderer content={renderMarkdown(pageConfig.bio?.slice(0, 4).map((b: any) => b.text).join("\n\n") || "")} className="mb-12" />

            <div className="flex flex-wrap gap-2 mb-10">
              {pageConfig.tags?.map((tag) => (
                <span key={tag} className="tag tag-volt">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <MagneticButton>
                <Link href="/portfolio" className="btn-punk">
                  <span>See Work</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contact" className="btn-punk btn-punk-plasma">
                  <span>Say Hello</span>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-void">
        <div className="container-punk">
          <p className="section-eyebrow mb-10">Disciplines</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageConfig.disciplines?.map(({ label, level }) => (
              <div key={label} className="border-b border-smoke pb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-condensed font-bold text-xl text-chalk uppercase tracking-wide">{label}</span>
                  <span className="font-label text-[0.62rem] text-volt tracking-widest">{level}%</span>
                </div>
                <div className="h-px bg-smoke relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-volt" style={{ width: `${level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink border-t border-smoke">
        <div className="container-punk">
          <p className="section-eyebrow mb-12">Timeline</p>
          <TextReveal
            as="h2"
            split="words"
            className="font-display text-fluid-xl leading-none tracking-tightest text-chalk uppercase mb-16"
          >
            The Journey So Far
          </TextReveal>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-smoke hidden lg:block" />
            {pageConfig.timeline?.map(({ year, event, detail }) => (
              <div
                key={event}
                className="group grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 py-8 border-b border-smoke hover:bg-ash/50 transition-colors duration-300 lg:pl-8"
              >
                <span className="font-display text-4xl text-volt leading-none">{year}</span>
                <div>
                  <h3 className="font-condensed font-bold text-xl text-chalk uppercase tracking-wide mb-2 group-hover:text-volt transition-colors">
                    {event}
                  </h3>
                  <p className="font-mono text-sm text-ghost leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
