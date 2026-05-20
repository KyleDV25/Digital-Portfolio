"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  /** "chars" | "words" | "lines" */
  split?: "chars" | "words" | "lines";
  trigger?: "load" | "scroll";
  stagger?: number;
}

export function TextReveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  split = "chars",
  trigger = "scroll",
  stagger = 0.03,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const splitInstance = new SplitType(el, { types: split });
    const targets =
      split === "chars"
        ? splitInstance.chars
        : split === "words"
        ? splitInstance.words
        : splitInstance.lines;

    if (!targets || targets.length === 0) return;

    gsap.set(targets, { yPercent: 110, opacity: 0 });

    const animateIn = () =>
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        stagger,
        delay,
      });

    if (trigger === "load") {
      animateIn();
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: animateIn,
      });
    }

    return () => {
      splitInstance.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [children, split, trigger, delay, stagger]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </Tag>
  );
}
