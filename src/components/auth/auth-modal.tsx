"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createClient } from "@/lib/supabase/client";
import { signInWithEmail, signUpWithEmail } from "@/lib/actions/auth";
import { X, Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthModal({
  isOpen,
  onOpenChange,
  defaultMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGitHubAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (mode === "signup") {
      formData.append("username", username);
      formData.append("displayName", displayName);
    }

    const result = mode === "signin"
      ? await signInWithEmail(formData)
      : await signUpWithEmail(formData);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      onOpenChange(false);
      window.location.reload();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#12151A] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-6 z-50 shadow-2xl text-[var(--ink)] focus:outline-none">
          <Dialog.Title className="sr-only">Authentication</Dialog.Title>
          <div className="flex justify-end">
            <Dialog.Close className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] leading-tight mb-1">
              {mode === "signin" ? "Welcome back" : "Join the developer network"}
            </h2>
            <p className="text-xs text-[var(--ink-muted)]">
              {mode === "signin"
                ? "Sign in to access your bookmarks, drafts, and feed."
                : "Create an account to start writing and participating."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs text-center">
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <div className="space-y-3">
              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={handleGitHubAuth}
                className="w-full py-2.5 px-4 bg-[var(--surface-high)] hover:bg-[var(--surface-hover)] border border-[var(--border-strong)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-md)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              {/* Continue with Email Button */}
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-md)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                <span>Continue with Email</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-[var(--ink-muted)] mb-1 font-medium">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="alex_dev"
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--ink-muted)] mb-1 font-medium">Display Name</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* Switcher & Legal Footnote */}
          <div className="mt-6 text-center text-[11px] text-[var(--ink-muted)] space-y-3 border-t border-[var(--border)] pt-4">
            <div>
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="text-[var(--accent)] hover:underline font-medium cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            <p className="text-[10px] leading-normal opacity-70">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-[var(--ink)]">User Agreement</a> and acknowledge that you understand the{" "}
              <a href="#" className="underline hover:text-[var(--ink)]">Privacy Policy</a>.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
