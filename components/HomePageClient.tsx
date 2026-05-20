"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/TextReveal";
import { GlitchText } from "@/components/GlitchText";
import { MarqueeBar } from "@/components/MarqueeBar";
import { ProjectCard } from "@/components/ProjectCard";
import { MagneticButton } from "@/components/MagneticButton";
import type { ProjectCardData, JournalPost, SiteData } from "@/lib/content";
import homePageConfig from "@/content/pages/home.json";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  site: SiteData;
  aboutSummary: string;
  projects: ProjectCardData[];
  posts: JournalPost[];
};

export function HomePageClient({ site, aboutSummary, projects, posts }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const aboutImgRef = useRef<HTMLDivElement>(null);
  const featuredProjects = projects.slice(0, 4);
  const heroImage = featuredProjects[0]?.imageUrl || "/assets/uploads/redesign.png";
  const pageConfig = homePageConfig;

  useEffect(() => {
    const heroImg = heroImgRef.current;
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    const aboutImg = aboutImgRef.current;
    if (aboutImg) {
      gsap.fromTo(
        aboutImg,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: aboutImg, start: "top 75%" },
        }
      );
    }

    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((el) => {
      const target = Number((el as HTMLElement).dataset.count || "0");
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate() {
                el.textContent = Math.floor(this.targets()[0].val).toString();
              },
            }
          );
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-void"
        style={{ paddingTop: "var(--nav-height)" }}
      >
        <div ref={heroImgRef} className="absolute inset-0 scale-110 will-change-transform" aria-hidden="true">
          <Image src={heroImage} alt="" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/35 to-void" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/85 to-transparent" />
        </div>

        <div className="relative z-10 container-punk pb-16 lg:pb-24">
          <div className="section-eyebrow mb-6 opacity-0 animate-[fadeIn_0.6s_1.6s_forwards]">
            Creative Digital Artist
          </div>

          <div className="overflow-hidden mb-4">
            <GlitchText
              as="h1"
              mode="hover"
              className="text-[clamp(4.5rem,14vw,16rem)] leading-none tracking-tightest text-chalk block"
            >
              KYLE
            </GlitchText>
          </div>
          <div className="overflow-hidden mb-10">
            <h1 className="font-display text-[clamp(4.5rem,14vw,16rem)] leading-none tracking-tightest text-stroke-paper block">
              DE VARES
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <p className="font-mono text-ghost text-sm max-w-sm leading-relaxed text-wrap">{site.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link href="/portfolio" className="btn-punk">
                  <span>View Work</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contact" className="btn-punk btn-punk-plasma">
                  <span>Get in Touch</span>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-volt" />
          <span className="font-label text-[0.6rem] text-ghost tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
            Scroll
          </span>
        </div>
      </section>

      <MarqueeBar
        items={["Branding", "Illustration", "Web", "Queer Culture", "Digital Media", "Commissions", "Community"]}
        accent="volt"
      />

      <section className="section-padding bg-ink border-y border-smoke overflow-hidden">
        <div className="container-punk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div ref={aboutImgRef} className="relative aspect-[3/4] overflow-hidden order-2 lg:order-1">
              <Image src={pageConfig.aboutSection.image || "/assets/uploads/redesign.png"} alt="Kyle De Vares design work" fill className="object-cover grayscale contrast-125" />
              <div className="absolute inset-0 bg-plasma/10 mix-blend-color" />
            </div>

            <div className="order-1 lg:order-2">
              <p className="section-eyebrow mb-8">About</p>
              <TextReveal
                as="h2"
                split="lines"
                className="font-display text-[clamp(3rem,7vw,7rem)] leading-none tracking-tightest text-chalk uppercase mb-8"
              >
                {pageConfig.aboutSection.title || "Design, Code, And Loud Visuals."}
              </TextReveal>
              <p className="font-mono text-ghost text-sm leading-relaxed mb-10 text-wrap">{aboutSummary}</p>

              <div className="grid grid-cols-3 gap-6 mb-10 pt-8 border-t border-smoke">
                {pageConfig.aboutSection.stats?.map((stat: any, i: number) => (
                  <div key={stat.label}>
                    <p className="font-display text-5xl text-volt leading-none mb-1">
                      <span data-count={stat.num || projects.length}>0</span>+
                    </p>
                    <p className="font-label text-[0.62rem] text-ghost tracking-widest uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>

              <MagneticButton>
                <Link href="/about" className="btn-punk">
                  <span>Full Story</span>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-void">
        <div className="container-punk">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-14">
            <div>
              <p className="section-eyebrow mb-4">Selected projects</p>
              <TextReveal
                as="h2"
                split="words"
                className="font-display text-fluid-xl text-chalk leading-none tracking-tightest uppercase"
              >
                Recent Work
              </TextReveal>
            </div>
            <MagneticButton>
              <Link href="/portfolio" className="btn-punk shrink-0">
                <span>All Projects</span>
              </Link>
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-void">
        <div className="container-punk">
          <p className="section-eyebrow mb-8">What I do</p>
          <ul className="divide-y divide-smoke" role="list">
            {pageConfig.disciplines?.map((discipline: string, i: number) => (
              <li
                key={discipline}
                className="group flex items-center justify-between py-5 lg:py-7 cursor-default hover:bg-ash transition-colors duration-200 px-0 hover:px-4"
              >
                <span className="font-display text-[clamp(1.8rem,5vw,4.5rem)] text-chalk group-hover:text-volt transition-colors duration-300 leading-none tracking-tightest uppercase">
                  {discipline}
                </span>
                <span className="font-label text-[0.6rem] text-ghost tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  0{i + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-volt py-16 lg:py-20 overflow-hidden relative">
        <div className="container-punk relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="font-label text-void text-[0.65rem] tracking-widest uppercase mb-3">// Contact</p>
              <h2 className="font-display text-[clamp(2.5rem,8vw,8rem)] leading-none tracking-tightest text-void uppercase">
                {pageConfig.contactSection.headline || "Got a vision?"}
              </h2>
            </div>
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-label text-[0.72rem] tracking-widest uppercase px-8 py-4 border border-void text-void hover:bg-void hover:text-volt transition-all duration-300"
              >
                <span>{pageConfig.contactSection.ctaLabel || "Let's Talk"}</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      <section className="section-padding bg-void border-t border-smoke">
        <div className="container-punk">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-eyebrow mb-4">Journal</p>
              <TextReveal
                as="h2"
                split="words"
                className="font-display text-fluid-xl text-chalk leading-none tracking-tightest uppercase"
              >
                {pageConfig.journalSection.title || "Latest Thoughts"}
              </TextReveal>
            </div>
            <MagneticButton>
              <Link href="/blog" className="btn-punk shrink-0">
                <span>{pageConfig.journalSection.ctaLabel || "All Posts"}</span>
              </Link>
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-smoke">
            {posts.slice(0, 3).map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-void p-8 hover:bg-ash transition-colors duration-300">
                <p className={["font-label text-[0.62rem] tracking-widest uppercase mb-4", i === 1 ? "text-plasma" : i === 2 ? "text-ice" : "text-volt"].join(" ")}>
                  {post.tags[0] || "Journal"}
                </p>
                <h3 className="font-display text-[1.6rem] leading-tight text-chalk uppercase group-hover:text-volt transition-colors duration-300 mb-6">
                  {post.title}
                </h3>
                <p className="font-label text-[0.62rem] text-ghost tracking-widest uppercase">{post.date || "Studio note"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
