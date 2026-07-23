"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { TargetType } from "@/types/database";

export async function toggleVote(
  targetType: TargetType,
  targetId: string,
  value: 1 | -1
): Promise<ActionResult<{ userVote: number; upvotes: number; downvotes: number }>> {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    // Check existing vote
    const columnKey = `${targetType}_id`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingVote } = await (supabase.from("votes") as any)
      .select("id, value")
      .eq("user_id", user.id)
      .eq(columnKey, targetId)
      .maybeSingle();

    let newUserVote: number = value;

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle off vote
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("votes") as any).delete().eq("id", existingVote.id);
        newUserVote = 0;
      } else {
        // Switch vote value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("votes") as any)
          .update({ value })
          .eq("id", existingVote.id);
      }
    } else {
      // Insert new vote
      const voteInsert: Record<string, unknown> = {
        user_id: user.id,
        value,
      };
      voteInsert[columnKey] = targetId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from("votes") as any).insert(
        voteInsert
      );

      if (insertError) {
        return errorResult(insertError.message);
      }
    }

    return successResult({
      userVote: newUserVote,
      upvotes: 0,
      downvotes: 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register vote.";
    return errorResult(message);
  }
}
