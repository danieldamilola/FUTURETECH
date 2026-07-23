import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileEdit, Trash2 } from "lucide-react";

export default async function DraftsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/feed?authRequired=1");
  }

  const { data: draftsData } = await supabase
    .from("articles")
    .select("id, title, updated_at, created_at")
    .eq("author_id", user.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false }) as any;

  const drafts = draftsData || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h1 className="text-sm font-medium text-[var(--ink)]">Your Drafts</h1>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {drafts.length} saved
        </span>
      </div>

      {drafts.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
          <FileEdit className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--ink-muted)]" />
          <p className="mb-3">No drafts yet.</p>
          <Link
            href="/new/article"
            className="inline-block px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Start writing →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {drafts.map((draft: any) => {
            const editDate = new Date(draft.updated_at || draft.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
            
            return (
              <div key={draft.id} className="py-3 flex items-center justify-between group">
                <div>
                  <h2 className="text-xs font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    <Link href={`/new/article?draft=${draft.id}`}>
                      {draft.title || "Untitled Draft"}
                    </Link>
                  </h2>
                  <div className="text-[11px] text-[var(--ink-muted)] font-mono-numbers mt-1 flex items-center gap-2">
                    <span>Last edited {editDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/new/article?draft=${draft.id}`}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    aria-label="Delete draft"
                    className="text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
