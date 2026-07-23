import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/database";

export async function requireRole(allowedRoles: UserRole[]) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = await (supabase.from("profiles") as any)
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = (profile as { role?: UserRole } | null)?.role;

  if (profileError || !userRole || !allowedRoles.includes(userRole)) {
    throw new Error("Forbidden: You do not have permission to access this resource.");
  }

  return { user, role: userRole };
}
