"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Building } from "lucide-react";

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  postedAgo: string;
}

const mockJobs: JobItem[] = [
  {
    id: "j1",
    title: "Staff Systems Engineer — Distributed KV",
    company: "Vercel",
    location: "Remote (Global)",
    salary: "$200,000 – $260,000",
    type: "Full-Time",
    tags: ["Rust", "Distributed Systems", "WebAssembly"],
    postedAgo: "1d ago",
  },
  {
    id: "j2",
    title: "Senior Fullstack Engineer",
    company: "Linear",
    location: "Remote (US/EU)",
    salary: "$160,000 – $204,000",
    type: "Full-Time",
    tags: ["React", "TypeScript", "GraphQL", "Postgres"],
    postedAgo: "2d ago",
  },
  {
    id: "j3",
    title: "Infrastructure & Platform Engineer",
    company: "Supabase",
    location: "Remote (Global)",
    salary: "$140,000 – $180,000",
    type: "Full-Time",
    tags: ["Go", "Kubernetes", "PostgreSQL"],
    postedAgo: "3d ago",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");

  const filteredJobs = mockJobs.filter((j) =>
    search === ""
      ? true
      : j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[var(--accent)]" />
          <h1 className="text-sm font-medium text-[var(--ink)]">Developer Careers</h1>
        </div>
        <span className="font-mono-numbers text-xs text-[var(--ink-muted)]">
          {mockJobs.length} active positions
        </span>
      </div>

      <div>
        <input
          type="search"
          placeholder="Filter by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {job.title}
                </h2>

                <div className="flex items-center gap-4 mt-1 text-xs text-[var(--ink-muted)] font-mono-numbers flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 opacity-70" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 opacity-70" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--ink)] font-medium">
                    <DollarSign className="w-3 h-3 text-[var(--accent)]" />
                    {job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-high)] text-[var(--ink)] text-[10px] font-mono-numbers"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono-numbers text-[var(--ink-muted)] block mb-3">
                  {job.postedAgo}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-xs font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
