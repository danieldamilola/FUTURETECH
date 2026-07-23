"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/auth-modal";
import { Search, Bell, User, Plus } from "lucide-react";

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");
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
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 opacity-70" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Popup Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
    </>
  );
}
