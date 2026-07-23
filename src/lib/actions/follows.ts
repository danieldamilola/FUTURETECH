"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FollowTargetType = "user" | "tag";

export async function toggleUserFollow(
  targetUserId: string
): Promise<{ success: boolean; isFollowing?: boolean; error?: string }> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Sign in to follow creators." };
  if (user.id === targetUserId) return { success: false, error: "You cannot follow yourself." };

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("followed_user_id", targetUserId)
    .maybeSingle();

  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
    revalidatePath(`/profile/${targetUserId}`);
    return { success: true, isFollowing: false };
  } else {
    await supabase.from("follows").insert({
      follower_id: user.id,
      target_type: "user",
      followed_user_id: targetUserId,
    });
    revalidatePath(`/profile/${targetUserId}`);
    return { success: true, isFollowing: true };
  }
}

export async function toggleShowFollow(
  showId: string
): Promise<{ success: boolean; isFollowing?: boolean; error?: string }> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Sign in to follow shows." };

  const { data: existing } = await supabase
    .from("show_follows")
    .select("id")
    .eq("user_id", user.id)
    .eq("show_id", showId)
    .maybeSingle();

  if (existing) {
    await supabase.from("show_follows").delete().eq("id", existing.id);
    return { success: true, isFollowing: false };
  } else {
    await supabase.from("show_follows").insert({
      user_id: user.id,
      show_id: showId,
    });
    return { success: true, isFollowing: true };
  }
}

export async function getFollowCounts(
  userId: string
): Promise<{ followers: number; following: number }> {
  const supabase = (await createClient()) as any;

  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followed_user_id", userId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return { followers: followers ?? 0, following: following ?? 0 };
}

export async function isFollowingUser(
  targetUserId: string
): Promise<boolean> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("followed_user_id", targetUserId)
    .maybeSingle();

  return !!data;
}
