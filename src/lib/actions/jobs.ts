"use server";

import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { ActionResult, successResult, errorResult } from "./result";
import { z } from "zod";

const createJobSchema = z.object({
  company_name: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship"]),
  salary_range: z.string().max(100).optional(),
  apply_url: z.string().url(),
  description_html: z.string().min(10),
});

export async function createJob(input: z.infer<typeof createJobSchema>): Promise<ActionResult<{ id: string }>> {
  try {
    await requireUser();
    const validation = createJobSchema.safeParse(input);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      return errorResult("Validation error.", fieldErrors);
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("jobs") as any)
      .insert({
        company_name: input.company_name,
        title: input.title,
        location: input.location,
        employment_type: input.employment_type,
        salary_range: input.salary_range || null,
        apply_url: input.apply_url,
        description_html: input.description_html,
        status: "active",
      })
      .select("id")
      .single();

    if (error) {
      return errorResult(error.message);
    }

    return successResult({ id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create job.";
    return errorResult(message);
  }
}
