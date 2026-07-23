"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { createClient } from "@/lib/supabase/client";
import { signInWithEmail, signUpWithEmail } from "@/lib/actions/auth";
import { X, Mail, ArrowLeft } from "lucide-react";

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
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Sync mode when defaultMode prop changes (e.g. opened via "Sign Up" vs "Log In")
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setShowEmailForm(false);
    }
  }, [isOpen, defaultMode]);

  // Auto-focus email input when email form becomes visible
  useEffect(() => {
    if (showEmailForm) {
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [showEmailForm]);

  const handleGitHubAuth = async () => {
    setIsGithubLoading(true);
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

    const result =
      mode === "signin"
        ? await signInWithEmail(formData)
        : await signUpWithEmail(formData);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
    } else {
      onOpenChange(false);
      if (mode === "signup") {
        // New user: go to onboarding
        router.push("/onboarding");
      } else {
        // Returning user: refresh current page to pick up session
        router.refresh();
      }
    }
  };

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError(null);
    setShowEmailForm(false);
  };

  const inputCls =
    "w-full px-3 py-2 bg-[#0D1117] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors text-xs";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#12151A] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-6 z-50 shadow-2xl text-[var(--ink)] focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150">
          <Dialog.Title className="sr-only">Authentication</Dialog.Title>

          {/* Close */}
          <div className="flex justify-end -mt-1 -mr-1 mb-2">
            <Dialog.Close className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1.5 transition-colors cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--surface)]">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-2">FutureTech</div>
            <h2 className="text-base font-bold text-[var(--ink)] leading-tight mb-1">
              {mode === "signin" ? "Welcome back" : "Join the developer network"}
            </h2>
            <p className="text-xs text-[var(--ink-muted)]">
              {mode === "signin"
                ? "Sign in to access your bookmarks, drafts, and feed."
                : "Create an account to start writing and participating."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs text-center">
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <div className="space-y-3">
              {/* GitHub OAuth */}
              <button
                type="button"
                onClick={handleGitHubAuth}
                disabled={isGithubLoading}
                className="w-full py-2.5 px-4 bg-[var(--surface-high)] hover:bg-[var(--surface-hover)] border border-[var(--border-strong)] text-[var(--ink)] text-xs font-semibold rounded-[var(--radius-sm)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGithubLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-[var(--ink-muted)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-xs font-medium rounded-[var(--radius-sm)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                Continue with Email
              </button>

              {/* Divider + mode switch */}
              <div className="text-center text-[11px] text-[var(--ink-muted)] pt-1">
                {mode === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => switchMode("signup")} className="text-[var(--accent)] hover:underline font-medium cursor-pointer">
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("signin")} className="text-[var(--accent)] hover:underline font-medium cursor-pointer">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="flex items-center gap-1 text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer mb-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </button>

              {mode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[var(--ink-muted)] mb-1 font-medium text-[11px]">Username</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        placeholder="alex_dev"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--ink-muted)] mb-1 font-medium text-[11px]">Display Name</label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Alex Rivera"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium text-[11px]">Email address</label>
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-[var(--ink-muted)] mb-1 font-medium text-[11px]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? "Processing..."
                  : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </button>

              <div className="text-center text-[11px] text-[var(--ink-muted)]">
                {mode === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => switchMode("signup")} className="text-[var(--accent)] hover:underline font-medium cursor-pointer">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("signin")} className="text-[var(--accent)] hover:underline font-medium cursor-pointer">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </form>
          )}

          {/* Legal */}
          <p className="mt-4 text-[10px] text-center text-[var(--ink-muted)] leading-normal opacity-60">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-[var(--ink)]">Terms</a> and{" "}
            <a href="/privacy" className="underline hover:text-[var(--ink)]">Privacy Policy</a>.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
