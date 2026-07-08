import React from 'react';

const avatarColors: Record<string, string> = {
  PS: "#111111", LF: "#2d3748", MW: "#4a5568", SA: "#718096", DK: "#000000", AD: "#1a202c", YT: "#2d3748"
};

export function Avatar({ initials, size = 24 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-md flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: avatarColors[initials] || "#111",
        fontFamily: "var(--font-mono)",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: "#fff",
      }}
    >
      {initials}
    </div>
  );
}
