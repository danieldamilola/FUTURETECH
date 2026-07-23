import React from "react";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Building2, Plus, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function JobsPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await (supabase.from("jobs") as any)
    .select("id, company_name, company_logo_url, title, location, employment_type, salary_range, apply_url, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Format date helper
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const formatEmploymentType = (type: string) => {
    if (!type) return "";
    return type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Developer Careers</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            Tech Jobs & Opportunities
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Verified roles at engineering-first companies building high-scale infrastructure.
          </p>
        </div>

        <Link
          href="/jobs/new"
          className="px-3 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post a Job</span>
        </Link>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {!jobs || jobs.length === 0 ? (
          <div className="p-10 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-center">
            <Briefcase className="w-8 h-8 text-[var(--ink-muted)] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[var(--ink)] mb-1">
              No Job Listings Yet
            </h3>
            <p className="text-xs text-[var(--ink-muted)]">
              Check back soon for new opportunities, or post a job yourself.
            </p>
          </div>
        ) : (
          jobs.map((job: any) => (
            <article
              key={job.id}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {job.company_logo_url ? (
                    <img 
                      src={job.company_logo_url} 
                      alt={job.company_name}
                      className="w-9 h-9 rounded-[var(--radius-sm)] object-cover shrink-0 bg-[var(--surface-high)]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] font-bold text-sm flex items-center justify-center font-mono-numbers shrink-0">
                      {job.company_name ? job.company_name.slice(0, 1).toUpperCase() : "B"}
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-sm font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mt-0.5">
                      <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[var(--ink-muted)]" />
                        {job.company_name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--ink-muted)]" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono-numbers font-bold text-[var(--accent)] flex items-center gap-1 justify-end">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary_range || "Competitive"}
                  </div>
                  <div className="text-[10px] text-[var(--ink-muted)] font-mono-numbers mt-0.5">
                    {formatTimeAgo(job.created_at)}
                  </div>
                </div>
              </div>

              {/* Tags & Action */}
              <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {job.employment_type && (
                    <span
                      className="px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium"
                      style={{ background: "rgba(156,149,135,0.15)", color: "var(--classifier-job)" }}
                    >
                      {formatEmploymentType(job.employment_type)}
                    </span>
                  )}
                </div>

                {job.apply_url && (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
