"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import {
  Rss,
  Compass,
  HelpCircle,
  Users,
  Menu,
  X,
  FileText,
  Headphones,
  Briefcase,
  Bookmark,
  Settings,
  Sparkles,
  LogOut,
  User,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user) {
        setUserDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "Developer");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        setUserDisplayName(session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "Developer");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await signOut(); // Clear server cookies
    setIsDrawerOpen(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Feed", href: "/feed", icon: Rss },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Questions", href: "/questions", icon: HelpCircle },
    { name: "Mentors", href: "/mentors", icon: Users },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile (<768px) */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-[#12151A]/95 backdrop-blur-md border-t border-[var(--border)] z-40 px-2 flex items-center justify-around select-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/feed" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-full gap-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )}
            >
              <Icon className="w-4 h-4 opacity-90" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Menu Button to trigger Drawer */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-full gap-1 text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4 opacity-90" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Mobile Sliding Drawer Overlay */}
      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in md:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#12151A] border-r border-[var(--border-strong)] p-5 z-50 flex flex-col justify-between shadow-2xl text-[var(--ink)] md:hidden focus:outline-none">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <Link href="/feed" onClick={() => setIsDrawerOpen(false)} className="font-semibold text-sm text-[var(--ink)]">
                  FutureTech
                </Link>
                <Dialog.Close className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer">
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>

              {/* Guest Card or Member Badge */}
              {!isLoggedIn ? (
                <div className="my-4 p-3.5 rounded-[var(--radius-md)] bg-[#16191E] border border-[var(--border-strong)] text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Join FutureTech</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                    Access technical posts, bookmarks, and mentorship.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                </div>
              ) : (
                <div className="my-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-xs flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-[var(--ink)] truncate">
                      {userDisplayName}
                    </div>
                    <div className="text-[10px] text-[var(--ink-muted)]">Member</div>
                  </div>
                </div>
              )}

              {/* Navigation Links inside Drawer */}
              <div className="space-y-1 text-xs font-medium">
                <Link
                  href="/articles"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                >
                  <FileText className="w-4 h-4 opacity-70" />
                  <span>Articles</span>
                </Link>

                <Link
                  href="/podcasts"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                >
                  <Headphones className="w-4 h-4 opacity-70" />
                  <span>Podcasts</span>
                </Link>

                <Link
                  href="/jobs"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                >
                  <Briefcase className="w-4 h-4 opacity-70" />
                  <span>Jobs Board</span>
                </Link>

                {isLoggedIn && (
                  <>
                    <div className="my-2 border-t border-[var(--border)]" />
                    <Link
                      href="/bookmarks"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                    >
                      <Bookmark className="w-4 h-4 opacity-70" />
                      <span>Bookmarks</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                    >
                      <Settings className="w-4 h-4 opacity-70" />
                      <span>Settings</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {isLoggedIn && (
              <div className="pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--danger)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultMode="signin"
      />
    </>
  );
}
