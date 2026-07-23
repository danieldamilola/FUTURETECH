"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username cannot exceed 24 characters.")
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores."),
  displayName: z.string().min(2, "Display name must be at least 2 characters."),
});

export async function signInWithEmail(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
    });
    return errorResult("Invalid form input.", fieldErrors);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return errorResult(error.message);
  }

  return successResult({ userId: data.user.id });
}

export async function signUpWithEmail(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const displayName = formData.get("displayName") as string;

  const validation = signupSchema.safeParse({ email, password, username, displayName });
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
    });
    return errorResult("Validation failed.", fieldErrors);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
      },
    },
  });

  if (error) {
    return errorResult(error.message);
  }

  if (!data.user) {
    return errorResult("Failed to create user account.");
  }

  return successResult({ userId: data.user.id });
}

export async function signOut(): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return errorResult(error.message);
  return successResult(undefined);
}
