"use client";

import React, { useState } from "react";
import { Hash, X, Plus } from "lucide-react";

interface HashtagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const defaultSuggestedTags = [
  "TypeScript",
  "React",
  "Rust",
  "AI/ML",
  "PostgreSQL",
  "Next.js",
  "Edge Computing",
  "WebAssembly",
  "System Architecture",
  "DevOps",
];

export function HashtagInput({
  tags,
  onChange,
  maxTags = 5,
}: HashtagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const addTag = (tagToAdd: string) => {
    const formatted = tagToAdd.trim().replace(/^#/, "");
    if (!formatted) return;

    if (tags.length >= maxTags) return;
    if (tags.some((t) => t.toLowerCase() === formatted.toLowerCase())) return;

    onChange([...tags, formatted]);
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const filteredSuggestions = defaultSuggestedTags.filter(
    (st) =>
      st.toLowerCase().includes(inputValue.toLowerCase().replace(/^#/, "")) &&
      !tags.some((t) => t.toLowerCase() === st.toLowerCase())
  );

  return (
    <div className="space-y-2 select-none">
      <label className="block text-xs font-semibold text-[var(--ink)]">
        Hashtags / Topic Tags ({tags.length}/{maxTags})
      </label>

      {/* Selected Tags Pills */}
      <div className="flex items-center gap-1.5 flex-wrap min-h-[34px] p-2 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] focus-within:border-[var(--accent)] transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-numbers bg-[var(--surface-high)] text-[var(--accent)] font-semibold border border-[var(--border-strong)]"
          >
            <Hash className="w-3 h-3 text-[var(--accent)] opacity-80" />
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <div className="relative flex-1 min-w-[140px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? "Type #hashtag and press Enter..." : "Add another tag..."}
              className="w-full text-xs bg-transparent text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none"
            />

            {/* Dropdown Tag Suggestions */}
            {isDropdownOpen && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#1A1F25] border border-[var(--border-strong)] rounded-[var(--radius-md)] p-1.5 shadow-xl text-xs z-50 max-h-48 overflow-y-auto space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-semibold text-[var(--ink-muted)] uppercase">
                  Suggested Tags
                </div>
                {filteredSuggestions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => addTag(st)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-high)] text-[var(--ink)] text-left cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1 text-[var(--accent)] font-medium font-mono-numbers">
                      <Hash className="w-3 h-3" />
                      {st}
                    </span>
                    <Plus className="w-3 h-3 text-[var(--ink-muted)]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
