import React, { useState } from 'react';
import { ArrowUp, MessageSquare, Bookmark, Award } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { MiniPlayer } from '../ui/mini-player';

export function HeroArticle({ hero, navigate, requireAuth }: { hero: any; navigate: (p: string) => void; requireAuth?: (action: () => void) => void }) {
  const [heroUpvoted, setHeroUpvoted] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);

  const handleUpvote = () => {
    if (requireAuth) requireAuth(() => setHeroUpvoted(!heroUpvoted));
    else setHeroUpvoted(!heroUpvoted);
  };
  const handleSave = () => {
    if (requireAuth) requireAuth(() => setHeroSaved(!heroSaved));
    else setHeroSaved(!heroSaved);
  };

  return (
    <article className="group cursor-pointer mb-5" onClick={() => navigate("article")}>
      
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Avatar initials={hero.initials} size={24} />
        <span className="text-[15px] text-foreground font-medium font-body">{hero.author}</span>
        {hero.verified && <Award className="w-4 h-4 text-primary" />}
        <span className="text-muted-foreground/40 text-[10px]">·</span>
        <span className="text-[14px] text-muted-foreground font-body">{hero.publishedAt}</span>
        <span className="text-muted-foreground/40 text-[10px]">·</span>
        <span className="text-[14px] text-muted-foreground font-mono">{hero.readTime} min</span>
        <span className="text-border text-[12px] hidden sm:inline mx-2">|</span>
        <div className="flex gap-2">
          {hero.tags.map((t: string) => (
            <span key={t} className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-primary/5 text-muted-foreground hover:text-primary transition-colors rounded-full border border-border/60 font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>

      <h2 className="text-[38px] sm:text-[44px] leading-[1.15] text-foreground mb-4 group-hover:text-primary transition-colors tracking-tight font-display font-normal">
        {hero.title}
      </h2>
      
      <p className="text-[18px] leading-[1.6] text-muted-foreground mb-7 font-body max-w-[65ch]">
        {hero.deck}
      </p>

      {hero.image && (
        <div className="w-full rounded-xl overflow-hidden mb-7 bg-muted border border-border/20" style={{ aspectRatio: "21/8" }}>
          <img src={hero.image} alt={hero.title} className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700" />
        </div>
      )}

      {hero.audio && <div className="mb-6 max-w-2xl"><MiniPlayer duration={hero.audio} id={hero.id} /></div>}
      
      <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
        <div className="ml-auto flex items-center gap-6" onClick={e => e.stopPropagation()}>
          <button onClick={handleUpvote} className={`flex items-center gap-1.5 text-[14px] transition-colors font-mono ${heroUpvoted ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <ArrowUp className="w-4 h-4" />{hero.upvotes + (heroUpvoted ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors font-mono">
            <MessageSquare className="w-4 h-4" />{hero.comments}
          </button>
          <button onClick={handleSave} className={`transition-colors ${heroSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Bookmark className={`w-5 h-5 ${heroSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
