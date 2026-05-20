"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const wrapper = wrapperRef.current;
    if (!dot || !ring || !wrapper) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
    };

    const onEnterHoverable = () => {
      wrapper?.classList.add("cursor-hover");
    };
    const onLeaveHoverable = () => {
      wrapper?.classList.remove("cursor-hover");
    };

    // Smooth ring follow
    let rafId: number;
    const followRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(followRing);
    };
    rafId = requestAnimationFrame(followRing);

    // Magnetic effect on tagged elements
    const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const magneticCleanups: (() => void)[] = [];

    magneticEls.forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength ?? "0.35");

      const handleEnter = () => onEnterHoverable();
      const handleLeave = () => {
        onLeaveHoverable();
        gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1,0.5)" });
      };
      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        gsap.to(el, {
          x: (e.clientX - cx) * strength,
          y: (e.clientY - cy) * strength,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("mousemove", handleMove as EventListener);

      magneticCleanups.push(() => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.removeEventListener("mousemove", handleMove as EventListener);
      });
    });

    // Generic hover detection
    const hoverables = document.querySelectorAll("a, button, [data-hover]");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", onEnterHoverable);
      el.addEventListener("mouseleave", onLeaveHoverable);
    });

    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      magneticCleanups.forEach((fn) => fn());
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterHoverable);
        el.removeEventListener("mouseleave", onLeaveHoverable);
      });
    };
  }, []);

  return (
    <div ref={wrapperRef} className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring absolute top-0 left-0" />
      <div ref={dotRef} className="cursor-dot absolute top-0 left-0" />
    </div>
  );
}
