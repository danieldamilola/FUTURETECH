"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Building2, Plus, ExternalLink } from "lucide-react";

interface JobListing {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Remote";
  salaryRange: string;
  postedAt: string;
  tags: string[];
}

const mockJobs: JobListing[] = [
  {
    id: "1",
    companyName: "Vercel",
    companyLogo: "V",
    title: "Staff Platform Engineer — Edge Infrastructure",
    location: "San Francisco, CA / Remote",
    employmentType: "Remote",
    salaryRange: "$200,000 – $260,000",
    postedAt: "2 days ago",
    tags: ["TypeScript", "Next.js", "Rust", "Edge"],
  },
  {
    id: "2",
    companyName: "Linear",
    companyLogo: "L",
    title: "Fullstack Systems Engineer",
    location: "San Francisco, CA / Remote",
    employmentType: "Full-Time",
    salaryRange: "$160,000 – $204,000",
    postedAt: "3 days ago",
    tags: ["React", "TypeScript", "GraphQL", "Sync Engine"],
  },
  {
    id: "3",
    companyName: "Supabase",
    companyLogo: "S",
    title: "DevOps & PostgreSQL Storage Engineer",
    location: "Singapore / Remote",
    employmentType: "Remote",
    salaryRange: "$140,000 – $180,000",
    postedAt: "5 days ago",
    tags: ["PostgreSQL", "Go", "Docker", "Kubernetes"],
  },
  {
    id: "4",
    companyName: "Anthropic",
    companyLogo: "A",
    title: "Senior AI Infrastructure Engineer",
    location: "San Francisco, CA",
    employmentType: "Full-Time",
    salaryRange: "$220,000 – $310,000",
    postedAt: "1 week ago",
    tags: ["Python", "PyTorch", "CUDA", "LLM"],
  },
];

export default function JobsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredJobs = selectedFilter === "All"
    ? mockJobs
    : mockJobs.filter((job) => job.employmentType === selectedFilter || job.tags.includes(selectedFilter));

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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["All", "Remote", "Full-Time", "TypeScript", "PostgreSQL", "Python"].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] border font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedFilter === filter
                ? "bg-[var(--surface-high)] border-[var(--border-strong)] text-[var(--ink)]"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <article
            key={job.id}
            className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] font-bold text-sm flex items-center justify-center font-mono-numbers shrink-0">
                  {job.companyLogo}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mt-0.5">
                    <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[var(--ink-muted)]" />
                      {job.companyName}
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
                  {job.salaryRange}
                </div>
                <div className="text-[10px] text-[var(--ink-muted)] font-mono-numbers mt-0.5">
                  {job.postedAt}
                </div>
              </div>
            </div>

            {/* Tags & Action */}
            <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-numbers bg-[var(--surface-high)] text-[var(--ink-muted)] border border-[var(--border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href="#"
                className="text-xs font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
