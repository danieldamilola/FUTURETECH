"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  commentsCount: number;
  readTimeMins: number;
  upvotes: number;
}

export default function ArticlesPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "trending" | "recent">("for-you");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const supabase = createClient();
      const orderBy = activeTab === "trending" ? "upvotes_count" : "published_at";

      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, read_time_mins, upvotes_count, comments_count, published_at, author:profiles!author_id(display_name)")
        .eq("status", "published")
        .order(orderBy, { ascending: false })
        .limit(30) as any;

      const items: ArticleItem[] = (data || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        author: a.author?.display_name || "Unknown",
        timeAgo: a.published_at ? new Date(a.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
        commentsCount: a.comments_count || 0,
        readTimeMins: a.read_time_mins || 0,
        upvotes: a.upvotes_count || 0,
      }));

      setArticles(items);
      setLoading(false);
    }

    fetchArticles();
  }, [activeTab]);

  const tabCls = (tab: string) =>
    cn(
      "pb-1 transition-colors cursor-pointer text-xs",
      activeTab === tab
        ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
        : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
    );

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-base font-bold text-[var(--ink)] tracking-tight">Articles</h1>
        <p className="text-xs text-[var(--ink-muted)] mt-0.5">Long-form technical writing from the community.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] pb-3 mb-4">
        <button type="button" onClick={() => setActiveTab("for-you")} className={tabCls("for-you")}>For You</button>
        <button type="button" onClick={() => setActiveTab("trending")} className={tabCls("trending")}>Trending</button>
        <button type="button" onClick={() => setActiveTab("recent")} className={tabCls("recent")}>Recent</button>
        <Link
          href="/new/article"
          className="ml-auto text-xs px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] rounded-[var(--radius-sm)] font-medium hover:opacity-90 transition-opacity"
        >
          Write Article
        </Link>
      </div>

      {loading ? (
        <div className="divide-y divide-[var(--border)] animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-4 flex gap-4">
              <div className="w-8 space-y-1">
                <div className="h-3 w-6 bg-[var(--surface-high)] rounded" />
                <div className="h-3 w-4 bg-[var(--surface-high)] rounded mx-auto" />
                <div className="h-3 w-6 bg-[var(--surface-high)] rounded" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-16 bg-[var(--surface-high)] rounded" />
                <div className="h-4 w-3/4 bg-[var(--surface-high)] rounded" />
                <div className="h-3 w-full bg-[var(--surface-high)] rounded" />
                <div className="h-3 w-1/2 bg-[var(--surface-high)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
          No articles found. <Link href="/new/article" className="text-[var(--accent)] hover:underline">Write the first one.</Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {articles.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 items-start group">
              <VoteControl
                initialUpvotes={item.upvotes}
                initialDownvotes={0}
                orientation="vertical"
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ContentTag type="article" label="ARTICLE" />
                </div>
                <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                  <Link href={`/articles/${item.slug}`}>{item.title}</Link>
                </h2>
                {item.excerpt && (
                  <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2 flex-wrap">
                  <span>{item.author}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                  <span>·</span>
                  <span>{item.commentsCount} comments</span>
                  <span>·</span>
                  <span>{item.readTimeMins} min read</span>
                  <span className="ml-auto flex items-center gap-1">
                    <BookmarkButton targetType="article" targetId={item.id} />
                    <button type="button" aria-label="Share" className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
