import React from 'react';

export function Tag({ name }: { name: string }) {
  return (
    <span
      className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-primary/5 text-muted-foreground hover:text-primary transition-colors rounded-sm border border-border/60"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {name}
    </span>
  );
}
