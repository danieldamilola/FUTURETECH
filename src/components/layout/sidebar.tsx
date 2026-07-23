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
  Mail,
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

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

  const openAuthOverlay = (mode: "signin" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // LOGGED OUT STATE: Render Auth Hero Card in sidebar; clicking either button triggers AuthModal overlay
  if (!isLoggedIn) {
    return (
      <>
        <aside className="w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 hidden md:block select-none">
          <div className="p-4 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] text-center space-y-4 shadow-md">
            <h2 className="text-base font-bold text-[var(--ink)] leading-snug tracking-tight">
              Join the developer network
            </h2>

            <div className="space-y-2.5 pt-1">
              {/* Continue with GitHub Button (Triggers Auth Overlay) */}
              <button
                type="button"
                onClick={() => openAuthOverlay("signin")}
                className="w-full py-2 px-3 bg-[#E7EAE6] hover:bg-white text-[#12151A] font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              {/* Continue with Email Button (Triggers Auth Overlay) */}
              <button
                type="button"
                onClick={() => openAuthOverlay("signin")}
                className="w-full py-2 px-3 bg-[#E7EAE6] hover:bg-white text-[#12151A] font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#12151A]" />
                <span>Continue with Email</span>
              </button>
            </div>

            <p className="text-[10px] text-[var(--ink-muted)] leading-relaxed pt-2 border-t border-[var(--border)]">
              By continuing, you agree to our{" "}
              <a href="#" className="underline text-[var(--accent)] hover:text-[var(--ink)]">User Agreement</a> and acknowledge that you understand the{" "}
              <a href="#" className="underline text-[var(--accent)] hover:text-[var(--ink)]">Privacy Policy</a>.
            </p>
          </div>
        </aside>

        {/* Auth Popup Modal Overlay */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
          defaultMode={authModalMode}
        />
      </>
    );
  }

  // LOGGED IN STATE: Render full sidebar navigation
  const renderNavGroup = (title: string, items: typeof discoverNav) => (
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
    <aside className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-3 hidden md:block select-none">
      {renderNavGroup("Discover", discoverNav)}
      <div className="my-3 border-t border-[var(--border)]" />
      {renderNavGroup("Yours", yoursNav)}
      <div className="my-3 border-t border-[var(--border)]" />
      {renderNavGroup("Community", communityNav)}
    </aside>
  );
}
