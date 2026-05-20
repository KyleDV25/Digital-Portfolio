"use client";

import { useEffect, useState, type ElementType } from "react";

interface Props {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  mode?: "hover" | "continuous" | "once";
}

const CHARS = "!<>-_\\/[]{}-=+*^?#____XYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scramble(text: string, progress: number): string {
  return text
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      if (index < progress * text.length) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

export function GlitchText({ children, as: Tag = "span", className = "", mode = "hover" }: Props) {
  const [display, setDisplay] = useState(children);
  const [isGlitching, setIsGlitching] = useState(mode === "continuous");

  useEffect(() => {
    if (mode !== "once") return;

    let frame = 0;
    const total = 20;
    const interval = setInterval(() => {
      frame += 1;
      setDisplay(scramble(children, frame / total));
      if (frame >= total) {
        clearInterval(interval);
        setDisplay(children);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [children, mode]);

  useEffect(() => {
    if (!isGlitching) {
      setDisplay(children);
      return;
    }

    let frame = 0;
    const total = mode === "continuous" ? 999999 : 16;
    const interval = setInterval(() => {
      frame += 1;
      const progress = mode === "continuous" ? Math.sin(frame / 10) * 0.5 + 0.5 : frame / total;
      setDisplay(scramble(children, progress));
      if (frame >= total && mode !== "continuous") {
        clearInterval(interval);
        setDisplay(children);
        setIsGlitching(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isGlitching, children, mode]);

  const handlers =
    mode === "hover"
      ? {
          onMouseEnter: () => setIsGlitching(true),
          onMouseLeave: () => {
            setIsGlitching(false);
            setDisplay(children);
          },
        }
      : {};

  const Component = Tag as ElementType;

  return (
    <Component className={`font-display ${className}`} aria-label={children} {...handlers}>
      {display}
    </Component>
  );
}
