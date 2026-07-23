"use client";

import React, { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

interface ContentRendererProps {
  html: string;
  className?: string;
}

export function ContentRenderer({ html, className }: ContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  useEffect(() => {
    if (containerRef.current) {
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [cleanHtml]);

  return (
    <div
      ref={containerRef}
      className={cn("prose max-w-none text-[17px] leading-[1.7]", className)}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
