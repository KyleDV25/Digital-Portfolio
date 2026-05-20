"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type MediaItem = {
  type?: "image" | "video";
  image?: string;
  video?: string;
  videoUrl?: string;
  posterImage?: string;
  caption?: string;
  altText?: string;
};

type Props = {
  items: MediaItem[];
  accent?: "volt" | "plasma" | "ice" | "blood";
};

const accentColors = {
  volt: "#CAFF00",
  plasma: "#BF00FF",
  ice: "#00FFEE",
  blood: "#FF0035",
};

export function PhotoGallery({ items, accent = "volt" }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const images = items.filter((item) => item.type !== "video" && item.image);
  const videos = items.filter((item) => item.type === "video" && (item.video || item.videoUrl));

  const handlePrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setIsAnimating(true);
    setDirection(-1);
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
  }, [selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setIsAnimating(true);
    setDirection(1);
    setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    },
    [selectedIndex, handlePrevious, handleNext]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
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
  }, [selectedIndex, handleKeyDown]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            onClick={() => setSelectedIndex(index)}
            className="relative overflow-hidden cursor-none group gallery-item aspect-square"
          >
            <Image
              src={item.image ? (item.image.startsWith('/') ? item.image : `/assets/uploads/${item.image}`) : "/assets/uploads/redesign.png"}
              alt={item.altText || item.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-void/0 group-hover:bg-void/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="px-4 py-2 border border-white/30 backdrop-blur-sm">
                <span className="font-label text-[0.62rem] text-white tracking-widest uppercase">View</span>
              </div>
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-mono text-xs text-ghost">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] bg-void/95 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
              className="w-12 h-12 flex items-center justify-center border border-smoke hover:border-volt transition-colors"
            >
              <span className="font-label text-xl text-ghost hover:text-volt">×</span>
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center border border-smoke hover:border-volt transition-colors group"
          >
            <span className="font-label text-2xl text-ghost group-hover:text-volt">←</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center border border-smoke hover:border-volt transition-colors group"
          >
            <span className="font-label text-2xl text-ghost group-hover:text-volt">→</span>
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`
                relative aspect-[16/9] overflow-hidden
                transition-all duration-400 ease-out
                ${isAnimating ? (direction > 0 ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0") : "translate-x-0 opacity-100"}
              `}
            >
              <Image
                src={images[selectedIndex].image ? (images[selectedIndex].image.startsWith('/') ? images[selectedIndex].image : `/assets/uploads/${images[selectedIndex].image}`) : "/assets/uploads/redesign.png"}
                alt={images[selectedIndex].altText || images[selectedIndex].caption || `Gallery image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {images[selectedIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-void via-void/80 to-transparent">
                <p className="font-mono text-sm text-ghost">{images[selectedIndex].caption}</p>
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAnimating(true);
                    setDirection(index > selectedIndex ? 1 : -1);
                    setSelectedIndex(index);
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index === selectedIndex ? accentColors[accent] : "var(--smoke)",
                    transform: index === selectedIndex ? "scale(1.5)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 font-label text-[0.62rem] text-ghost tracking-widest uppercase">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
