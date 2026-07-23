"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import {
  Rss,
  Compass,
  FileText,
  HelpCircle,
  Headphones,
  FileEdit,
  Bookmark,
  Settings,
  Users,
  Briefcase,
  Sparkles,
  BookOpen,
  Code2,
} from "lucide-react";

const feedsNav = [
  { name: "Feed", href: "/feed", icon: Rss },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Articles", href: "/articles", icon: FileText },
  { name: "Questions", href: "/questions", icon: HelpCircle },
  { name: "Podcasts", href: "/podcasts", icon: Headphones },
];

const yoursNav = [
  { name: "Drafts", href: "/drafts", icon: FileEdit },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Settings", href: "/settings", icon: Settings },
];

const communityNav = [
  { name: "Mentors", href: "/mentors", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
];

const resourcesNav = [
  { name: "Guidelines", href: "/explore", icon: BookOpen },
  { name: "Developers", href: "/explore", icon: Code2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderNavGroup = (title: string, items: typeof feedsNav) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--ink-muted)] uppercase">
        {title}
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/feed" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] transition-colors",
                isActive
                  ? "bg-[var(--surface-high)] text-[var(--ink)] font-medium border-l-2 border-l-[var(--accent)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              )}
            >
              <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="w-[230px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-3 hidden md:block select-none space-y-4">
        {/* Guest Welcome Banner (Logged-Out Only) */}
        {!isLoggedIn && (
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border-strong)] space-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>Developer Hub</span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
              Read technical articles, ask questions, and book 1-on-1 mentorship.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              Join Community
            </button>
          </div>
        )}

        {renderNavGroup("Feeds & Reading", feedsNav)}

        {/* Show 'Your Workspace' section only when Logged In */}
        {isLoggedIn && (
          <>
            <div className="my-3 border-t border-[var(--border)]" />
            {renderNavGroup("Your Workspace", yoursNav)}
          </>
        )}

        <div className="my-3 border-t border-[var(--border)]" />
        {renderNavGroup("Community & Careers", communityNav)}

        <div className="my-3 border-t border-[var(--border)]" />
        {renderNavGroup("Resources", resourcesNav)}
      </aside>

      {/* Auth Modal Trigger for Guest Banner */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signup"
      />
    </>
  );
}
