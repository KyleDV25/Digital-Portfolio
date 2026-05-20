import Image from "next/image";
import { ReactNode } from "react";

type BackgroundType = "video" | "image" | "color" | "pattern";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  background?: {
    type: BackgroundType;
    src?: string; // for video or image
    color?: string; // for color background
    patternColor?: string; // for pattern background (default: volt)
  };
  accent?: "volt" | "plasma" | "ice" | "blood";
  children?: ReactNode;
};

const accentColors = {
  volt: "#CAFF00",
  plasma: "#BF00FF",
  ice: "#00FFEE",
  blood: "#FF0035",
};

export function PageHero({ title, subtitle, eyebrow, background, accent = "volt", children }: Props) {
  const bg = background || { type: "pattern" as const, patternColor: accentColors[accent] };

  return (
    <section
      className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      {/* Background Layer */}
      {bg.type === "video" && bg.src && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bg.src} />
          </video>
          <div className="absolute inset-0 bg-void/60" />
        </div>
      )}

      {bg.type === "image" && bg.src && (
        <div className="absolute inset-0">
          <Image src={bg.src} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-void/60" />
        </div>
      )}

      {bg.type === "color" && bg.color && (
        <div className="absolute inset-0" style={{ backgroundColor: bg.color }} />
      )}

      {bg.type === "pattern" && (
        <div className="absolute inset-0 bg-void">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${bg.patternColor || accentColors[accent]} 0, ${bg.patternColor || accentColors[accent]} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container-punk pb-16">
        {eyebrow && <p className="section-eyebrow mb-8">{eyebrow}</p>}
        <h1 className="font-display text-[clamp(4rem,14vw,17rem)] leading-none tracking-tightest text-chalk uppercase block mb-4">
          {title}
        </h1>
        {subtitle && (
          <h2 className="font-display text-[clamp(2rem,6vw,8rem)] leading-none tracking-tightest text-stroke-paper uppercase block">
            {subtitle}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
