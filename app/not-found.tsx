"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { GlitchText } from "@/components/GlitchText";

const GLITCH_MESSAGES = [
  "SIGNAL LOST",
  "DATA CORRUPTION",
  "FILE NOT FOUND",
  "TRANSMISSION ERROR",
  "404 VOID",
  "SYSTEM FAILURE",
];

export default function NotFoundPage() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [rects, setRects] = useState<{ top: number; left: number; w: number; h: number; color: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % GLITCH_MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Generate random glitch rectangles
  useEffect(() => {
    const COLORS = ["#CAFF00", "#BF00FF", "#00FFEE", "#FF0035"];
    const generated = Array.from({ length: 8 }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 80,
      w: Math.random() * 40 + 5,
      h: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setRects(generated);
  }, []);

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glitch scanlines decoration */}
      {rects.map((r, i) => (
        <div
          key={i}
          className="absolute opacity-30 pointer-events-none animate-glitch-1"
          style={{
            top: `${r.top}%`,
            left: `${r.left}%`,
            width: `${r.w}vw`,
            height: `${r.h}px`,
            background: r.color,
            animationDelay: `${i * 0.1}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Background huge 404 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display text-[35vw] leading-none tracking-tightest text-chalk/[0.03] uppercase"
        >
          404
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Error code */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-px w-20 bg-blood" />
          <span className="font-label text-[0.65rem] text-blood tracking-widest uppercase">
            Error 404
          </span>
          <div className="h-px w-20 bg-blood" />
        </div>

        {/* Glitching 404 */}
        <div className="mb-6">
          <GlitchText
            as="h1"
            mode="continuous"
            className="text-[clamp(8rem,25vw,22rem)] leading-none tracking-tightest text-chalk uppercase block"
          >
            404
          </GlitchText>
        </div>

        {/* Cycling error message */}
        <p
          key={msgIndex}
          className="font-display text-[clamp(1.5rem,5vw,5rem)] leading-none tracking-widest text-volt uppercase block mb-8 transition-opacity duration-100"
        >
          {GLITCH_MESSAGES[msgIndex]}
        </p>

        <p className="font-mono text-sm text-ghost mb-12 max-w-md mx-auto leading-relaxed">
          The page you were looking for doesn&apos;t exist - or it was swallowed by the void.
          Either way, it&apos;s gone.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton>
            <Link href="/" className="btn-punk">
              <span>Return home</span>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/portfolio" className="btn-punk btn-punk-plasma">
              <span>See my work</span>
            </Link>
          </MagneticButton>
        </div>

        {/* Terminal-style output */}
        <div className="mt-16 text-left inline-block bg-ash border border-smoke p-6 font-mono text-xs text-ghost max-w-sm">
          <p><span className="text-volt">$</span> find . -name &quot;{"{this page}"}&quot;</p>
          <p className="text-blood mt-1">find: no results returned</p>
          <p className="text-ghost mt-1"><span className="text-volt">$</span> echo &quot;try going back&quot;<span className="animate-cursor-blink">▮</span></p>
          <p className="text-ghost mt-1">try going back</p>
        </div>
      </div>
    </main>
  );
}
