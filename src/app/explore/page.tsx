import React from "react";
import Link from "next/link";
import { Compass, Hash } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ExplorePage() {
  const supabase = await createClient();
  
  const { data: tags } = await (supabase.from("tags") as any)
    .select("id, name, slug, description")
    .order("name", { ascending: true });

  const tagsList = tags || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
        <h1 className="text-sm font-medium text-[var(--ink)]">Explore Topics</h1>
        <div className="flex items-center gap-4">
          <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">{tagsList.length} topics</span>
        </div>
      </div>

      {tagsList.length === 0 ? (
        <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
          No topics found. <Link href="/feed" className="text-[var(--accent)] hover:underline">Explore the feed.</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tagsList.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/feed?tag=${tag.slug}`}
              className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors block group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-xs text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[var(--accent)]" />
                  <span>{tag.name}</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2">
                {tag.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
