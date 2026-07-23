"use client";

import React, { useState } from "react";
import { resolveReport, dismissReport, toggleUserBan } from "@/lib/actions/moderation";
import { Shield, AlertTriangle, Users, BarChart3, CheckCircle2, XCircle, Search, Lock, Unlock } from "lucide-react";

interface ReportItem {
  id: string;
  targetType: "Article" | "Question" | "Comment" | "User";
  targetTitle: string;
  reporterUsername: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

interface UserItem {
  id: string;
  username: string;
  displayName: string;
  role: "user" | "author" | "moderator" | "admin";
  isBanned: boolean;
  reputation: number;
}

const mockReports: ReportItem[] = [
  {
    id: "rep_1",
    targetType: "Comment",
    targetTitle: "Spam link in answer comments",
    reporterUsername: "priya_sharma",
    reason: "Promotional spam link targeting crypto scam",
    status: "pending",
    createdAt: "2 hours ago",
  },
  {
    id: "rep_2",
    targetType: "Question",
    targetTitle: "How to bypass Auth RLS policies?",
    reporterUsername: "daejung",
    reason: "Off-topic harassment / duplicate post",
    status: "pending",
    createdAt: "5 hours ago",
  },
];

const mockUsers: UserItem[] = [
  { id: "usr_1", username: "alex_rivera", displayName: "Alex Rivera", role: "user", isBanned: false, reputation: 140 },
  { id: "usr_2", username: "spam_bot_99", displayName: "Fast Crypto", role: "user", isBanned: true, reputation: -20 },
  { id: "usr_3", username: "priya_sharma", displayName: "Priya Sharma", role: "author", isBanned: false, reputation: 1250 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "users" | "analytics">("reports");
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [userQuery, setUserQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
    setActionMessage("Report marked as resolved.");
    await resolveReport(id);
  };

  const handleDismiss = async (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r)));
    setActionMessage("Report dismissed.");
    await dismissReport(id);
  };

  const handleBanToggle = async (userId: string, currentBanState: boolean) => {
    const newStatus = !currentBanState;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: newStatus } : u)));
    setActionMessage(newStatus ? "User banned successfully." : "User unbanned.");
    await toggleUserBan(userId, newStatus);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Shield className="w-4 h-4" />
            <span>Admin & Moderation Dashboard</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            Platform Management
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Gated security controls for content reports, user bans, and system metrics.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-high)] border border-[var(--border-strong)] text-xs text-[var(--ink)] flex items-center justify-between">
          <span>{actionMessage}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
            activeTab === "reports"
              ? "bg-[var(--surface-high)] text-[var(--ink)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Reports Queue ({reports.filter((r) => r.status === "pending").length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
            activeTab === "users"
              ? "bg-[var(--surface-high)] text-[var(--ink)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>User Moderation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
            activeTab === "analytics"
              ? "bg-[var(--surface-high)] text-[var(--ink)]"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
          <span>Platform Analytics</span>
        </button>
      </div>

      {/* TAB 1: REPORTS QUEUE */}
      {activeTab === "reports" && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--ink-muted)] border border-[var(--border)] rounded-[var(--radius-md)]">
              No reports in queue. Content clean!
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="px-2 py-0.5 rounded bg-[var(--surface-high)] text-[var(--ink-muted)] text-[10px] font-mono-numbers">
                      {rep.targetType}
                    </span>
                    <span className="text-[var(--ink)]">{rep.targetTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono-numbers text-[var(--ink-muted)]">
                    {rep.createdAt}
                  </span>
                </div>

                <p className="text-xs text-[var(--ink-muted)] leading-relaxed bg-[var(--bg)] p-2.5 rounded border border-[var(--border)]">
                  <strong className="text-[var(--ink)]">Reason:</strong> {rep.reason}{" "}
                  <span className="text-[10px] opacity-75">(reported by @{rep.reporterUsername})</span>
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono-numbers text-[var(--ink-muted)] uppercase">
                    Status: <strong className="text-[var(--ink)]">{rep.status}</strong>
                  </span>

                  {rep.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDismiss(rep.id)}
                        className="px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--ink-muted)] text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dismiss</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(rep.id)}
                        className="px-2.5 py-1 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded transition-opacity hover:opacity-90 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: USER MODERATION */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="search"
              placeholder="Search member by username or display name..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-high)] font-bold text-xs flex items-center justify-center font-mono-numbers">
                    {u.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--ink)] flex items-center gap-2">
                      <span>{u.displayName}</span>
                      <span className="text-[10px] text-[var(--ink-muted)] font-mono-numbers">@{u.username}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-numbers bg-[var(--surface-high)] text-[var(--accent)] uppercase font-bold">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono-numbers text-[var(--ink-muted)] mt-0.5">
                      Reputation: {u.reputation} pts
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBanToggle(u.id, u.isBanned)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                    u.isBanned
                      ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50"
                      : "bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/50"
                  }`}
                >
                  {u.isBanned ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unban User</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Ban User</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Total Members</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--ink)] mt-1">1,482</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Published Articles</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--accent)] mt-1">324</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Answered Questions</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--ink)] mt-1">891</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Active Jobs</div>
            <div className="text-xl font-bold font-mono-numbers text-amber-400 mt-1">42</div>
          </div>
        </div>
      )}
    </div>
  );
}
