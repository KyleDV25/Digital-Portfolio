"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";

interface Props {
  slug: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  tags?: string[];
  accentColor?: "volt" | "plasma" | "ice" | "blood";
  featured?: boolean;
}

const ACCENT: Record<string, string> = {
  volt: "text-volt border-volt",
  plasma: "text-plasma border-plasma",
  ice: "text-ice border-ice",
  blood: "text-blood border-blood",
};

export function ProjectCard({
  slug,
  title,
  category,
  year,
  imageUrl,
  tags = [],
  accentColor = "volt",
  featured = false,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.6, ease: "power2.out" });
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: "power3.out" });
  };

  const handleLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: "power3.in" });
  };

  const accentClass = ACCENT[accentColor];

  return (
    <Link href={`/portfolio/${slug}`} className="block group" data-hover>
      <div
        ref={cardRef}
        className="project-card"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Image */}
        <div className="img-reveal-wrapper" style={{ aspectRatio: featured ? "16/9" : "4/3" }}>
          <Image
            ref={imgRef as React.Ref<HTMLImageElement>}
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-all duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="project-card-overlay" />
        </div>

        {/* Bottom info */}
        <div ref={infoRef} className="p-5 relative">
          {/* Animated underline */}
          <div
            ref={lineRef}
            className={`absolute top-0 left-0 right-0 h-px bg-current ${accentClass} origin-left`}
            style={{ transform: "scaleX(0)" }}
          />

          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display text-[1.6rem] leading-none text-chalk uppercase tracking-tight group-hover:text-volt transition-colors duration-300">
              {title}
            </h3>
            <span className={`font-label text-[0.6rem] tracking-widest uppercase mt-1 shrink-0 ${accentClass}`}>
              {year}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`font-label text-[0.62rem] tracking-widest uppercase border-b pb-0.5 ${accentClass}`}>
              {category}
            </span>
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag text-[0.58rem]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
