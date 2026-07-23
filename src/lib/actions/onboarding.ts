"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { z } from "zod";

const urlOrEmpty = z.string().url().or(z.literal("")).optional();

const onboardingSchema = z.object({
  displayName: z.string().min(2).max(64).optional(),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores.")
    .optional(),
  bio: z.string().max(280, "Bio cannot exceed 280 characters.").optional(),
  avatarUrl: urlOrEmpty,
  websiteUrl: urlOrEmpty,
  githubUrl: urlOrEmpty,
  twitterUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
  location: z.string().max(100).optional(),
  techStack: z.array(z.string().max(30)).max(15, "Maximum 15 tech stack tags allowed.").optional(),
});

export async function completeOnboarding(input: {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  location?: string;
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

    const supabase = await createClient();

    // If username is being changed, check it's not taken
    if (input.username) {
      const { data: existing } = await (supabase.from("profiles") as any)
        .select("id")
        .eq("username", input.username)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return errorResult("That username is already taken. Please choose another.");
      }
    }

    const updates: Record<string, unknown> = {
      bio: input.bio || null,
      website_url: input.websiteUrl || null,
      github_url: input.githubUrl || null,
      twitter_url: input.twitterUrl || null,
      linkedin_url: input.linkedinUrl || null,
      tech_stack: input.techStack || [],
      onboarded: true,
      updated_at: new Date().toISOString(),
    };

    if (input.displayName) updates.display_name = input.displayName;
    if (input.username) updates.username = input.username;
    if (input.avatarUrl) updates.avatar_url = input.avatarUrl;
    if (input.location) updates.location = input.location;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update(updates)
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
