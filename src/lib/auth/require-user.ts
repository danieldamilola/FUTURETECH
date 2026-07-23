import { createClient } from "@/lib/supabase/client";

export async function requireUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Please sign in to perform this action.");
  }

  return user;
}
