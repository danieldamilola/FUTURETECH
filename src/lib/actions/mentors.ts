"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { applyMentorSchema, bookSessionSchema } from "@/lib/validation/mentorship";
import { z } from "zod";

const mentorModeSchema = z.object({
  is_mentor: z.boolean(),
  headline: z.string().min(2).max(100).optional(),
  hourly_rate_cents: z.number().min(0).optional(),
  bio: z.string().min(10).optional(),
  is_accepting_sessions: z.boolean().optional(),
  expertise_tags: z.array(z.string()).optional(),
});

export async function updateMentorMode(input: z.infer<typeof mentorModeSchema>): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const validation = mentorModeSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();

    // Update profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase.from("profiles") as any)
      .update({ is_mentor: input.is_mentor })
      .eq("id", user.id);

    if (profileError) return errorResult(profileError.message);

    if (input.is_mentor) {
      // Parse expertise tags (filter empties)
      const tags = (input.expertise_tags || []).map((t) => t.trim()).filter(Boolean);

      // Upsert mentor_profiles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: mentorError } = await (supabase.from("mentor_profiles") as any)
        .upsert({
          user_id: user.id,
          headline: input.headline || "Mentor",
          hourly_rate_cents: input.hourly_rate_cents || 0,
          bio: input.bio || "Available for mentoring",
          is_accepting_sessions: input.is_accepting_sessions !== undefined ? input.is_accepting_sessions : true,
          expertise_tags: tags,
        }, { onConflict: "user_id" });

      if (mentorError) return errorResult(mentorError.message);
    }

    return successResult(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update mentor mode.";
    return errorResult(message);
  }
}


export async function applyAsMentor(input: {
  headline: string;
  hourlyRateCents: number;
  expertiseTags: string[];
  bio: string;
}): Promise<ActionResult<{ mentorId: string }>> {
  try {
    const user = await requireUser();
    const validation = applyMentorSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("mentor_profiles") as any)
      .upsert({
        user_id: user.id,
        headline: input.headline,
        hourly_rate_cents: input.hourlyRateCents,
        expertise_tags: input.expertiseTags,
        bio: input.bio,
        is_accepting_sessions: true,
      })
      .select("id")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({ is_mentor: true })
      .eq("id", user.id);

    return successResult({ mentorId: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to apply as mentor.";
    return errorResult(message);
  }
}

export async function bookSession(input: {
  mentorId: string;
  scheduledAt: string;
  durationMins: number;
  topic: string;
}): Promise<ActionResult<{ sessionId: string }>> {
  try {
    const user = await requireUser();
    const validation = bookSessionSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("mentorship_sessions") as any)
      .insert({
        mentee_id: user.id,
        mentor_id: input.mentorId,
        scheduled_at: input.scheduledAt,
        duration_mins: input.durationMins,
        topic: input.topic,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    return successResult({ sessionId: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to book session.";
    return errorResult(message);
  }
}
