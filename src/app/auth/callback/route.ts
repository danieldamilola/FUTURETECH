import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorReason = searchParams.get("error_description");

  if (code) {
    const supabase = createClient();
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
    `${origin}/feed?error=${encodeURIComponent("Could not complete GitHub authentication. Please verify GitHub provider is enabled in Supabase.")}`
  );
}
