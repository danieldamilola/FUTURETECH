'use client'

import React, { useState } from 'react';
import { ArrowUp, Check } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Tag } from '../ui/tag';

export function QuestionRow({ q, navigate }: { q: any; navigate: (p: string) => void }) {
  const [upvoted, setUpvoted] = useState(false);
  
  return (
    <div className="group py-12 cursor-pointer border-b border-border/40 last:border-0" onClick={() => navigate("question")}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-[20px] leading-snug text-foreground group-hover:text-primary transition-colors font-display tracking-tight font-medium">
          {q.title}
        </h3>
        {q.solved && (
          <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 px-2.5 py-1 rounded-full font-mono">
            <Check className="w-2.5 h-2.5" /> Solved
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap" onClick={e => e.stopPropagation()}>
        <Avatar initials={q.initials} size={22} />
        <span className="text-sm text-muted-foreground font-body">{q.author}</span>
        <span className="text-muted-foreground/30">·</span>
        <div className="flex gap-3">{q.tags.map((t: string) => <Tag key={t} name={t} />)}</div>
        <div className="ml-auto flex items-center gap-5 text-sm text-muted-foreground font-mono">
          <button onClick={() => setUpvoted(!upvoted)} className={`flex items-center gap-1 transition-colors ${upvoted ? "text-primary" : "hover:text-foreground"}`}>
            <ArrowUp className="w-3.5 h-3.5" />{q.upvotes + (upvoted ? 1 : 0)}
          </button>
          <span>{q.answers} answers</span>
          <span className="hidden sm:inline">{q.views} views</span>
        </div>
      </div>
    </div>
  );
}
