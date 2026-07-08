'use client'

import React, { useState } from 'react';
import { Play, Pause, Volume2, FastForward } from 'lucide-react';

export function MiniPlayer({ duration, id }: { duration: string; id: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="flex items-center gap-4 bg-muted/40 border border-border/40 p-2.5 rounded-lg w-full max-w-sm"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={() => setPlaying(!playing)}
        className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-primary hover:scale-105 transition-all"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 transition-all duration-1000" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{playing ? "18:42" : "00:00"}</span>
          <span>{duration}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><FastForward className="w-3.5 h-3.5" /></button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><Volume2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}
