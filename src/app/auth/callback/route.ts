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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/feed`);
    }

    return NextResponse.redirect(
      `${origin}/feed?error=${encodeURIComponent(error.message)}`
    );
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
