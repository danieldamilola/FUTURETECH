import React from "react";
import Link from "next/link";
import { AudioPlayer } from "@/components/podcasts/audio-player";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { FollowButton } from "@/components/ui/follow-button";
import {
  Headphones, Clock, Calendar, TrendingUp, Users, Radio,
  Play, Plus, Mic, ChevronRight, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

// ── Helpers ────────────────────────────────────────────────────
function fmt(seconds: number) {
  if (!seconds) return "0m 0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function fmtPlays(n: number) {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Show Card ──────────────────────────────────────────────────
function ShowCard({ show }: { show: any }) {
  const initials = show.title.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["#2B3D3A", "#2B3038", "#1E2B3A", "#2B2B1E"];
  const bg = bgColors[show.id.charCodeAt(5) % bgColors.length] || bgColors[0];

  return (
    <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors flex flex-col gap-3 group">
      {/* Cover art */}
      <div
        className="w-full aspect-square rounded-[var(--radius-sm)] flex items-center justify-center text-3xl font-bold text-[var(--ink-muted)] overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {show.cover_image_url ? (
          <img src={show.cover_image_url} alt={show.title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono-numbers text-xl opacity-60">{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest mb-1 block" style={{ color: "var(--classifier-podcast)" }}>
          {show.category}
        </span>
        <Link href={`/podcasts/show/${show.slug}`}>
          <h3 className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-1 mb-1">
            {show.title}
          </h3>
        </Link>
        <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2 leading-relaxed mb-2">
          {show.description}
        </p>
        <div className="text-[10px] font-mono-numbers text-[var(--ink-muted)] flex items-center gap-2 mb-3">
          <span>by @{show.author?.username}</span>
          <span>·</span>
          <span>{fmtPlays(show.followers_count)} followers</span>
          <span>·</span>
          <span>{show.episodes_count || 0} eps</span>
        </div>
      </div>

      <FollowButton
        targetType="show"
        targetId={show.id}
        initialFollowing={false}
        size="sm"
        className="w-full justify-center"
      />
    </div>
  );
}

// ── Episode Row ────────────────────────────────────────────────
function EpisodeRow({ ep }: { ep: any }) {
  // Keeping this simple without inline state for expansion, or could use a client component wrapper.
  // Actually, I can use a small Client Component for the play button expansion if needed, or just link to it.
  // Let's use details/summary for CSS-only expansion to keep it a server component.
  return (
    <details className="group/ep rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-colors hover:bg-[var(--surface-hover)]">
      <summary className="p-4 flex gap-3 items-start list-none cursor-pointer marker:hidden">
        {/* Mini cover art */}
        <div
          className="w-10 h-10 rounded-[var(--radius-sm)] shrink-0 flex items-center justify-center text-xs font-bold text-[var(--ink-muted)] bg-[var(--surface-high)]"
          style={{ minWidth: 40 }}
        >
          {ep.cover_image_url ? (
            <img src={ep.cover_image_url} alt="" className="w-full h-full object-cover rounded-[var(--radius-sm)]" />
          ) : (
            <Mic className="w-4 h-4 opacity-40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/podcasts/show/${ep.show?.slug}`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C9954C] mb-1 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Radio className="w-2.5 h-2.5" />
            <span>{ep.show?.title}</span>
          </Link>

          <Link href={`/podcasts/${ep.slug}`} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xs font-semibold text-[var(--ink)] leading-snug mb-1 hover:text-[var(--accent)] transition-colors line-clamp-2">
              {ep.title}
            </h3>
          </Link>

          <div className="text-[10px] font-mono-numbers text-[var(--ink-muted)] flex items-center gap-2 flex-wrap mb-2">
            <span>@{ep.author?.username || "creator"}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{new Date(ep.published_at).toLocaleDateString()}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{fmt(ep.duration_seconds)}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Play className="w-2.5 h-2.5 fill-current" />{fmtPlays(ep.plays_count)} plays</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium bg-[var(--accent)] text-[var(--bg)] rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer">
              <Play className="w-2.5 h-2.5 fill-current" />
              <span className="group-open/ep:hidden">Play episode</span>
              <span className="hidden group-open/ep:inline">Close player</span>
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkButton targetType="podcast" targetId={ep.id} />
            </div>
            <Link
              href={`/podcasts/${ep.slug}`}
              className="text-[10px] text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Show notes →
            </Link>
          </div>
        </div>
      </summary>

      <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
        <AudioPlayer
          title={ep.title}
          audioUrl={""} 
          durationSeconds={ep.duration_seconds}
        />
      </div>
    </details>
  );
}

// ── Section Header ─────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-[var(--accent)]">{icon}</div>
        <div>
          <h2 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">{title}</h2>
          {subtitle && <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: paramTab } = await searchParams;
  const activeTab = paramTab === "following" || paramTab === "shows" ? paramTab : "discover";

  const supabase = await createClient();

  const [showsRes, trendingRes, authRes] = await Promise.all([
    (supabase.from("podcast_shows") as any)
      .select("id, slug, title, description, cover_image_url, category, followers_count, episodes_count, author:profiles!author_id(display_name, username)")
      .eq("is_published", true)
      .order("followers_count", { ascending: false })
      .limit(10),
    (supabase.from("podcasts") as any)
      .select("id, slug, title, description, duration_seconds, plays_count, published_at, cover_image_url, show:podcast_shows!show_id(id, title, slug)")
      .order("plays_count", { ascending: false })
      .limit(10),
    supabase.auth.getUser()
  ]);

  const shows = showsRes.data || [];
  const trendingEpisodes = trendingRes.data || [];
  const user = authRes.data?.user;

  // Real logic would join to get actual following episodes. For now we will check if any are present.
  const followingEpisodes: any[] = []; // In a real app we'd fetch episodes from shows the user follows.
  const hasFollowing = followingEpisodes.length > 0;

  const tabs = [
    { id: "discover", label: "Discover", icon: <Flame className="w-3 h-3" /> },
    { id: "following", label: "Following", icon: <Users className="w-3 h-3" /> },
    { id: "shows", label: "All Shows", icon: <Radio className="w-3 h-3" /> },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
        <h1 className="text-sm font-medium text-[var(--ink)]">Developer Audio</h1>
        <div className="flex items-center gap-4">
          <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">FutureTech Podcasts</span>
          <Link
            href="/new/podcast"
            className="text-[var(--accent)] text-xs hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start a Show</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/podcasts?tab=${t.id}`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors",
              activeTab === t.id
                ? "bg-[var(--surface-high)] text-[var(--ink)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            )}
          >
            {t.icon}
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── TAB: DISCOVER ── */}
      {activeTab === "discover" && (
        <div className="space-y-8">
          {/* Featured Player */}
          {trendingEpisodes.length > 0 ? (
            <div>
              <SectionHeader
                icon={<TrendingUp className="w-4 h-4" />}
                title="Trending this week"
                subtitle={`${fmtPlays(trendingEpisodes[0].plays_count)} plays this week`}
              />
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--surface-high)] flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5 text-[var(--ink-muted)] opacity-50" />
                  </div>
                  <div>
                    <Link href={`/podcasts/show/${trendingEpisodes[0].show?.slug}`}>
                      <span className="text-[10px] font-semibold text-[#C9954C] flex items-center gap-1 mb-1 hover:opacity-80 transition-opacity">
                        <Radio className="w-2.5 h-2.5" />
                        {trendingEpisodes[0].show?.title}
                      </span>
                    </Link>
                    <h3 className="text-sm font-bold text-[var(--ink)] leading-snug mb-1">
                      {trendingEpisodes[0].title}
                    </h3>
                    <p className="text-[11px] text-[var(--ink-muted)] line-clamp-2 leading-relaxed">
                      {trendingEpisodes[0].description}
                    </p>
                  </div>
                </div>
                <AudioPlayer
                  title={trendingEpisodes[0].title}
                  audioUrl={""}
                  durationSeconds={trendingEpisodes[0].duration_seconds}
                />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
              No episodes yet. <Link href="/feed" className="text-[var(--accent)] hover:underline">Explore the feed.</Link>
            </div>
          )}

          {/* More Trending */}
          {trendingEpisodes.length > 1 && (
            <div>
              <SectionHeader
                icon={<Flame className="w-4 h-4" />}
                title="More trending episodes"
              />
              <div className="space-y-3">
                {trendingEpisodes.slice(1).map((ep: any) => (
                  <EpisodeRow key={ep.id} ep={ep} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Shows */}
          <div>
            <SectionHeader
              icon={<Radio className="w-4 h-4" />}
              title="Popular shows"
              subtitle="Community-created developer podcasts"
              action={
                <Link
                  href="/podcasts?tab=shows"
                  className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-0.5"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              }
            />
            {shows.length === 0 ? (
              <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
                No podcast shows found. <Link href="/feed" className="text-[var(--accent)] hover:underline">Explore the feed.</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shows.slice(0, 4).map((show: any) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: FOLLOWING ── */}
      {activeTab === "following" && (
        <div className="space-y-4">
          {!user ? (
            <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
              Sign in to see new episodes from creators you follow. <Link href="/login" className="text-[var(--accent)] hover:underline">Sign In</Link>
            </div>
          ) : hasFollowing ? (
            <>
              <SectionHeader
                icon={<Users className="w-4 h-4" />}
                title="New from shows you follow"
                subtitle={`${followingEpisodes.length} new episode${followingEpisodes.length !== 1 ? "s" : ""}`}
              />
              <div className="space-y-3">
                {followingEpisodes.map((ep) => (
                  <EpisodeRow key={ep.id} ep={ep} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
              No shows followed yet. <Link href="/podcasts?tab=shows" className="text-[var(--accent)] hover:underline">Browse shows.</Link>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: ALL SHOWS ── */}
      {activeTab === "shows" && (
        <div className="space-y-4">
          <SectionHeader
            icon={<Radio className="w-4 h-4" />}
            title="All shows"
            subtitle={`${shows.length} shows from the community`}
          />
          {shows.length === 0 ? (
            <div className="py-12 text-center text-[var(--ink-muted)] text-sm">
              No podcast shows found. <Link href="/feed" className="text-[var(--accent)] hover:underline">Explore the feed.</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shows.map((show: any) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
