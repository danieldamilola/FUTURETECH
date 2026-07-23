"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag, ContentType } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FeedItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  commentsCount: number;
  readTimeMins: number;
  upvotes: number;
  downvotes: number;
  userVote?: number;
}

export default function FeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"for-you" | "trending" | "recent">("for-you");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("authRequired") === "1") {
      setIsAuthModalOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("authRequired");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      const supabase = createClient();
      
      const orderBy = activeTab === "trending" ? "upvotes_count" : "published_at";
      const qOrderBy = activeTab === "trending" ? "upvotes_count" : "created_at";

      const [articlesResult, questionsResult] = await Promise.all([
        supabase.from("articles")
          .select("id, title, slug, excerpt, read_time_mins, upvotes_count, comments_count, published_at, author:profiles!author_id(display_name)")
          .eq("status", "published")
          .order(orderBy, { ascending: false })
          .limit(20) as any,
        supabase.from("questions")
          .select("id, title, body_html, upvotes_count, answers_count, created_at, author:profiles!author_id(display_name)")
          .order(qOrderBy, { ascending: false })
          .limit(10) as any,
      ]);

      const items: FeedItem[] = [];

      if (articlesResult.data) {
        for (const article of articlesResult.data) {
          items.push({
            id: article.id,
            type: "article",
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            author: article.author?.display_name || "Unknown",
            timeAgo: article.published_at ? new Date(article.published_at).toLocaleDateString() : "",
            commentsCount: article.comments_count || 0,
            readTimeMins: article.read_time_mins || 0,
            upvotes: article.upvotes_count || 0,
            downvotes: 0,
            // Assuming published_at for sorting mixed array
            _sortDate: new Date(article.published_at || 0).getTime(),
            _sortUpvotes: article.upvotes_count || 0
          } as any);
        }
      }

      if (questionsResult.data) {
        for (const question of questionsResult.data) {
          items.push({
            id: question.id,
            type: "question",
            title: question.title,
            slug: question.id, // questions use id in route
            excerpt: question.body_html ? question.body_html.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : "",
            author: question.author?.display_name || "Unknown",
            timeAgo: question.created_at ? new Date(question.created_at).toLocaleDateString() : "",
            commentsCount: question.answers_count || 0,
            readTimeMins: 0, // not applicable
            upvotes: question.upvotes_count || 0,
            downvotes: 0,
            _sortDate: new Date(question.created_at || 0).getTime(),
            _sortUpvotes: question.upvotes_count || 0
          } as any);
        }
      }

      // Sort mixed items
      if (activeTab === "trending") {
        items.sort((a: any, b: any) => b._sortUpvotes - a._sortUpvotes);
      } else {
        items.sort((a: any, b: any) => b._sortDate - a._sortDate);
      }

      setFeedItems(items);
      setLoading(false);
    }

    fetchFeed();
  }, [activeTab]);

  return (
    <>
    <div className="w-full">
      {/* Feed Sort Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] pb-3 mb-4 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("for-you")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "for-you"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          For You
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trending")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "trending"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Trending
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recent")}
          className={cn(
            "pb-1 transition-colors cursor-pointer",
            activeTab === "recent"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Recent
        </button>
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
      ) : feedItems.length === 0 ? (
        <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
          No items found. Check back later!
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {feedItems.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 items-start group">
              {/* Vote Rail */}
              <VoteControl
                initialUpvotes={item.upvotes}
                initialDownvotes={item.downvotes}
                userVote={item.userVote}
                orientation="vertical"
                className="mt-0.5"
              />

              {/* Row Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ContentTag type={item.type} label={item.type.toUpperCase()} />
                </div>

                <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                  <Link href={item.type === "question" ? `/questions/${item.id}` : `/articles/${item.slug}`}>
                    {item.title}
                  </Link>
                </h2>

                <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                  {item.excerpt}
                </p>

                {/* Mono Metadata Line */}
                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2 flex-wrap">
                  <span>{item.author}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                  <span>·</span>
                  <span>{item.commentsCount} {item.type === 'question' ? 'answers' : 'comments'}</span>
                  {item.type === 'article' && (
                    <>
                      <span>·</span>
                      <span>{item.readTimeMins} min read</span>
                    </>
                  )}
                  <span className="ml-auto flex items-center gap-1">
                    <BookmarkButton targetType={item.type === "question" ? "question" : item.type === "podcast" ? "podcast" : "article"} targetId={item.id} />
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signin"
      />
    </>
  );
}
