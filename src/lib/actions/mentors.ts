"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/client";
import { ActionResult, successResult, errorResult } from "./result";
import { applyMentorSchema, bookSessionSchema } from "@/lib/validation/mentorship";

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

    const supabase = createClient();
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

    const supabase = createClient();
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
