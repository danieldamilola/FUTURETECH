"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createPodcastShow, createPodcastEpisode } from "@/lib/actions/podcasts";
import { HashtagInput } from "@/components/ui/hashtag-input";
import {
  ArrowLeft, Mic, Radio, Plus, CheckCircle2, ChevronRight,
  Image as ImageIcon, Link as LinkIcon, Clock
} from "lucide-react";

type Step = "show" | "episode" | "done";

const CATEGORIES = [
  "Engineering", "AI/ML", "Systems", "Language", "Infrastructure",
  "DevOps", "Security", "Career", "Open Source", "Product",
];

const inputCls = "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-faint)]";
const labelCls = "block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1.5";

export default function NewPodcastPage() {
  const [step, setStep] = useState<Step>("show");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show fields
  const [showTitle, setShowTitle] = useState("");
  const [showDescription, setShowDescription] = useState("");
  const [showCategory, setShowCategory] = useState("Engineering");
  const [showCoverUrl, setShowCoverUrl] = useState("");
  const [createdShowId, setCreatedShowId] = useState<string | null>(null);
  const [createdShowSlug, setCreatedShowSlug] = useState<string | null>(null);

  // Episode fields
  const [epTitle, setEpTitle] = useState("");
  const [epDescription, setEpDescription] = useState("");
  const [epAudioUrl, setEpAudioUrl] = useState("");
  const [epDurationMins, setEpDurationMins] = useState("");
  const [epDurationSecs, setEpDurationSecs] = useState("");
  const [epEpisodeNumber, setEpEpisodeNumber] = useState("");
  const [epCoverUrl, setEpCoverUrl] = useState("");
  const [epShowNotes, setEpShowNotes] = useState("");
  const [epTags, setEpTags] = useState<string[]>(["Engineering"]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTitle.trim() || !showDescription.trim()) {
      setError("Title and description are required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createPodcastShow({
      title: showTitle,
      slug: generateSlug(showTitle),
      description: showDescription,
      category: showCategory,
      coverImageUrl: showCoverUrl || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Failed to create show.");
    } else {
      setCreatedShowId(result.data!.id);
      setCreatedShowSlug(result.data!.slug);
      setStep("episode");
    }
  };

  const handlePublishEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdShowId) return;
    if (!epTitle.trim() || !epAudioUrl.trim()) {
      setError("Episode title and audio URL are required.");
      return;
    }

    const totalSeconds =
      (parseInt(epDurationMins || "0") * 60) +
      parseInt(epDurationSecs || "0");

    if (totalSeconds < 10) {
      setError("Please enter a valid episode duration.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createPodcastEpisode({
      showId: createdShowId,
      title: epTitle,
      slug: generateSlug(epTitle),
      description: epDescription,
      audioUrl: epAudioUrl,
      durationSeconds: totalSeconds,
      episodeNumber: epEpisodeNumber ? parseInt(epEpisodeNumber) : undefined,
      showNotesHtml: epShowNotes ? `<p>${epShowNotes}</p>` : undefined,
      coverImageUrl: epCoverUrl || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Failed to publish episode.");
    } else {
      setStep("done");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <Link
          href="/podcasts"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Podcasts
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink)]">
          <Mic className="w-4 h-4 text-[var(--accent)]" />
          Start a New Show
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { key: "show", label: "1. Create Show", icon: <Radio className="w-3.5 h-3.5" /> },
          { key: "episode", label: "2. Publish Episode", icon: <Mic className="w-3.5 h-3.5" /> },
          { key: "done", label: "3. Live!", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        ].map((s, i) => (
          <React.Fragment key={s.key}>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] font-medium transition-colors ${
                step === s.key
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : step === "done" || (step === "episode" && s.key === "show")
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : "bg-[var(--surface)] text-[var(--ink-muted)]"
              }`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < 2 && <ChevronRight className="w-3 h-3 text-[var(--ink-faint)] shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      {/* ── STEP 1: Create Show ── */}
      {step === "show" && (
        <form onSubmit={handleCreateShow} className="space-y-5 text-xs">
          <div className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h2 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
              Your Podcast Show Details
            </h2>

            <div>
              <label className={labelCls}>Show Title</label>
              <input
                type="text"
                required
                value={showTitle}
                onChange={(e) => setShowTitle(e.target.value)}
                placeholder="e.g. The Rust Runtime"
                className={inputCls}
              />
              {showTitle && (
                <p className="mt-1 text-[10px] text-[var(--ink-faint)] font-mono-numbers">
                  Slug: /podcasts/show/{generateSlug(showTitle)}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                required
                rows={3}
                value={showDescription}
                onChange={(e) => setShowDescription(e.target.value)}
                placeholder="What is your show about? Who is it for? Be specific — this appears on your show page and in search."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={showCategory}
                  onChange={(e) => setShowCategory(e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>
                  <ImageIcon className="inline w-3 h-3 mr-1" />
                  Cover Art URL (optional)
                </label>
                <input
                  type="url"
                  value={showCoverUrl}
                  onChange={(e) => setShowCoverUrl(e.target.value)}
                  placeholder="https://your-cdn.com/cover.jpg"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="pt-1 text-[11px] text-[var(--ink-muted)] p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--ink)] mb-1">Publishing guidelines</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Episodes must be technical — code, architecture, engineering, or career.</li>
                <li>Host or guest must be real. No AI-generated voice content.</li>
                <li>Audio must be hosted on a public URL (Cloudflare R2, S3, Transistor, Anchor, etc).</li>
                <li>Cover art: 1:1 ratio, at least 400×400px.</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? "Creating show..." : "Create Show & Continue"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2: Publish Episode ── */}
      {step === "episode" && (
        <form onSubmit={handlePublishEpisode} className="space-y-5 text-xs">
          {createdShowSlug && (
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Show <strong>&ldquo;{showTitle}&rdquo;</strong> created! Now publish your first episode.
              </span>
            </div>
          )}

          <div className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h2 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
              Episode Details
            </h2>

            <div>
              <label className={labelCls}>Episode Title</label>
              <input
                type="text"
                required
                value={epTitle}
                onChange={(e) => setEpTitle(e.target.value)}
                placeholder="e.g. Arc<Mutex<T>> — when it's wrong and what to use instead"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Episode Description / Summary</label>
              <textarea
                rows={2}
                value={epDescription}
                onChange={(e) => setEpDescription(e.target.value)}
                placeholder="Brief summary of what's covered in this episode..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <LinkIcon className="inline w-3 h-3 mr-1" />
                  Audio File URL (required)
                </label>
                <input
                  type="url"
                  required
                  value={epAudioUrl}
                  onChange={(e) => setEpAudioUrl(e.target.value)}
                  placeholder="https://cdn.example.com/episode-1.mp3"
                  className={inputCls}
                />
                <p className="mt-1 text-[10px] text-[var(--ink-faint)]">MP3 or AAC. Must be a direct public URL.</p>
              </div>

              <div>
                <label className={labelCls}>
                  <Clock className="inline w-3 h-3 mr-1" />
                  Episode Duration
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={epDurationMins}
                      onChange={(e) => setEpDurationMins(e.target.value)}
                      placeholder="47"
                      className={inputCls}
                    />
                    <span className="text-[var(--ink-muted)] shrink-0">min</span>
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={epDurationSecs}
                      onChange={(e) => setEpDurationSecs(e.target.value)}
                      placeholder="30"
                      className={inputCls}
                    />
                    <span className="text-[var(--ink-muted)] shrink-0">sec</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Episode Number (optional)</label>
                <input
                  type="number"
                  min="1"
                  value={epEpisodeNumber}
                  onChange={(e) => setEpEpisodeNumber(e.target.value)}
                  placeholder="e.g. 12"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <ImageIcon className="inline w-3 h-3 mr-1" />
                  Episode Cover Art URL (optional)
                </label>
                <input
                  type="url"
                  value={epCoverUrl}
                  onChange={(e) => setEpCoverUrl(e.target.value)}
                  placeholder="Defaults to show cover art"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Hashtag Topics */}
            <HashtagInput tags={epTags} onChange={setEpTags} maxTags={5} />

            {/* Show Notes */}
            <div>
              <label className={labelCls}>Show Notes (optional)</label>
              <textarea
                rows={4}
                value={epShowNotes}
                onChange={(e) => setEpShowNotes(e.target.value)}
                placeholder="Links, timestamps, guest bios, code snippets referenced in the episode..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("show")}
              className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? "Publishing..." : "Publish Episode"}
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: Done ── */}
      {step === "done" && (
        <div className="py-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[var(--success)]/15 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-[var(--success)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--ink)] mb-1">Your episode is live!</h2>
            <p className="text-xs text-[var(--ink-muted)]">
              <strong>&ldquo;{epTitle}&rdquo;</strong> has been published to{" "}
              <strong>&ldquo;{showTitle}&rdquo;</strong>.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {createdShowSlug && (
              <Link
                href={`/podcasts/show/${createdShowSlug}`}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--accent)] text-[var(--bg)] rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                View your show
              </Link>
            )}
            <Link
              href="/podcasts"
              className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] text-[var(--ink)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              Back to Podcasts
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep("episode");
                setEpTitle(""); setEpDescription(""); setEpAudioUrl("");
                setEpDurationMins(""); setEpDurationSecs(""); setEpShowNotes("");
              }}
              className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] text-[var(--ink)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add another episode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
