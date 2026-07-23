"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  Search, Bell, Plus, MoreHorizontal, LogIn, Command, Code2,
  Activity, ChevronDown, PenLine, HelpCircle, Mic, LogOut,
  Settings, User, UserCircle2,
} from "lucide-react";

interface UserProfile {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export function TopNav() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultMode, setAuthModalDefaultMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        // Fetch profile separately for username / display_name / avatar
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("id", user.id)
          .single();
        if (profile) setUserProfile(profile as UserProfile);
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        // Re-fetch profile on auth change
        supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setUserProfile(profile as UserProfile);
          });
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthModalDefaultMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    router.push("/feed");
    router.refresh();
  };

  // Avatar initials fallback
  const initials = userProfile?.display_name
    ? userProfile.display_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "ME";

  const profileHref = userProfile?.username
    ? `/profile/${userProfile.username}`
    : "/profile/me";

  return (
    <>
      <header className="h-[56px] border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-40 px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/feed"
            className="font-bold text-sm text-[var(--ink)] tracking-tight hover:opacity-80 transition-opacity"
          >
            FutureTech
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="search"
              placeholder="Search articles, questions, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono-numbers text-[var(--ink-muted)] pointer-events-none">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isLoggedIn ? (
            <>
              {/* ── Create (+ dropdown) ── */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border)] hover:border-[var(--border-strong)] bg-transparent hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                    aria-label="Create new content"
                  >
                    <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Create</span>
                    <ChevronDown className="w-3 h-3 text-[var(--ink-muted)]" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[190px] bg-[#1A1F25] border border-[var(--border-strong)] rounded-[var(--radius-md)] p-1.5 shadow-xl text-xs z-50 text-[var(--ink)] animate-in fade-in-0 zoom-in-95 duration-100"
                    sideOffset={6}
                    align="end"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/new/post"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                      >
                        <PenLine className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <div>
                          <div className="font-medium">Write Article</div>
                          <div className="text-[10px] text-[var(--ink-muted)]">Share knowledge or tutorials</div>
                        </div>
                      </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <Link
                        href="/new/question"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#C9954C]" />
                        <div>
                          <div className="font-medium">Ask a Question</div>
                          <div className="text-[10px] text-[var(--ink-muted)]">Get help from the community</div>
                        </div>
                      </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <Link
                        href="/new/podcast"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-[var(--success)]" />
                        <div>
                          <div className="font-medium">Start a Podcast</div>
                          <div className="text-[10px] text-[var(--ink-muted)]">Create a show or episode</div>
                        </div>
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* ── User Avatar / Dropdown ── */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--surface-high)] text-[var(--accent)] text-[10px] font-bold font-mono-numbers hover:ring-2 hover:ring-[var(--accent)]/40 transition-all cursor-pointer overflow-hidden"
                  >
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[210px] bg-[#1A1F25] border border-[var(--border-strong)] rounded-[var(--radius-md)] p-1.5 shadow-xl text-xs z-50 text-[var(--ink)] animate-in fade-in-0 zoom-in-95 duration-100"
                    sideOffset={6}
                    align="end"
                  >
                    {/* User info header */}
                    {userProfile && (
                      <>
                        <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                          <div className="font-semibold text-[var(--ink)]">{userProfile.display_name}</div>
                          <div className="text-[10px] text-[var(--ink-muted)] font-mono-numbers">@{userProfile.username}</div>
                        </div>
                      </>
                    )}

                    <DropdownMenu.Item asChild>
                      <Link
                        href={profileHref}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                      >
                        <UserCircle2 className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border)] my-1" />

                    <DropdownMenu.Item
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--danger)]/10 text-[var(--danger)] cursor-pointer outline-none transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            /* ── LOGGED OUT ── */
            <div className="flex items-center gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="bg-[var(--surface-high)] hover:bg-[var(--surface-hover)] border border-[var(--border-strong)] text-[var(--ink)] font-medium rounded-[var(--radius-sm)] px-3 py-1.5 transition-colors cursor-pointer"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="bg-[var(--accent)] hover:opacity-90 text-[var(--bg)] font-medium rounded-[var(--radius-sm)] px-3 py-1.5 transition-opacity cursor-pointer"
              >
                Log In
              </button>

              {/* More options (logged-out) */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label="More options"
                    className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[190px] bg-[#1A1F25] border border-[var(--border-strong)] rounded-[var(--radius-md)] p-1.5 shadow-xl text-xs z-50 text-[var(--ink)] animate-in fade-in-0 zoom-in-95 duration-100"
                    sideOffset={5}
                    align="end"
                  >
                    <DropdownMenu.Item
                      onClick={() => openAuthModal("signin")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Log In / Register</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border)] my-1" />

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <Command className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span className="flex-1">Keyboard Shortcuts</span>
                      <span className="text-[10px] font-mono-numbers text-[var(--ink-muted)]">⌘K</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <Code2 className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span>API & Developers</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <Activity className="w-3.5 h-3.5 text-[var(--success)]" />
                      <span>Platform Status</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode={authModalDefaultMode}
      />
    </>
  );
}
