"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
};

export function MarkdownImage({ src, alt, caption }: Props) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handleKeyDown]);

  return (
    <>
      <div
        className="relative my-8 cursor-pointer group inline-block max-w-full"
        onClick={() => setIsLightboxOpen(true)}
      >
        <div className="relative max-h-[500px] w-auto overflow-hidden border border-smoke">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="object-contain max-w-full h-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-void/0 group-hover:bg-void/10 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-4 py-2 border border-white/30 backdrop-blur-sm">
            <span className="font-label text-[0.62rem] text-white tracking-widest uppercase">Click to expand</span>
          </div>
        </div>
        {caption && (
          <p className="font-mono text-xs text-ghost mt-2 text-center italic">{caption}</p>
        )}
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-void/95 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="w-12 h-12 flex items-center justify-center border border-smoke hover:border-volt transition-colors"
            >
              <span className="font-label text-xl text-ghost hover:text-volt">×</span>
            </button>
          </div>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="object-contain max-w-full max-h-[85vh]"
                priority
              />
            </div>

            {caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-void via-void/80 to-transparent">
                <p className="font-mono text-sm text-ghost text-center">{caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
