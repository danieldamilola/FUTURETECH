import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag, ContentType } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Bookmark } from "lucide-react";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/feed?authRequired=1");
  }

  const { data: bookmarksData } = await supabase
    .from("bookmarks")
    .select(`
      id,
      created_at,
      article:articles(id, title, slug, excerpt, upvotes_count, author:profiles!author_id(display_name, username)),
      question:questions(id, title, upvotes_count, author:profiles!author_id(display_name, username))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) as any;

  const bookmarks = bookmarksData || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Saved Bookmarks</h1>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {bookmarks.length} items
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--ink-muted)]" />
          <p className="mb-3">No bookmarks yet. Explore the feed and save articles.</p>
          <Link href="/feed" className="text-[var(--accent)] hover:underline">
            Explore articles & podcasts →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {bookmarks.map((bookmark: any) => {
            const item = bookmark.article || bookmark.question;
            if (!item) return null;
            
            const isArticle = !!bookmark.article;
            const type: ContentType = isArticle ? "article" : "question";
            const tagLabel = isArticle ? "ARTICLE" : "QUESTION";
            const excerpt = item.excerpt || ""; 
            const authorName = item.author?.display_name || "Unknown";
            const dateStr = new Date(bookmark.created_at).toLocaleDateString();

            return (
              <div key={bookmark.id} className="py-4 flex gap-4 items-start group">
                <VoteControl
                  initialUpvotes={item.upvotes_count || 0}
                  orientation="vertical"
                  className="mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <ContentTag type={type} label={tagLabel} />
                    <BookmarkButton 
                      targetType={type} 
                      targetId={item.id} 
                      initialBookmarked={true} 
                    />
                  </div>

                  <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-1">
                    <Link href={isArticle ? `/articles/${item.slug}` : `/questions/${item.id}`}>
                      {item.title}
                    </Link>
                  </h2>

                  {excerpt && (
                    <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-2 leading-relaxed">
                      {excerpt}
                    </p>
                  )}

                  <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers flex items-center gap-2">
                    <span>{authorName}</span>
                    <span>·</span>
                    <span>Saved {dateStr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
