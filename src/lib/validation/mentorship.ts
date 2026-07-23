import { z } from "zod";

export const applyMentorSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters.").max(100),
  hourlyRateCents: z.number().min(0, "Hourly rate cannot be negative."),
  expertiseTags: z.array(z.string()).min(1, "Select at least 1 area of expertise."),
  bio: z.string().min(20, "Please provide a detailed mentor bio."),
});

export const bookSessionSchema = z.object({
  mentorId: z.string().uuid("Invalid mentor ID."),
  scheduledAt: z.string().min(1, "Please select a date and time."),
  durationMins: z.number().min(15).max(120).default(45),
  topic: z.string().min(10, "Please describe the topic for this session."),
});

export type ApplyMentorInput = z.infer<typeof applyMentorSchema>;
export type BookSessionInput = z.infer<typeof bookSessionSchema>;
