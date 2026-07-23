"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  content?: string;
  onChange?: (html: string, json: object) => void;
  placeholder?: string;
  className?: string;
}

export function Editor({
  content = "",
  onChange,
  placeholder = "Write your story...",
  className,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[300px] p-4 text-[var(--ink)] text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML(), editor.getJSON());
      }
    },
  });

  if (!editor) return null;

  return (
    <div className={cn("border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)] overflow-hidden", className)}>
      {/* Editor Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)] flex-wrap text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("bold") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("italic") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("heading", { level: 2 }) && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("heading", { level: 3 }) && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("bulletList") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("orderedList") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("codeBlock") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors",
            editor.isActive("blockquote") && "text-[var(--accent)] bg-[var(--surface)]"
          )}
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
