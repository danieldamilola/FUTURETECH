"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2, Briefcase, MapPin, DollarSign, Link as LinkIcon,
  FileText, ChevronLeft, Globe, Image as ImageIcon, CheckCircle2
} from "lucide-react";
import Link from "next/link";

type EmploymentType = "full_time" | "part_time" | "contract" | "internship";
type WorkplaceType = "on_site" | "hybrid" | "remote";

interface FormState {
  company_name: string;
  company_logo_url: string;
  title: string;
  location: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  salary_range: string;
  description: string;
  apply_url: string;
}

const inputCls =
  "w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-faint)]";
const labelCls =
  "block text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wide mb-1.5";
const sectionCls =
  "p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4";

function SectionHeader({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-[var(--border)]">
      <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--bg)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono-numbers">
        {number}
      </span>
      <div>
        <h2 className="text-xs font-bold text-[var(--ink)]">{title}</h2>
        <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

type WorkplacePillProps = {
  value: WorkplaceType;
  selected: WorkplaceType;
  onChange: (v: WorkplaceType) => void;
  label: string;
};
function WorkplacePill({ value, selected, onChange, label }: WorkplacePillProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] border transition-colors cursor-pointer ${
        selected === value
          ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--bg)]"
          : "bg-[var(--bg)] border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "preview" | "success">("form");
  const [form, setForm] = useState<FormState>({
    company_name: "",
    company_logo_url: "",
    title: "",
    location: "",
    workplace_type: "on_site",
    employment_type: "full_time",
    salary_range: "",
    description: "",
    apply_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to post a job.");
      setLoading(false);
      return;
    }

    const locationFull = form.workplace_type === "remote"
      ? "Remote"
      : form.workplace_type === "hybrid"
      ? `${form.location} (Hybrid)`
      : form.location;

    const descHtml = form.description
      .split("\n\n")
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    const { error: dbError } = await (supabase.from("jobs") as any).insert({
      company_name: form.company_name,
      company_logo_url: form.company_logo_url || null,
      title: form.title,
      location: locationFull,
      employment_type: form.employment_type,
      salary_range: form.salary_range || null,
      apply_url: form.apply_url,
      description_html: descHtml,
      status: "active",
    });

    setLoading(false);
    if (dbError) {
      setError(dbError.message);
    } else {
      setStep("success");
    }
  };

  const employmentLabels: Record<EmploymentType, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
  };

  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-[var(--success)] mx-auto" />
        <h1 className="text-lg font-bold text-[var(--ink)]">Job posted successfully!</h1>
        <p className="text-xs text-[var(--ink-muted)]">
          Your listing for <span className="text-[var(--ink)] font-medium">{form.title}</span> at{" "}
          <span className="text-[var(--ink)] font-medium">{form.company_name}</span> is now live.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/jobs"
            className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            View all jobs
          </Link>
          <button
            type="button"
            onClick={() => { setForm({ company_name: "", company_logo_url: "", title: "", location: "", workplace_type: "on_site", employment_type: "full_time", salary_range: "", description: "", apply_url: "" }); setStep("form"); }}
            className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            Post another job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[#9C9587] font-medium mb-3">
          <Briefcase className="w-3 h-3" />
          Job Listing
        </div>
        <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">Post a Job</h1>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          Reach thousands of developers and tech professionals in the FutureTech community.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-[var(--radius-sm)] bg-[var(--downvote-soft)] border border-[var(--downvote)] text-[var(--downvote)] text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Core Basics */}
        <div className={sectionCls}>
          <SectionHeader
            number={1}
            title="Core Basics"
            desc="Help candidates and the algorithm find the right role."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Job Title *</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={set("title")}
                placeholder="Senior Frontend Engineer"
                className={inputCls}
              />
              <p className="text-[11px] text-[var(--ink-faint)] mt-1">Use a standard, searchable title.</p>
            </div>

            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Company Name *</span>
              </label>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={set("company_name")}
                placeholder="Acme Corp"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Company Logo URL</span>
              </label>
              <input
                type="url"
                value={form.company_logo_url}
                onChange={set("company_logo_url")}
                placeholder="https://acme.com/logo.png (optional)"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Employment Type *</label>
              <select
                required
                value={form.employment_type}
                onChange={set("employment_type")}
                className={inputCls}
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Workplace Type */}
          <div>
            <label className={labelCls}>Workplace Type *</label>
            <div className="flex items-center gap-2 flex-wrap">
              <WorkplacePill value="on_site" selected={form.workplace_type} onChange={(v) => setForm((p) => ({ ...p, workplace_type: v }))} label="On-site" />
              <WorkplacePill value="hybrid" selected={form.workplace_type} onChange={(v) => setForm((p) => ({ ...p, workplace_type: v }))} label="Hybrid" />
              <WorkplacePill value="remote" selected={form.workplace_type} onChange={(v) => setForm((p) => ({ ...p, workplace_type: v }))} label="Remote" />
            </div>
          </div>

          {form.workplace_type !== "remote" && (
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location *</span>
              </label>
              <input
                type="text"
                required={form.workplace_type === "on_site" || form.workplace_type === "hybrid"}
                value={form.location}
                onChange={set("location")}
                placeholder="San Francisco, CA, USA"
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Section 2: Compensation & Details */}
        <div className={sectionCls}>
          <SectionHeader
            number={2}
            title="Compensation & Details"
            desc="Transparency on salary significantly improves application rates."
          />

          <div>
            <label className={labelCls}>
              <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Salary Range</span>
            </label>
            <input
              type="text"
              value={form.salary_range}
              onChange={set("salary_range")}
              placeholder="$120,000 – $160,000/yr (optional but recommended)"
              className={inputCls}
            />
            <p className="text-[11px] text-[var(--ink-faint)] mt-1">
              Listings with salary ranges get significantly more applicants.
            </p>
          </div>

          <div>
            <label className={labelCls}>
              <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Job Description *</span>
            </label>
            <textarea
              required
              rows={10}
              value={form.description}
              onChange={set("description")}
              placeholder={"About the role:\n\nWe're looking for an experienced...\n\nResponsibilities:\n\n- Lead frontend architecture decisions\n- Collaborate with product & design\n\nRequirements:\n\n- 4+ years React experience\n- Strong TypeScript skills\n\nBenefits:\n\n- Competitive salary\n- Remote-friendly culture"}
              className={`${inputCls} resize-y leading-relaxed`}
            />
            <p className="text-[11px] text-[var(--ink-faint)] mt-1">
              Use blank lines to separate sections. Plain text only — no HTML needed.
            </p>
          </div>
        </div>

        {/* Section 3: Application Routing */}
        <div className={sectionCls}>
          <SectionHeader
            number={3}
            title="Application Routing"
            desc="Where should candidates go to apply?"
          />

          <div>
            <label className={labelCls}>
              <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Apply URL *</span>
            </label>
            <input
              type="url"
              required
              value={form.apply_url}
              onChange={set("apply_url")}
              placeholder="https://company.com/careers/apply or mailto:jobs@company.com"
              className={inputCls}
            />
            <p className="text-[11px] text-[var(--ink-faint)] mt-1">
              This is where we'll send applicants. Can be a careers page or direct email link.
            </p>
          </div>
        </div>

        {/* Preview strip */}
        {form.title && form.company_name && (
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-high)] border border-[var(--border)] flex items-center gap-3">
            {form.company_logo_url ? (
              <img src={form.company_logo_url} alt={form.company_name} className="w-10 h-10 rounded-[var(--radius-sm)] object-contain bg-[var(--bg)]" />
            ) : (
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--ink-muted)]">
                {form.company_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--ink)] truncate">{form.title}</p>
              <p className="text-[11px] text-[var(--ink-muted)] font-mono-numbers truncate">
                {form.company_name}
                {form.location ? ` · ${form.workplace_type === "remote" ? "Remote" : form.location}` : form.workplace_type === "remote" ? " · Remote" : ""}
                {form.employment_type ? ` · ${employmentLabels[form.employment_type]}` : ""}
                {form.salary_range ? ` · ${form.salary_range}` : ""}
              </p>
            </div>
            <span className="text-[10px] text-[#9C9587] font-medium uppercase tracking-wide shrink-0">Preview</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-[var(--ink-faint)]">* Required fields</p>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[var(--accent)] text-[var(--bg)] font-semibold text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job →"}
          </button>
        </div>
      </form>
    </div>
  );
}
