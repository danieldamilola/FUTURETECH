"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/client";
import { ActionResult, successResult, errorResult } from "./result";
import { z } from "zod";

const onboardingSchema = z.object({
  bio: z.string().max(280, "Bio cannot exceed 280 characters.").optional(),
  websiteUrl: z.string().url("Please enter a valid URL.").or(z.literal("")).optional(),
  githubUrl: z.string().url("Please enter a valid GitHub URL.").or(z.literal("")).optional(),
  twitterUrl: z.string().url("Please enter a valid Twitter/X URL.").or(z.literal("")).optional(),
  techStack: z.array(z.string().max(24)).max(10, "Maximum 10 tech stack tags allowed.").optional(),
});

export async function completeOnboarding(input: {
  bio?: string;
  websiteUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  techStack?: string[];
}): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const validation = onboardingSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({
        bio: input.bio || null,
        website_url: input.websiteUrl || null,
        github_url: input.githubUrl || null,
        twitter_url: input.twitterUrl || null,
        tech_stack: input.techStack || [],
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return errorResult(error.message);
    }

    return successResult(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to complete onboarding.";
    return errorResult(message);
  }
}
