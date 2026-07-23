"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/lib/actions/jobs";
import { Briefcase, Building, MapPin, DollarSign, Link as LinkIcon, FileText } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: "",
    title: "",
    location: "",
    employment_type: "full_time" as "full_time" | "part_time" | "contract" | "internship",
    salary_range: "",
    apply_url: "",
    description_html: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createJob(form);

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Failed to post job.");
    } else {
      router.push("/jobs");
    }
  };

  const inputCls = "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-faint)]";
  const labelCls = "block text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1.5 flex items-center gap-1.5";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-[var(--accent)]" />
          Post a Job
        </h1>
        <p className="text-sm text-[var(--ink-muted)] mt-1">Reach thousands of developers and tech professionals.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
        {error && <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}><Building className="w-3.5 h-3.5" /> Company Name</label>
            <input type="text" required value={form.company_name} onChange={set("company_name")} className={inputCls} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelCls}><Briefcase className="w-3.5 h-3.5" /> Job Title</label>
            <input type="text" required value={form.title} onChange={set("title")} className={inputCls} placeholder="Senior Frontend Engineer" />
          </div>
          <div>
            <label className={labelCls}><MapPin className="w-3.5 h-3.5" /> Location</label>
            <input type="text" required value={form.location} onChange={set("location")} className={inputCls} placeholder="Remote, US" />
          </div>
          <div>
            <label className={labelCls}>Employment Type</label>
            <select required value={form.employment_type} onChange={set("employment_type")} className={inputCls}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className={labelCls}><DollarSign className="w-3.5 h-3.5" /> Salary Range</label>
            <input type="text" value={form.salary_range} onChange={set("salary_range")} className={inputCls} placeholder="$120k - $150k (Optional)" />
          </div>
          <div>
            <label className={labelCls}><LinkIcon className="w-3.5 h-3.5" /> Apply URL</label>
            <input type="url" required value={form.apply_url} onChange={set("apply_url")} className={inputCls} placeholder="https://company.com/careers/apply" />
          </div>
        </div>

        <div>
          <label className={labelCls}><FileText className="w-3.5 h-3.5" /> Job Description (HTML supported)</label>
          <textarea
            required
            rows={6}
            value={form.description_html}
            onChange={set("description_html")}
            placeholder="<p>We are looking for a great engineer...</p>"
            className={`${inputCls} resize-y`}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
