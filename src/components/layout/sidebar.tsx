"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
} from "lucide-react";

const discoverNav = [
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

export function Sidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const renderNavGroup = (title: string, items: typeof discoverNav) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[11px] font-medium text-[var(--ink-muted)]">
        {title}
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] transition-colors",
                isActive
                  ? "bg-[var(--surface-high)] text-[var(--ink)] font-medium"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              )}
            >
              <Icon className="w-3.5 h-3.5 opacity-70" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-3 hidden md:block select-none">
      {renderNavGroup("Discover", discoverNav)}

      {/* Show 'Yours' section only when Logged In */}
      {isLoggedIn && (
        <>
          <div className="my-3 border-t border-[var(--border)]" />
          {renderNavGroup("Yours", yoursNav)}
        </>
      )}

      <div className="my-3 border-t border-[var(--border)]" />
      {renderNavGroup("Community", communityNav)}
    </aside>
  );
}
