import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(10, "Question title must be at least 10 characters.")
    .max(150, "Question title cannot exceed 150 characters."),
  bodyHtml: z.string().min(20, "Please provide more details in your question body."),
  bodyJson: z.object({}).passthrough().optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed.").optional(),
});

export const createAnswerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID."),
  bodyHtml: z.string().min(10, "Answer cannot be empty."),
  bodyJson: z.object({}).passthrough().optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
