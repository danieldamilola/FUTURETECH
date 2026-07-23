"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  FileText,
  HelpCircle,
  Headphones,
  Users,
  Briefcase,
  Command,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Pages" | "Tags" | "Actions";
  href: string;
  icon: React.ElementType;
}

const commands: CommandItem[] = [
  { id: "feed", title: "Feed — Popular & Trending", category: "Pages", href: "/feed", icon: FileText },
  { id: "explore", title: "Explore — Tags & Authors", category: "Pages", href: "/explore", icon: Search },
  { id: "articles", title: "Articles — Technical Long-form", category: "Pages", href: "/articles", icon: FileText },
  { id: "questions", title: "Questions — Q&A Community", category: "Pages", href: "/questions", icon: HelpCircle },
  { id: "podcasts", title: "Podcasts — Audio Interviews", category: "Pages", href: "/podcasts", icon: Headphones },
  { id: "mentors", title: "Mentors — 1-on-1 Sessions", category: "Pages", href: "/mentors", icon: Users },
  { id: "jobs", title: "Jobs Board — Developer Roles", category: "Pages", href: "/jobs", icon: Briefcase },
  { id: "tag-ts", title: "#TypeScript", category: "Tags", href: "/explore?tag=TypeScript", icon: Search },
  { id: "tag-react", title: "#React", category: "Tags", href: "/explore?tag=React", icon: Search },
  { id: "tag-rust", title: "#Rust", category: "Tags", href: "/explore?tag=Rust", icon: Search },
];

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCommands = query.trim() === ""
    ? commands
    : commands.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#12151A] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-0 z-50 shadow-2xl overflow-hidden text-[var(--ink)] focus:outline-none">
          <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
          <div className="flex items-center px-4 py-3 border-b border-[var(--border)] gap-3 bg-[var(--surface)]">
            <Search className="w-4 h-4 text-[var(--ink-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search or jump to page... (Press Esc to exit)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-xs bg-transparent text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none"
              autoFocus
            />
            <div className="flex items-center gap-1 text-[10px] font-mono-numbers text-[var(--ink-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-high)]">
              <Command className="w-3 h-3" /> K
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--ink-muted)]">
                No matching results found for &quot;{query}&quot;
              </div>
            ) : (
              filteredCommands.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] text-[var(--ink)] transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 opacity-80" />
                      <span>{item.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
