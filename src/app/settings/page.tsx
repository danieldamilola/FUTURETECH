"use client";

import React, { useState } from "react";
import { User, Sparkles, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Alex Rivera");
  const [bio, setBio] = useState("Senior Fullstack Engineer & Systems Enthusiast.");
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexrivera");
  const [twitterUrl, setTwitterUrl] = useState("https://x.com/alexrivera_dev");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <User className="w-4 h-4" />
            <span>Account Settings</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            Profile & Preferences
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Manage your developer profile, social connections, and membership.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* FutureTech Pro Membership Card */}
      <div className="p-4 rounded-[var(--radius-md)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-high)] text-[var(--accent)] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
              <span>FutureTech Pro</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-numbers bg-[var(--surface-high)] text-[var(--accent)] font-bold uppercase">
                Free Tier Active
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5">
              Enjoy ad-free reading, priority mentorship slots, and pro author badge.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Redirecting to Stripe Pro Checkout...")}
          className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          Upgrade Pro ($9/mo)
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[var(--ink)] border-b border-[var(--border)] pb-2">
          Public Profile Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[var(--ink-muted)] mb-1 font-medium">GitHub Profile URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[var(--ink-muted)] mb-1 font-medium">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
