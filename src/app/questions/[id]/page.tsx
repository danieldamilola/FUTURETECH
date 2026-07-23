import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteControl } from "@/components/ui/vote-control";
import { ContentTag } from "@/components/ui/content-tag";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArrowLeft, Share2 } from "lucide-react";
import { AnswerForm } from "./answer-form";
import { AcceptButton } from "./accept-button";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [questionRes, answersRes, authRes] = await Promise.all([
    (supabase.from("questions") as any)
      .select("id, title, body_html, upvotes_count, downvotes_count, answers_count, views, is_resolved, accepted_answer_id, created_at, author_id, author:profiles!author_id(display_name, username, avatar_url)")
      .eq("id", id)
      .maybeSingle(),
    (supabase.from("answers") as any)
      .select("id, body_html, upvotes_count, downvotes_count, is_accepted, created_at, author:profiles!author_id(display_name, username, avatar_url)")
      .eq("question_id", id)
      .order("is_accepted", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const question = questionRes.data;
  if (!question) notFound();

  const answers = answersRes.data || [];
  const user = authRes.data?.user;
  const canAccept = user && user.id === question.author_id;

  return (
    <div className="w-full space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/questions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to questions</span>
        </Link>
      </div>

      {/* Question Header & Body */}
      <div className="flex gap-4 items-start">
        <VoteControl initialUpvotes={question.upvotes_count || 0} initialDownvotes={question.downvotes_count || 0} orientation="vertical" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ContentTag type="question" label="DISCUSSION" />
          </div>

          <h1 className="text-xl font-medium text-[var(--ink)] leading-snug mb-3">
            {question.title}
          </h1>

          <div className="text-xs text-[var(--ink-muted)] font-mono-numbers mb-4 flex items-center gap-2 flex-wrap">
            <span>Asked by {question.author?.display_name || question.author?.username || "Unknown"}</span>
            <span>·</span>
            <span>{new Date(question.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{question.views || 0} views</span>
            <span className="ml-auto flex items-center gap-1.5">
              <BookmarkButton targetType="question" targetId={question.id} />
              <button type="button" aria-label="Share question" className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          <div
            className="text-xs leading-relaxed text-[var(--ink)] space-y-4 prose max-w-none prose-pre:bg-[var(--surface)] prose-pre:text-[var(--ink)] prose-pre:border prose-pre:border-[var(--border)]"
            dangerouslySetInnerHTML={{ __html: question.body_html || "" }}
          />
        </div>
      </div>

      {/* Answers Section */}
      <div className="border-t border-[var(--border)] pt-6 space-y-6">
        <h2 className="text-sm font-medium text-[var(--ink)]">{answers.length} Answers</h2>

        {answers.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)]">
            <p className="text-sm font-semibold text-[var(--ink)]">No answers yet</p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">Be the first to share your knowledge!</p>
          </div>
        ) : (
          answers.map((ans: any) => (
            <div
              key={ans.id}
              className={`flex gap-4 items-start p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border transition-colors ${
                ans.is_accepted
                  ? "border-l-2 border-l-[var(--accent)] border-[var(--border)]"
                  : "border-[var(--border)]"
              }`}
            >
              <VoteControl initialUpvotes={ans.upvotes_count || 0} initialDownvotes={ans.downvotes_count || 0} orientation="vertical" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono-numbers text-[var(--ink-muted)]">
                    <span className="font-semibold text-[var(--ink)]">{ans.author?.display_name || ans.author?.username || "Unknown"}</span>
                    <span>{new Date(ans.created_at).toLocaleDateString()}</span>
                  </div>

                  <AcceptButton
                    questionId={question.id}
                    answerId={ans.id}
                    isAccepted={ans.is_accepted}
                    canAccept={canAccept || false}
                  />
                </div>

                <div
                  className="text-xs leading-relaxed text-[var(--ink)] space-y-3 prose max-w-none prose-pre:bg-[var(--surface-high)] prose-pre:text-[var(--ink)] prose-pre:border prose-pre:border-[var(--border)]"
                  dangerouslySetInnerHTML={{ __html: ans.body_html || "" }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Answer Submission Composer */}
      {user ? (
        <AnswerForm questionId={question.id} />
      ) : (
        <div className="border-t border-[var(--border)] pt-6 text-center">
          <p className="text-xs text-[var(--ink-muted)] mb-3">Please sign in to answer this question.</p>
          <Link href={`/login?redirect=/questions/${question.id}`} className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-medium text-xs rounded-[var(--radius-md)] hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
