import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/login?error=supabase_not_configured`)
  }

  if (code) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/feed`)
    } else {
      console.error('OAuth Callback Error:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=missing_code`)
}
