"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/auth-modal";
import { Search, Bell, User, Plus, MoreHorizontal, LogIn, Megaphone, Sparkles, SunMoon } from "lucide-react";

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultMode, setAuthModalDefaultMode] = useState<"signin" | "signup">("signin");

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

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthModalDefaultMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="h-[56px] border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/feed" className="font-semibold text-sm text-[var(--ink)] tracking-tight hover:opacity-90 transition-opacity">
            FutureTech
          </Link>
        </div>

        {/* Header Search Input */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="search"
              placeholder="Search articles, questions, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isLoggedIn ? (
            <>
              {/* Minimal New Post Action (Logged In Only) */}
              <Link
                href="/new/post"
                className="px-2.5 py-1.5 border border-[var(--border)] hover:border-[var(--border-strong)] bg-transparent hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-sm)] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>New post</span>
              </Link>

              {/* Notifications Bell */}
              <button
                type="button"
                aria-label="Notifications"
                className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* User Profile Avatar Link */}
              <Link
                href="/profile/me"
                className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors"
                aria-label="Profile"
              >
                <User className="w-4 h-4 opacity-80" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Sign Up Button (Pill style matching user reference image) */}
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="bg-[#2B333D] hover:bg-[#38424F] text-[var(--ink)] font-semibold rounded-full px-4 py-1.5 text-xs transition-colors cursor-pointer"
              >
                Sign Up
              </button>

              {/* Log In Button (Pill style matching user reference image) */}
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="bg-[#D94F2B] hover:bg-[#E85B35] text-white font-semibold rounded-full px-4 py-1.5 text-xs transition-colors cursor-pointer"
              >
                Log In
              </button>

              {/* 3 Dots Dropdown Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label="More options"
                    className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-full transition-colors cursor-pointer ml-0.5"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] bg-[#1A1F25] border border-[var(--border-strong)] rounded-[var(--radius-md)] p-1.5 shadow-xl text-xs z-50 text-[var(--ink)] animate-in fade-in-50 zoom-in-95"
                    sideOffset={5}
                    align="end"
                  >
                    <DropdownMenu.Item
                      onClick={() => openAuthModal("signin")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span>Log In / Sign Up</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border)] my-1" />

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <Megaphone className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span>Advertise on FutureTech</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="flex-1">Try FutureTech Pro</span>
                      <span className="text-[9px] font-mono-numbers px-1.5 py-0.5 rounded bg-[var(--downvote-soft)] text-[var(--downvote)] font-bold">
                        BETA
                      </span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border)] my-1" />

                    <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] cursor-pointer outline-none transition-colors">
                      <SunMoon className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span>Display Mode</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </div>
      </header>

      {/* Auth Popup Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode={authModalDefaultMode}
      />
    </>
  );
}
