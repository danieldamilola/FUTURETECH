'use client'

import React, { useState } from 'react';
import { ArrowUp, MessageSquare, Bookmark } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { MiniPlayer } from '../ui/mini-player';
import { Tag } from '../ui/tag';

export function ArticleRow({ article, navigate }: { article: any; navigate: (p: string) => void }) {
  const [upvoted, setUpvoted] = useState(false);
  const [saved,   setSaved]   = useState(false);

  return (
    <article className="group py-12 cursor-pointer border-b border-border/40 last:border-0" onClick={() => navigate("article")}>
      <div className="mb-5">
        
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Avatar initials={article.initials} size={20} />
          <span className="text-[14px] text-foreground font-medium font-body">{article.author}</span>
          <span className="text-muted-foreground/40 text-[10px]">·</span>
          <span className="text-[13px] text-muted-foreground font-body">{article.publishedAt}</span>
          <span className="text-border text-[12px] hidden sm:inline mx-1">|</span>
          <div className="flex gap-2">
            {article.tags.map((t: string) => (
              <Tag key={t} name={t} />
            ))}
          </div>
        </div>

        <h3 className="text-[26px] leading-[1.2] text-foreground mb-3 group-hover:text-primary transition-colors font-display font-medium tracking-tight">
          {article.title}
        </h3>
        <p className="text-[15px] leading-[1.6] text-muted-foreground line-clamp-3 mb-6 font-body">
          {article.deck}
        </p>

        {article.image && (
          <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-muted mb-6 border border-border/20">
            <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          </div>
        )}
      </div>

      {article.audio && (
        <div className="mb-6 w-full">
          <MiniPlayer duration={article.audio} id={article.id} />
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap" onClick={e => e.stopPropagation()}>
        <div className="ml-auto flex items-center gap-6">
          <button onClick={() => setUpvoted(!upvoted)} className={`flex items-center gap-1.5 text-[13px] transition-colors font-mono ${upvoted ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <ArrowUp className="w-3.5 h-3.5" />{article.upvotes + (upvoted ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors font-mono">
            <MessageSquare className="w-3.5 h-3.5" />{article.comments}
          </button>
          <button onClick={() => setSaved(!saved)} className={`transition-colors ${saved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
