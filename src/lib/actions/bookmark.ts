"use server";

import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export type BookmarkTargetType = "article" | "question" | "podcast";

export async function toggleBookmark(
  targetType: BookmarkTargetType,
  targetId: string
): Promise<{ success: boolean; isBookmarked?: boolean; error?: string }> {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to save bookmarks." };
  }

  const fkColumn = `${targetType}_id`;

  // Check for existing bookmark
  const { data: existingBookmarks } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq(fkColumn, targetId);

  const existingBookmark = existingBookmarks && existingBookmarks.length > 0 ? existingBookmarks[0] : null;

  if (existingBookmark) {
    // Remove bookmark
    await supabase.from("bookmarks").delete().eq("id", existingBookmark.id);
    revalidatePath("/bookmarks");
    revalidatePath("/feed");
    return { success: true, isBookmarked: false };
  } else {
    // Add bookmark
    await supabase.from("bookmarks").insert({
      user_id: user.id,
      [fkColumn]: targetId,
    });
    revalidatePath("/bookmarks");
    revalidatePath("/feed");
    return { success: true, isBookmarked: true };
  }
}
