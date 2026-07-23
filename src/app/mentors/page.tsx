"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Users, Star, Calendar, Clock, DollarSign, CheckCircle2, X } from "lucide-react";

interface Mentor {
  username: string;
  name: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  sessionsCompleted: number;
  expertise: string[];
  bio: string;
}

const mockMentors: Mentor[] = [
  {
    username: "priya_sharma",
    name: "Priya Sharma",
    headline: "Staff Systems Engineer @ Vercel — Rust & Distributed Storage Specialist",
    hourlyRate: 120,
    rating: 4.9,
    sessionsCompleted: 47,
    expertise: ["Rust", "Distributed Systems", "TypeScript", "System Architecture"],
    bio: "Ex-AWS Sr. Engineer specializing in high-throughput key-value storage, lock-free concurrency, and Next.js compiler optimizations.",
  },
  {
    username: "daejung",
    name: "Dae-Jung Kim",
    headline: "Principal Database Architect @ Supabase — PostgreSQL & Query Optimization",
    hourlyRate: 150,
    rating: 5.0,
    sessionsCompleted: 31,
    expertise: ["PostgreSQL", "Query Planner", "Database Sharding", "Go"],
    bio: "Helping senior developers and tech leads design bulletproof database schemas, partition massive tables, and diagnose lock contention.",
  },
  {
    username: "elena_v",
    name: "Elena Vasquez",
    headline: "Lead Frontend Architect — React 19, Compiler & Performance",
    hourlyRate: 100,
    rating: 4.8,
    sessionsCompleted: 62,
    expertise: ["React 19", "Server Components", "Performance", "Web Vitals"],
    bio: "Guiding developers through complex frontend architecture, React 19 Server Actions, micro-frontend migration, and Web Vitals tuning.",
  },
];

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-[var(--radius-lg)] bg-[#16191E] border border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] mb-1">
            <Users className="w-4 h-4" />
            <span>Developer Mentorship</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink)] tracking-tight">
            1-on-1 Technical Mentorship
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Book private 45-minute code reviews, architecture consultations, and career advice with industry leaders.
          </p>
        </div>
      </div>

      {/* Mentors Directory List */}
      <div className="space-y-4">
        {mockMentors.map((mentor) => (
          <article
            key={mentor.username}
            className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[var(--surface-high)] text-[var(--accent)] font-bold text-sm flex items-center justify-center font-mono-numbers shrink-0">
                  {mentor.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--ink)]">
                    {mentor.name}
                  </h2>
                  <div className="text-xs text-[var(--ink-muted)] mt-0.5 font-medium">
                    {mentor.headline}
                  </div>
                </div>
              </div>

              {/* Rating & Rate Badge */}
              <div className="text-right shrink-0">
                <div className="text-sm font-mono-numbers font-bold text-[var(--ink)] flex items-center gap-1 justify-end">
                  <DollarSign className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{mentor.hourlyRate}</span>
                  <span className="text-xs font-normal text-[var(--ink-muted)]">/45m</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono-numbers text-[var(--ink-muted)] mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-[var(--ink)]">{mentor.rating}</span>
                  <span>({mentor.sessionsCompleted} sessions)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              {mentor.bio}
            </p>

            {/* Expertise Tags & Action */}
            <div className="pt-3 flex items-center justify-between border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {mentor.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-numbers bg-[var(--surface-high)] text-[var(--ink-muted)] border border-[var(--border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMentor(mentor);
                  setBookingSuccess(false);
                  setBookingTopic("");
                }}
                className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Session</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Booking Session Modal */}
      {selectedMentor && (
        <Dialog.Root open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#12151A] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-6 z-50 shadow-2xl text-[var(--ink)] focus:outline-none">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                <Dialog.Title className="text-sm font-bold text-[var(--ink)]">
                  Book Session with {selectedMentor.name}
                </Dialog.Title>
                <Dialog.Close className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer">
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>

              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4 text-xs">
                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[var(--ink)]">45-Minute Mentorship Session</div>
                      <div className="text-[11px] text-[var(--ink-muted)] mt-0.5">Rate: ${selectedMentor.hourlyRate}</div>
                    </div>
                    <Clock className="w-4 h-4 text-[var(--accent)]" />
                  </div>

                  <div>
                    <label className="block text-[var(--ink-muted)] mb-1 font-medium">Session Topic & Goals</label>
                    <textarea
                      required
                      rows={3}
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder="e.g. Code review of my distributed Rust service, architecture advice, or career transition strategy."
                      className="w-full p-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(null)}
                      className="flex-1 py-2 bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] font-medium rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[var(--accent)] mx-auto" />
                  <h3 className="text-sm font-bold text-[var(--ink)]">Session Request Sent!</h3>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    {selectedMentor.name} has received your mentorship request. You will be notified once confirmed.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="w-full py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-sm)] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
