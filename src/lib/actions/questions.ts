"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { createQuestionSchema } from "@/lib/validation/question";

export async function createQuestion(input: {
  title: string;
  bodyHtml: string;
  bodyJson?: object;
  tags?: string[];
}): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const validation = createQuestionSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("questions") as any)
      .insert({
        author_id: user.id,
        title: input.title,
        body_json: input.bodyJson || {},
        body_html: input.bodyHtml,
        is_resolved: false,
      })
      .select("id")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    return successResult({ id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create question.";
    return errorResult(message);
  }
}

export async function deleteQuestion(questionId: string): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("questions") as any)
      .delete()
      .eq("id", questionId)
      .eq("author_id", user.id);

    if (error) {
      return errorResult(error.message);
    }

    return successResult(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete question.";
    return errorResult(message);
  }
}
