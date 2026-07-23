"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { z } from "zod";

const urlOrEmpty = z.string().url().or(z.literal("")).optional();

const profileSchema = z.object({
  displayName: z.string().min(2).max(64),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores."),
  bio: z.string().max(280, "Bio cannot exceed 280 characters.").optional().or(z.literal("")),
  avatarUrl: urlOrEmpty,
  websiteUrl: urlOrEmpty,
  githubUrl: urlOrEmpty,
  twitterUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
  location: z.string().max(100).optional().or(z.literal("")),
});

export async function updateProfile(input: z.infer<typeof profileSchema>): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const validation = profileSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();

    // Check if username is taken
    const { data: existing } = await (supabase.from("profiles") as any)
      .select("id")
      .eq("username", input.username)
      .neq("id", user.id)
      .maybeSingle();

    if (existing) {
      return errorResult("That username is already taken. Please choose another.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({
        display_name: input.displayName,
        username: input.username,
        bio: input.bio || null,
        avatar_url: input.avatarUrl || null,
        website_url: input.websiteUrl || null,
        github_url: input.githubUrl || null,
        twitter_url: input.twitterUrl || null,
        linkedin_url: input.linkedinUrl || null,
        location: input.location || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return errorResult(error.message);
    }

    return successResult(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile.";
    return errorResult(message);
  }
}
