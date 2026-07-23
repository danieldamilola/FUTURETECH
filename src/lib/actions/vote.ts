"use server";

import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export type TargetType = "article" | "question" | "answer" | "comment" | "podcast";

export async function toggleVote(
  targetType: TargetType,
  targetId: string,
  value: 1 | -1
): Promise<{ success: boolean; error?: string; newValue?: number }> {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to vote." };
  }

  const fkColumn = `${targetType}_id`;

  const { data: existingVotes } = await supabase
    .from("votes")
    .select("id, value")
    .eq("user_id", user.id)
    .eq(fkColumn, targetId);

  const existingVote = existingVotes && existingVotes.length > 0 ? existingVotes[0] : null;

  if (existingVote) {
    if (existingVote.value === value) {
      await supabase.from("votes").delete().eq("id", existingVote.id);
    } else {
      await supabase.from("votes").update({ value }).eq("id", existingVote.id);
    }
  } else {
    await supabase.from("votes").insert({
      user_id: user.id,
      [fkColumn]: targetId,
      value,
    });
  }

  revalidatePath("/feed");
  revalidatePath("/articles");
  revalidatePath("/questions");

  return { success: true };
}
