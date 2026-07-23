"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/client";
import { ActionResult, successResult, errorResult } from "./result";
import { createArticleSchema } from "@/lib/validation/article";

export async function createArticle(input: {
  title: string;
  excerpt?: string;
  contentHtml: string;
  contentJson?: object;
  status?: "draft" | "published";
}): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const user = await requireUser();
    const validation = createArticleSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    // Generate unique slug
    const baseSlug = input.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // Calculate word count & read time
    const wordCount = input.contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("articles") as any)
      .insert({
        author_id: user.id,
        title: input.title,
        slug,
        excerpt: input.excerpt || null,
        content_json: input.contentJson || {},
        content_html: input.contentHtml,
        status: input.status || "draft",
        read_time_mins: readTimeMins,
        published_at: input.status === "published" ? new Date().toISOString() : null,
      })
      .select("id, slug")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    return successResult({ id: data.id, slug: data.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create article.";
    return errorResult(message);
  }
}

export async function deleteArticle(articleId: string): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("articles") as any)
      .delete()
      .eq("id", articleId)
      .eq("author_id", user.id);

    if (error) {
      return errorResult(error.message);
    }

    return successResult(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete article.";
    return errorResult(message);
  }
}
