"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toggleUserBan } from "@/lib/actions/moderation";
import { Shield, AlertTriangle, Users, BarChart3, Search, Lock, Unlock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserItem {
  id: string;
  username: string;
  display_name: string;
  role: "user" | "author" | "moderator" | "admin";
  is_banned: boolean;
  reputation: number;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reports" | "users" | "analytics">("reports");
  
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState({ members: 0, articles: 0, questions: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  const [userQuery, setUserQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const initAdmin = async () => {
      const supabase = createClient();
      
      // Auth Check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/feed?authRequired=1');
        return;
      }
      
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (!profile || !['admin', 'moderator'].includes(profile.role)) {
        router.push('/feed');
        return;
      }

      // Fetch Stats
      const [membersRes, articlesRes, questionsRes, jobsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('questions').select('*', { count: 'exact', head: true }),
        (supabase.from('jobs') as any).select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      setStats({
        members: membersRes.count || 0,
        articles: articlesRes.count || 0,
        questions: questionsRes.count || 0,
        jobs: jobsRes.count || 0,
      });

      // Fetch Users
      const { data: usersData } = await (supabase.from('profiles') as any)
        .select('id, username, display_name, role, is_banned, reputation, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (usersData) {
        setUsers(usersData);
      }
      
      setLoading(false);
    };

    initAdmin();
  }, [router]);

  const handleBanToggle = async (userId: string, currentBanState: boolean) => {
    const newStatus = !currentBanState;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_banned: newStatus } : u)));
    setActionMessage(newStatus ? "User banned successfully." : "User unbanned.");
    await toggleUserBan(userId, newStatus);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(userQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--ink-muted)] text-sm">
        Loading Admin Dashboard...
      </div>
    );
  }

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
          <span>Reports Queue</span>
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
          <div className="p-12 text-center border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)]">
            <AlertTriangle className="w-8 h-8 text-[var(--ink-muted)] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[var(--ink)] mb-1">
              Reports Feature Coming Soon
            </h3>
            <p className="text-xs text-[var(--ink-muted)]">
              The content reporting system is currently being upgraded.
            </p>
          </div>
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
                    {u.display_name ? u.display_name.slice(0, 2).toUpperCase() : "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--ink)] flex items-center gap-2">
                      <span>{u.display_name}</span>
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
                  onClick={() => handleBanToggle(u.id, u.is_banned)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    u.is_banned
                      ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)] hover:bg-[var(--success)]/20"
                      : "bg-[var(--danger)]/10 border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/20"
                  }`}
                >
                  {u.is_banned ? (
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
            
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--ink-muted)] border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)]">
                No users found matching "{userQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Total Members</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--ink)] mt-1">{stats.members.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Published Articles</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--accent)] mt-1">{stats.articles.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Questions</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--ink)] mt-1">{stats.questions.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Active Jobs</div>
            <div className="text-xl font-bold font-mono-numbers text-[var(--accent)] mt-1">{stats.jobs.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
