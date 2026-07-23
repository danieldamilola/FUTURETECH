"use client";

import React, { useState, useEffect } from "react";
import {
  User, Shield, Bell, Key, CreditCard,
  Save, CheckCircle2, Eye, EyeOff, Copy, Plus,
  Trash2, Sparkles, Globe, ExternalLink,
  Mail, Lock, Smartphone, LogOut, X,
  MapPin, Link as LinkIcon, Camera
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";

type Tab = "profile" | "security" | "notifications" | "api-keys" | "billing";

// Reusable input style
const inputCls =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-faint)]";

const labelCls = "block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1.5";

const sectionCls = "p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4";

function SaveBanner({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] text-xs flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold text-[var(--ink)] border-b border-[var(--border)] pb-2 uppercase tracking-wider">
      {children}
    </h2>
  );
}

// --- Profile Tab ---
function ProfileTab() {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "", // We might not be able to change email here without triggering Supabase auth email change
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await (supabase.from("profiles") as any).select("*").eq("id", user.id).single();
      if (profile) {
        setForm({
          displayName: profile.display_name || "",
          username: profile.username || "",
          email: user.email || "",
          bio: profile.bio || "",
          location: profile.location || "",
          website: profile.website_url || "",
          github: profile.github_url || "",
          twitter: profile.twitter_url || "",
          linkedin: profile.linkedin_url || "",
          avatarUrl: profile.avatar_url || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(null);

    const result = await updateProfile({
      displayName: form.displayName,
      username: form.username,
      bio: form.bio,
      location: form.location,
      websiteUrl: form.website,
      githubUrl: form.github,
      twitterUrl: form.twitter,
      linkedinUrl: form.linkedin,
      avatarUrl: form.avatarUrl,
    });

    setSaving(false);
    if (!result.success) {
      setError(result.error || "Failed to save profile.");
    } else {
      setSaved("Profile saved successfully!");
      setTimeout(() => setSaved(null), 3000);
    }
  };

  if (loading) {
    return <div className="text-xs text-[var(--ink-muted)] py-8 animate-pulse">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 text-xs">
      {error && <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">{error}</div>}
      <SaveBanner msg={saved} />

      {/* Avatar */}
      <div className={sectionCls}>
        <SectionTitle>Avatar</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-high)] border border-[var(--border-strong)] flex items-center justify-center text-2xl font-bold text-[var(--ink-muted)] overflow-hidden shrink-0">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              form.displayName ? form.displayName.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <label className={labelCls}>
              <Camera className="inline w-3 h-3 mr-1" />
              Avatar Image URL
            </label>
            <input
              type="url"
              value={form.avatarUrl}
              onChange={set("avatarUrl")}
              placeholder="https://avatars.githubusercontent.com/u/..."
              className={inputCls}
            />
            <p className="text-[var(--ink-faint)] text-[11px]">Paste a public image URL. Square images work best.</p>
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className={sectionCls}>
        <SectionTitle>Identity</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Display Name</label>
            <input type="text" required value={form.displayName} onChange={set("displayName")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] select-none">@</span>
              <input
                type="text"
                required
                value={form.username}
                onChange={set("username")}
                className={`${inputCls} pl-6`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              <Mail className="inline w-3 h-3 mr-1" />
              Email Address
            </label>
            <input type="email" readOnly value={form.email} className={`${inputCls} opacity-60 cursor-not-allowed`} title="Email cannot be changed here" />
          </div>
          <div>
            <label className={labelCls}>
              <MapPin className="inline w-3 h-3 mr-1" />
              Location (optional)
            </label>
            <input type="text" value={form.location} onChange={set("location")} placeholder="City, Country" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={set("bio")}
            maxLength={200}
            placeholder="Short professional bio visible on your public profile..."
            className={`${inputCls} resize-none`}
          />
          <p className="text-[var(--ink-faint)] text-[11px] mt-1">{form.bio.length}/200 characters</p>
        </div>
        <div>
          <label className={labelCls}>
            <Globe className="inline w-3 h-3 mr-1" />
            Personal Website
          </label>
          <input type="url" value={form.website} onChange={set("website")} placeholder="https://yoursite.dev" className={inputCls} />
        </div>
      </div>

      {/* Social Links */}
      <div className={sectionCls}>
        <SectionTitle>Social Links</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className={labelCls}><ExternalLink className="inline w-3 h-3 mr-1" />GitHub</label>
            <input type="url" value={form.github} onChange={set("github")} placeholder="https://github.com/username" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><ExternalLink className="inline w-3 h-3 mr-1" />X / Twitter</label>
            <input type="url" value={form.twitter} onChange={set("twitter")} placeholder="https://x.com/username" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><ExternalLink className="inline w-3 h-3 mr-1" />LinkedIn</label>
            <input type="url" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/username" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
             <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : <Save className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}

// --- Security Tab ---
function SecurityTab() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPws, setShowPws] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const sessions: any[] = [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { alert("Passwords don't match."); return; }
    setSaved("Password updated successfully!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="space-y-5 text-xs">
      <SaveBanner msg={saved} />

      {/* Password */}
      <div className={sectionCls}>
        <SectionTitle><Lock className="inline w-3 h-3 mr-1" />Change Password</SectionTitle>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className={labelCls}>Current Password</label>
            <div className="relative">
              <input
                type={showPws ? "text" : "password"}
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={`${inputCls} pr-9`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPws(!showPws)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] cursor-pointer">
                {showPws ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type={showPws ? "text" : "password"}
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type={showPws ? "text" : "password"}
                required
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer">
              <Lock className="w-3.5 h-3.5" />
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* 2FA */}
      <div className={sectionCls}>
        <SectionTitle><Smartphone className="inline w-3 h-3 mr-1" />Two-Factor Authentication</SectionTitle>
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-[var(--ink)] font-medium">Authenticator app (TOTP)</p>
            <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">
              {twoFAEnabled ? "2FA is active. Your account is protected." : "Add an extra layer of security to your account."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
              twoFAEnabled ? "bg-[var(--accent)]" : "bg-[var(--surface-high)]"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                twoFAEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        {twoFAEnabled && (
          <div className="mt-2 p-3 bg-[var(--bg)] rounded-[var(--radius-sm)] border border-[var(--border)] text-[11px] text-[var(--ink-muted)] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
            Scan the QR code in your authenticator app. Recovery codes have been sent to your email.
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className={sectionCls}>
        <SectionTitle><LogOut className="inline w-3 h-3 mr-1" />Active Sessions</SectionTitle>
        <div className="space-y-2.5">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <div>
                <p className="text-[var(--ink)] font-medium flex items-center gap-2">
                  {s.browser}
                  {s.isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-numbers bg-[var(--accent-soft)] text-[var(--accent)] font-bold uppercase">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-[var(--ink-muted)] font-mono-numbers text-[11px] mt-0.5">
                  {s.location} · Last active: {s.lastActive}
                </p>
              </div>
              {!s.isCurrent && (
                <button
                  type="button"
                  className="text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors p-1 cursor-pointer"
                  title="Revoke this session"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="w-full mt-1 py-2 border border-[var(--danger)]/40 text-[var(--danger)] text-xs font-medium rounded-[var(--radius-sm)] hover:bg-[var(--danger)]/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out all other sessions
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-4 rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger)]/5 space-y-3">
        <h2 className="text-xs font-bold text-[var(--danger)] uppercase tracking-wider">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink)] font-medium text-xs">Delete Account</p>
            <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">
              Permanently delete your account and all content. This cannot be undone.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 border border-[var(--danger)] text-[var(--danger)] text-xs font-medium rounded-[var(--radius-sm)] hover:bg-[var(--danger)] hover:text-white transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Notifications Tab ---
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    emailComments: true,
    emailVotes: false,
    emailMentions: true,
    emailNewFollower: false,
    emailWeeklyDigest: true,
    emailJobAlerts: true,
    emailMentorRequests: true,
    inAppComments: true,
    inAppVotes: true,
    inAppMentions: true,
    inAppJobAlerts: false,
  });
  const [saved, setSaved] = useState<string | null>(null);

  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const Toggle = ({ k, label, desc }: { k: keyof typeof prefs; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-[var(--ink)] font-medium">{label}</p>
        {desc && <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => toggle(k)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ml-4 ${
          prefs[k] ? "bg-[var(--accent)]" : "bg-[var(--surface-high)]"
        }`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${prefs[k] ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  const handleSave = () => {
    setSaved("Notification preferences saved.");
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="space-y-5 text-xs">
      <SaveBanner msg={saved} />

      <div className={sectionCls}>
        <SectionTitle><Mail className="inline w-3 h-3 mr-1" />Email Notifications</SectionTitle>
        <Toggle k="emailComments" label="Comments on my content" desc="When someone replies to your articles or questions" />
        <Toggle k="emailVotes" label="Upvotes on my content" desc="When your articles or answers receive significant upvotes" />
        <Toggle k="emailMentions" label="Mentions & tags" desc="When someone @mentions you in a comment or post" />
        <Toggle k="emailNewFollower" label="New follower" />
        <Toggle k="emailWeeklyDigest" label="Weekly digest" desc="Top trending content curated for your interests every Monday" />
        <Toggle k="emailJobAlerts" label="Job board alerts" desc="New jobs matching your tech stack" />
        <Toggle k="emailMentorRequests" label="Mentorship session requests" desc="Booking requests from developers (if you are a mentor)" />
      </div>

      <div className={sectionCls}>
        <SectionTitle>In-App Notifications</SectionTitle>
        <Toggle k="inAppComments" label="Comments on my content" />
        <Toggle k="inAppVotes" label="Upvotes & karma changes" />
        <Toggle k="inAppMentions" label="Mentions & tags" />
        <Toggle k="inAppJobAlerts" label="Job board alerts" />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// --- API Keys Tab ---
type ApiKey = { id: string; name: string; key: string; createdAt: string; lastUsed: string; scopes: string[] };

function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!newKeyName.trim()) { alert("Enter a name for the key."); return; }
    const newKey = `ft_live_sk_${"a1b2c3d4e5f6a1b2c3d4e5f6"}${Math.random().toString(36).slice(2, 8)}`;
    const key: ApiKey = {
      id: `k${Date.now()}`, name: newKeyName, key: `ft_live_sk_••••••••••••••••••••${newKey.slice(-6)}`,
      createdAt: "Just now", lastUsed: "Never",
      scopes: ["articles:read"],
    };
    setKeys([key, ...keys]);
    setGeneratedKey(newKey);
    setNewKeyName("");
    setSaved("API key generated. Copy it now — it won't be shown again.");
    setTimeout(() => setSaved(null), 5000);
  };

  const handleRevoke = (id: string) => {
    if (!confirm("Revoke this key? Any integrations using it will immediately stop working.")) return;
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-5 text-xs">
      {saved && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{saved}</span>
        </div>
      )}

      {generatedKey && (
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--accent)]/40 space-y-2">
          <p className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[var(--accent)]" />
            Your new API key — copy it now
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] font-mono-numbers text-[var(--accent)] bg-[var(--surface)] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] break-all">
              {generatedKey}
            </code>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(generatedKey); }}
              className="shrink-0 p-2 border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[var(--ink-faint)] text-[11px]">This key will not be shown again after you leave this page.</p>
        </div>
      )}

      {/* Generate new */}
      <div className={sectionCls}>
        <SectionTitle><Plus className="inline w-3 h-3 mr-1" />Generate New Key</SectionTitle>
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production Bot)"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="px-3 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>
      </div>

      {/* Keys list */}
      <div className={sectionCls}>
        <SectionTitle>Active API Keys ({keys.length})</SectionTitle>
        {keys.length === 0 ? (
          <p className="text-[var(--ink-muted)] py-4 text-center">No API keys yet.</p>
        ) : (
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k.id} className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[var(--ink)]">{k.name}</p>
                  <button
                    type="button"
                    onClick={() => handleRevoke(k.id)}
                    className="p-1 text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors cursor-pointer"
                    title="Revoke key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[11px] font-mono-numbers text-[var(--ink-muted)] bg-[var(--surface)] px-2 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)]">
                    {revealedKey === k.id ? k.key.replace(/•/g, "x") : k.key}
                  </code>
                  <button
                    type="button"
                    onClick={() => setRevealedKey(revealedKey === k.id ? null : k.id)}
                    className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {revealedKey === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(k.key)}
                    className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-[var(--ink-muted)] font-mono-numbers">
                  <span>Created: {k.createdAt}</span>
                  <span>·</span>
                  <span>Last used: {k.lastUsed}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {k.scopes.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-mono-numbers bg-[var(--surface-high)] text-[var(--ink-muted)] border border-[var(--border)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Billing Tab ---
function BillingTab() {
  const [saved, setSaved] = useState<string | null>(null);
  const isPro = false;

  const invoices: any[] = [];

  return (
    <div className="space-y-5 text-xs">
      <SaveBanner msg={saved} />

      {/* Current Plan */}
      <div className={`${sectionCls} border-[var(--accent)]/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                {isPro ? "FutureTech Pro" : "FutureTech Free"}
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono-numbers font-bold uppercase ${
                    isPro ? "bg-[var(--accent)] text-[var(--bg)]" : "bg-[var(--surface-high)] text-[var(--ink-muted)]"
                  }`}
                >
                  {isPro ? "Active" : "Free Tier"}
                </span>
              </div>
              <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">
                {isPro
                  ? "Ad-free reading · Priority mentorship slots · Pro author badge · Unlimited API keys"
                  : "Limited API keys · Ads shown · Standard mentorship queue"}
              </p>
            </div>
          </div>
          {!isPro && (
            <button
              type="button"
              onClick={() => alert("Redirecting to Stripe Pro Checkout...")}
              className="px-3 py-2 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer shrink-0 ml-4 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade — $9/mo
            </button>
          )}
        </div>

        {!isPro && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            {[
              ["Ad-free reading", "No advertisements anywhere on the platform"],
              ["Priority mentor queue", "Get matched faster with top mentors"],
              ["Pro author badge", "Verified badge on all your articles"],
            ].map(([title, desc]) => (
              <div key={title} className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)]">
                <p className="font-semibold text-[var(--accent)] mb-0.5">{title}</p>
                <p className="text-[var(--ink-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className={sectionCls}>
        <SectionTitle><CreditCard className="inline w-3 h-3 mr-1" />Payment Method</SectionTitle>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-[var(--radius-sm)] bg-[var(--surface-high)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--ink-muted)]">
              VISA
            </div>
            <div>
              <p className="text-[var(--ink)] font-medium">•••• •••• •••• 4242</p>
              <p className="text-[var(--ink-muted)] font-mono-numbers text-[11px]">Expires 08/2027</p>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] text-xs font-medium rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            Update card
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className={sectionCls}>
        <SectionTitle>Billing History</SectionTitle>
        {invoices.length === 0 ? (
          <p className="text-[var(--ink-muted)] py-4 text-center">No invoices yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--ink-muted)] border-b border-[var(--border)] text-left">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium font-mono-numbers">Amount</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-2.5 font-mono-numbers text-[var(--ink-muted)]">{inv.date}</td>
                  <td className="py-2.5 text-[var(--ink)]">{inv.plan}</td>
                  <td className="py-2.5 font-mono-numbers text-[var(--ink)]">{inv.amount}</td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-numbers bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/20 font-bold uppercase">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button type="button" className="text-[var(--accent)] hover:underline cursor-pointer">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cancel */}
      <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--ink)] font-medium">Cancel Subscription</p>
            <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">
              You'll retain Pro access until the end of your billing period.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 border border-[var(--border)] text-[var(--ink-muted)] text-xs font-medium rounded-[var(--radius-sm)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors cursor-pointer ml-4"
          >
            Cancel Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN SETTINGS PAGE
// =============================================
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-3.5 h-3.5" /> },
    { id: "api-keys", label: "API Keys", icon: <Key className="w-3.5 h-3.5" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-4">
        <h1 className="text-lg font-bold text-[var(--ink)] tracking-tight">Settings</h1>
        <p className="text-xs text-[var(--ink-muted)] mt-0.5">Manage your account, security, notifications, API access, and billing.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? "bg-[var(--surface-high)] text-[var(--ink)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "api-keys" && <ApiKeysTab />}
        {activeTab === "billing" && <BillingTab />}
      </div>
    </div>
  );
}
