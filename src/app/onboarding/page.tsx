"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { HashtagInput } from "@/components/ui/hashtag-input";
import {
  User, Globe, Code2, ChevronRight, CheckCircle2,
  Sparkles, ArrowLeft, Camera, ExternalLink,
} from "lucide-react";

type Step = 1 | 2 | 3;

const TECH_SUGGESTIONS = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java", "C++",
  "React", "Next.js", "Vue", "Svelte", "Node.js", "Bun", "Deno",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
  "Docker", "Kubernetes", "Terraform", "AWS", "GCP", "Cloudflare",
  "GraphQL", "REST", "gRPC", "WebSockets",
  "WebAssembly", "Linux", "Windows", "macOS", "Android", "iOS",
  "Git", "GitHub", "Nix", "iPhone", "Samsung", "Huawei", "Hardware",
];

const INTEREST_OPTIONS = [
  { id: "systems", label: "Systems Programming" },
  { id: "web", label: "Web Development" },
  { id: "ml", label: "AI & Machine Learning" },
  { id: "devops", label: "DevOps & Infrastructure" },
  { id: "security", label: "Security" },
  { id: "mobile", label: "Mobile Development" },
  { id: "open-source", label: "Open Source" },
  { id: "career", label: "Career & Interviews" },
  { id: "data", label: "Data Engineering" },
  { id: "gamedev", label: "Game Development" },
];

const inputCls =
  "w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-faint)]";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — Profile
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Step 2 — Links & Socials
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [location, setLocation] = useState("");

  // Step 3 — Tech Stack & Interests
  const [techStack, setTechStack] = useState<string[]>(["TypeScript", "React"]);
  const [interests, setInterests] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill display_name from auth session (OAuth users get it from GitHub)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/feed");
        return;
      }
      const meta = user.user_metadata;
      if (meta?.full_name && !displayName) setDisplayName(meta.full_name);
      if (meta?.user_name && !username) setUsername(meta.user_name);
      if (meta?.avatar_url && !avatarUrl) setAvatarUrl(meta.avatar_url);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (techStack.length === 0) {
      setError("Please add at least one technology to your stack.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const result = await completeOnboarding({
      bio,
      websiteUrl,
      githubUrl,
      twitterUrl: twitterUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      location: location || undefined,
      techStack,
    } as Parameters<typeof completeOnboarding>[0]);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
    } else {
      router.push("/feed");
      router.refresh();
    }
  };

  const stepTitles: Record<Step, { title: string; subtitle: string; icon: React.ReactNode }> = {
    1: {
      title: "Set up your profile",
      subtitle: "How you appear to the community",
      icon: <User className="w-5 h-5" />,
    },
    2: {
      title: "Add your links",
      subtitle: "Let people find you across the web",
      icon: <Globe className="w-5 h-5" />,
    },
    3: {
      title: "Your tech stack",
      subtitle: "What you build and care about",
      icon: <Code2 className="w-5 h-5" />,
    },
  };

  const currentStep = stepTitles[step];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-start justify-center pt-12 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            FutureTech
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] mb-1">Welcome to the community</h1>
          <p className="text-xs text-[var(--ink-muted)]">
            Take 60 seconds to set up your developer profile. You can update everything in Settings later.
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-[11px] font-medium transition-all cursor-default ${
                  step === s
                    ? "bg-[var(--accent)] text-[var(--bg)]"
                    : step > s
                    ? "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30"
                    : "bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--border)]"
                }`}
              >
                {step > s ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span className="font-mono-numbers">{s}</span>
                )}
                <span className="hidden sm:inline">
                  {s === 1 ? "Profile" : s === 2 ? "Links" : "Stack"}
                </span>
              </div>
              {s < 3 && (
                <ChevronRight className="w-3 h-3 text-[var(--ink-faint)] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--ink)]">{currentStep.title}</h2>
              <p className="text-[11px] text-[var(--ink-muted)]">{currentStep.subtitle}</p>
            </div>
            <div className="ml-auto text-[11px] font-mono-numbers text-[var(--ink-muted)]">
              {step} / 3
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 p-2.5 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
              {error}
            </div>
          )}

          {/* ── STEP 1: Profile ── */}
          {step === 1 && (
            <div className="p-6 space-y-4 text-xs">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-[var(--ink-muted)] opacity-40" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--surface-high)] border border-[var(--border)] flex items-center justify-center">
                    <Camera className="w-2.5 h-2.5 text-[var(--ink-muted)]" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    Avatar URL (optional)
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://cdn.example.com/you.jpg"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Rivera"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="alex_dev"
                      className={`${inputCls} pl-6`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  maxLength={280}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Software engineer working on distributed systems, TypeScript, and Rust. Writing about WebAssembly and edge computing."
                  className={`${inputCls} resize-none`}
                />
                <div className="text-right text-[10px] font-mono-numbers text-[var(--ink-faint)] mt-1">
                  {bio.length}/280
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!displayName.trim() || !username.trim()) {
                    setError("Display name and username are required.");
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="w-full py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Links ── */}
          {step === 2 && (
            <div className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    <ExternalLink className="inline w-3 h-3 mr-1" />
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    <Globe className="inline w-3 h-3 mr-1" />
                    Personal Website / Blog
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                      X / Twitter
                    </label>
                    <input
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://x.com/handle"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/you"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1">
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Lagos, Nigeria"
                    className={inputCls}
                  />
                </div>
              </div>

              <p className="text-[10px] text-[var(--ink-faint)] pt-1">
                All links are optional. They appear publicly on your profile page.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] rounded-[var(--radius-sm)] transition-colors cursor-pointer text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => { setError(null); setStep(3); }}
                  className="flex-1 py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Continue
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Tech Stack ── */}
          {step === 3 && (
            <div className="p-6 space-y-5 text-xs">
              {/* Interests */}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-2">
                  Topics you care about
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`px-2.5 py-1 rounded-[var(--radius-sm)] border text-[11px] font-medium transition-colors cursor-pointer ${
                        interests.includes(opt.id)
                          ? "bg-[var(--accent)] text-[var(--bg)] border-transparent"
                          : "bg-[var(--bg)] text-[var(--ink-muted)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--ink)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-2">
                  Your tech stack
                </label>
                <HashtagInput
                  tags={techStack}
                  onChange={setTechStack}
                  maxTags={15}
                  suggestions={TECH_SUGGESTIONS}
                  placeholder="Add a technology..."
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] rounded-[var(--radius-sm)] transition-colors cursor-pointer text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    "Saving profile..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Finish & Enter FutureTech
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push("/feed")}
            className="text-[11px] text-[var(--ink-faint)] hover:text-[var(--ink-muted)] transition-colors cursor-pointer"
          >
            Skip for now — I&apos;ll complete this later in Settings
          </button>
        </div>
      </div>
    </div>
  );
}
