"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resolveReport(reportId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify moderator or admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { success: false, error: "Access denied. Admin or Moderator role required." };
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved", updated_at: new Date().toISOString() })
    .eq("id", reportId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function dismissReport(reportId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { success: false, error: "Access denied. Admin or Moderator role required." };
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: "dismissed", updated_at: new Date().toISOString() })
    .eq("id", reportId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function toggleUserBan(targetUserId: string, banStatus: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Access denied. Admin role required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: banStatus, updated_at: new Date().toISOString() })
    .eq("id", targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
