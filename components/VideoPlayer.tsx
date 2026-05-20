"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Props = {
  src: string;
  poster?: string;
  caption?: string;
  accent?: "volt" | "plasma" | "ice" | "blood";
};

const accentColors = {
  volt: "#CAFF00",
  plasma: "#BF00FF",
  ice: "#00FFEE",
  blood: "#FF0035",
};

export function VideoPlayer({ src, poster, caption, accent = "volt" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div
      className="relative w-full bg-void border border-smoke overflow-hidden group video-player-glow"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onClick={togglePlay}
        />

        {!isPlaying && poster && (
          <div className="absolute inset-0">
            <Image src={poster.startsWith('/') ? poster : `/assets/uploads/${poster}`} alt="Video poster" fill className="object-cover" />
            <div className="absolute inset-0 bg-void/30" />
          </div>
        )}

        {/* Play/Pause overlay button */}
        <button
          onClick={togglePlay}
          className={`
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-300
            ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}
          `}
        >
          <div
            className={`
              w-20 h-20 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 hover:scale-110
              ${isPlaying ? "border-white/50 bg-black/30" : `border-[${accentColors[accent]}] bg-black/50`}
            `}
            style={{ borderColor: isPlaying ? "rgba(255,255,255,0.5)" : accentColors[accent] }}
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-8 bg-white" />
                <div className="w-1 h-8 bg-white" />
              </div>
            ) : (
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
            )}
          </div>
        </button>

        {/* Controls */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-4
            bg-gradient-to-t from-void via-void/80 to-transparent
            transition-opacity duration-300
            ${showControls ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Progress bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 appearance-none cursor-pointer bg-smoke rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${accentColors[accent]} ${progress}%, var(--smoke) ${progress}%)`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause button */}
              <button onClick={togglePlay} className="hover:text-volt transition-colors">
                {isPlaying ? (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-5 bg-ghost" />
                    <div className="w-1 h-5 bg-ghost" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-ghost border-b-[8px] border-b-transparent ml-0.5" />
                )}
              </button>

              {/* Time display */}
              <span className="font-label text-[0.62rem] text-ghost tracking-wider">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-volt transition-colors">
                  {isMuted || volume === 0 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 appearance-none cursor-pointer bg-smoke rounded-full overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${accentColors[accent]} ${(isMuted ? 0 : volume) * 100}%, var(--smoke) ${(isMuted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    video.requestFullscreen();
                  }
                }}
                className="hover:text-volt transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <div className="p-4 border-t border-smoke bg-ink">
          <p className="font-mono text-sm text-ghost">{caption}</p>
        </div>
      )}
    </div>
  );
}
