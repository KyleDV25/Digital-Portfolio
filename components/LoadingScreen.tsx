"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const screen = screenRef.current;
    const bar = barRef.current;
    const counter = counterRef.current;
    if (!screen || !bar || !counter) return;

    // Prevent scroll while loading
    document.body.style.overflow = "hidden";

    let progress = 0;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(screen, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => {
            setMounted(false);
            document.body.style.overflow = "";
          },
        });
      },
    });

    const fakeLoad = setInterval(() => {
      progress += Math.random() * 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(fakeLoad);
      }
      gsap.to(bar, { width: `${progress}%`, duration: 0.1, ease: "none" });
      if (counter) counter.textContent = `${Math.floor(progress).toString().padStart(3, "0")}`;
    }, 80);

    tl.to({}, { duration: 1.2 }); // hold just long enough

    return () => clearInterval(fakeLoad);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={screenRef} className="loading-screen" aria-live="polite" aria-label="Loading">
      {/* Glitch title */}
      <div className="mb-16 text-center">
        <p
          className="glitch-text font-display text-[clamp(3rem,10vw,7rem)] text-chalk tracking-tightest leading-none"
          data-text="LOADING"
        >
          LOADING
        </p>
      </div>

      {/* Progress bar */}
      <div className="loading-bar-track mb-6">
        <div ref={barRef} className="loading-bar-fill" />
      </div>

      {/* Counter */}
      <div
        ref={counterRef}
        className="font-label text-volt text-xs tracking-widest tabular-nums"
      >
        000
      </div>

      {/* Corner labels */}
      <span className="absolute top-6 left-6 font-label text-ghost text-[0.6rem] tracking-widest uppercase">
        KYLE DE VARES
      </span>
      <span className="absolute top-6 right-6 font-label text-ghost text-[0.6rem] tracking-widest uppercase">
        Portfolio v2
      </span>
      <span className="absolute bottom-6 left-6 font-label text-ghost text-[0.6rem] tracking-widest uppercase">
        // System boot
      </span>
      <span className="absolute bottom-6 right-6 font-label text-ghost text-[0.6rem] tracking-widest uppercase animate-cursor-blink">
        ▮
      </span>
    </div>
  );
}
