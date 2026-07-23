"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/client";
import { ActionResult, successResult, errorResult } from "./result";
import { createAnswerSchema } from "@/lib/validation/question";

export async function createAnswer(input: {
  questionId: string;
  bodyHtml: string;
  bodyJson?: object;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const validation = createAnswerSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("answers") as any)
      .insert({
        question_id: input.questionId,
        author_id: user.id,
        body_json: input.bodyJson || {},
        body_html: input.bodyHtml,
        is_accepted: false,
      })
      .select("id")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    return successResult({ id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to post answer.";
    return errorResult(message);
  }
}

export async function acceptAnswer(
  questionId: string,
  answerId: string
): Promise<ActionResult<{ isResolved: boolean; acceptedAnswerId: string }>> {
  try {
    const user = await requireUser();
    const supabase = createClient();

    // Verify user is the author of the question
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: question } = await (supabase.from("questions") as any)
      .select("author_id, accepted_answer_id")
      .eq("id", questionId)
      .single();

    if (!question || question.author_id !== user.id) {
      return errorResult("Only the author of the question can accept an answer.");
    }

    const isCurrentlyAccepted = question.accepted_answer_id === answerId;
    const newAcceptedId = isCurrentlyAccepted ? null : answerId;
    const isResolved = !isCurrentlyAccepted;

    // Reset previous answers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("answers") as any)
      .update({ is_accepted: false })
      .eq("question_id", questionId);

    if (newAcceptedId) {
      // Mark answer as accepted
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("answers") as any)
        .update({ is_accepted: true })
        .eq("id", answerId);
    }

    // Update question
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("questions") as any)
      .update({
        accepted_answer_id: newAcceptedId,
        is_resolved: isResolved,
      })
      .eq("id", questionId);

    return successResult({
      isResolved,
      acceptedAnswerId: newAcceptedId || "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to accept answer.";
    return errorResult(message);
  }
}
