import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorReason = searchParams.get("error_description");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qvohqvxgpehokddwnquf.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Set cookies inside Route Handler
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if this user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", data.user.id)
        .single();

      let destination = profile?.onboarded === false ? "/onboarding" : "/feed";

      // If user signed up via GitHub, auto-onboard them
      if (
        data.user.app_metadata.provider === "github" &&
        profile?.onboarded === false
      ) {
        const meta = data.user.user_metadata;
        const updates: any = { onboarded: true, updated_at: new Date().toISOString() };
        
        if (meta?.full_name) updates.display_name = meta.full_name;
        if (meta?.user_name) {
          updates.username = meta.user_name;
          updates.github_url = `https://github.com/${meta.user_name}`;
        }
        if (meta?.avatar_url) updates.avatar_url = meta.avatar_url;

        await supabase.from("profiles").update(updates).eq("id", data.user.id);
        destination = "/feed"; // Skip onboarding page
      }

      return NextResponse.redirect(`${origin}${destination}`);
    }

    if (error) {
      return NextResponse.redirect(
        `${origin}/feed?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  if (errorReason) {
    return NextResponse.redirect(
      `${origin}/feed?error=${encodeURIComponent(errorReason)}`
    );
  }

  return NextResponse.redirect(
    `${origin}/feed?error=${encodeURIComponent("Could not complete authentication.")}`
  );
}
