'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

const SignupSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).trim(),
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
})

export type AuthFormState =
  | {
      errors?: {
        displayName?: string[]
        email?: string[]
        password?: string[]
        general?: string[]
      }
      message?: string
    }
  | undefined

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { errors: { general: ['Supabase is not configured. Add your credentials to .env.local'] } }
  }

  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return { errors: { general: [error.message] } }
  }

  revalidatePath('/', 'layout')
  redirect('/feed')
}

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { errors: { general: ['Supabase is not configured. Add your credentials to .env.local'] } }
  }

  const validated = SignupSchema.safeParse({
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  // Generate a unique username from the display name
  const baseUsername = validated.data.displayName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
  const username = `${baseUsername}${Math.floor(Math.random() * 9000) + 1000}`

  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.displayName,
        username,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      return { errors: { email: ['An account with this email already exists.'] } }
    }
    return { errors: { general: [error.message] } }
  }

  revalidatePath('/', 'layout')
  redirect('/feed')
}

export async function signOut() {
  if (!isSupabaseConfigured) { redirect('/login') }
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle(formData?: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGitHub(formData?: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
