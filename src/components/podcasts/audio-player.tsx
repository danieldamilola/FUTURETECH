"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  title: string;
  audioUrl: string;
  durationSeconds: number;
  showNotesHtml?: string;
}

export function AudioPlayer({
  title,
  audioUrl,
  durationSeconds,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-4 rounded-[var(--radius-lg)] bg-[#1A1F25] border border-[var(--border-strong)] space-y-3 select-none text-[var(--ink)]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold tracking-wider text-[var(--accent)] uppercase mb-0.5">
            FutureTech Podcast
          </div>
          <h3 className="text-sm font-bold text-[var(--ink)] line-clamp-1">{title}</h3>
        </div>

        <div className="text-xs font-mono-numbers text-[var(--ink-muted)] shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Scrubber Bar */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[var(--surface-high)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => skipSeconds(-15)}
            aria-label="Rewind 15 seconds"
            className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="p-2.5 rounded-full bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => skipSeconds(15)}
            aria-label="Forward 15 seconds"
            className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[var(--danger)]" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
