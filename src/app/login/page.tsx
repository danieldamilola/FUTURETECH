"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signInWithEmail(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="max-w-sm mx-auto my-12 p-6 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
      <div className="text-center mb-6">
        <h1 className="text-lg font-medium text-[var(--ink)] mb-1">Welcome back</h1>
        <p className="text-xs text-[var(--ink-muted)]">Sign in to your FutureTech account</p>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
          <div className="flex items-center justify-between mb-1">
            <label className="text-[var(--ink-muted)] font-medium">Password</label>
            <Link href="/forgot-password" className="text-[var(--accent)] hover:underline text-[11px]">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[var(--ink-muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
}
