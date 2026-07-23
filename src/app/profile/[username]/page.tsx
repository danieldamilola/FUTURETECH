import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { FollowButton } from "@/components/ui/follow-button";
import { Globe, Calendar, Link2, Users, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a server-side Supabase client
const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
};

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab = "articles" } = await searchParams;
  
  const supabase = await createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!profile) {
    notFound();
  }

  // Fetch basic counts for the tabs
  const [{ count: articlesCount }, { count: questionsCount }, { count: bookmarksCount }] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("author_id", profile.id).eq("status", "published"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("author_id", profile.id),
    supabase.from("bookmarks").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
  ]);

  // Fetch actual data based on active tab
  let feedItems: any[] = [];
  
  if (tab === "articles") {
    const { data } = await supabase
      .from("articles")
      .select("*, tags(*)")
      .eq("author_id", profile.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(10);
    feedItems = data || [];
  } else if (tab === "questions") {
    const { data } = await supabase
      .from("questions")
      .select("*, tags(*)")
      .eq("author_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10);
    feedItems = data || [];
  } else if (tab === "bookmarks") {
    // Basic bookmarks fetch (just fetching the bookmark records for now)
    const { data } = await supabase
      .from("bookmarks")
      .select("*, articles(*), questions(*), podcast_shows(*)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10);
    feedItems = data || [];
  }

  const initials = profile.display_name
    ? profile.display_name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  // Parse join date
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const techStack = profile.tech_stack || [];

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-xl flex items-center justify-center font-mono-numbers shrink-0 overflow-hidden border border-[var(--border)]">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-[var(--ink)]">{profile.display_name}</h1>
                <div className="text-xs text-[var(--ink-muted)] font-mono-numbers">
                  @{profile.username}
                </div>
              </div>
              {(!currentUser || currentUser.id !== profile.id) && (
                <div className="flex items-center gap-2">
                  <FollowButton targetType="user" targetId={profile.id} initialFollowing={false} size="sm" />
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="text-xs text-[var(--ink-muted)] mt-3 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Links & Join Date */}
            <div className="flex items-center gap-x-4 gap-y-2 mt-4 text-[11px] text-[var(--ink-muted)] flex-wrap">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-mono-numbers">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                Joined {joinDate}
              </span>
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors">
                  <Link2 className="w-3.5 h-3.5 opacity-70" />
                  {profile.github_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors">
                  <Globe className="w-3.5 h-3.5 opacity-70" />
                  {profile.website_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors">
                  <Link2 className="w-3.5 h-3.5 opacity-70" />
                  {profile.twitter_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors">
                  <Briefcase className="w-3.5 h-3.5 opacity-70" />
                  LinkedIn
                </a>
              )}
            </div>

            {/* Tech Stack Chips */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {techStack.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] text-[10px] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Using Search Params for Server Component rendering */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] pb-2 text-xs">
        <Link
          href={`/profile/${username}?tab=articles`}
          className={cn(
            "pb-1 transition-colors",
            tab === "articles"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Articles ({articlesCount || 0})
        </Link>
        <Link
          href={`/profile/${username}?tab=questions`}
          className={cn(
            "pb-1 transition-colors",
            tab === "questions"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Questions ({questionsCount || 0})
        </Link>
        <Link
          href={`/profile/${username}?tab=bookmarks`}
          className={cn(
            "pb-1 transition-colors",
            tab === "bookmarks"
              ? "text-[var(--ink)] font-medium underline underline-offset-8 decoration-2 decoration-[var(--accent)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          )}
        >
          Bookmarks ({bookmarksCount || 0})
        </Link>
      </div>

      {/* Tab Content */}
      <div className="divide-y divide-[var(--border)]">
        {feedItems.length === 0 ? (
          <div className="py-12 text-center text-[var(--ink-muted)] text-xs">
            No {tab} found.
          </div>
        ) : (
          feedItems.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 items-start group">
              <VoteControl initialUpvotes={item.upvotes_count || 0} orientation="vertical" />
              <div className="flex-1 min-w-0">
                <ContentTag 
                  type={tab === "questions" ? "question" : "article"} 
                  label={tab.toUpperCase().slice(0, -1)} 
                />
                <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-1">
                  <Link href={`/${tab === "questions" ? "questions" : "blog"}/${item.slug || item.id}`}>
                    {item.title || item.articles?.title || item.questions?.title || "Untitled"}
                  </Link>
                </h2>
                {item.excerpt && (
                  <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-1">
                    {item.excerpt}
                  </p>
                )}
                <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-2 flex items-center gap-2">
                  <span>
                    {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
