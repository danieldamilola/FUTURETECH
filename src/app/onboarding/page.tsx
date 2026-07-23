"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["TypeScript", "React", "Next.js"]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (techStackInput.trim() && techStack.length < 10) {
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    const result = await completeOnboarding({
      bio,
      websiteUrl,
      githubUrl,
      techStack,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-sm font-medium text-[var(--ink)]">Complete Profile</h1>
          <p className="text-xs text-[var(--ink-muted)]">Step {step} of 2</p>
        </div>
        <div className="flex gap-1 font-mono-numbers text-xs text-[var(--accent)] font-semibold">
          <span>{step}</span>
          <span>/</span>
          <span>2</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">Bio (max 280 chars)</label>
            <textarea
              rows={4}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Software engineer working on distributed systems, TypeScript, and Rust..."
              className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="text-right text-[11px] font-mono-numbers text-[var(--ink-muted)] mt-1">
              {bio.length}/280
            </div>
          </div>

          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">Website URL</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity cursor-pointer mt-2"
          >
            Continue to Tech Stack →
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">
              Tech Stack Tags (max 10)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="e.g. Postgres, Docker"
                className="flex-1 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-[var(--surface-high)] text-[var(--ink)] font-medium rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)]"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {techStack.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] text-[11px] font-mono-numbers"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[var(--ink-muted)] hover:text-[var(--danger)]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-md)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Finish Onboarding"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
