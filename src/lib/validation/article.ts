import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title cannot exceed 120 characters."),
  excerpt: z.string().max(280, "Excerpt cannot exceed 280 characters.").optional(),
  contentHtml: z.string().min(10, "Article content cannot be empty."),
  contentJson: z.object({}).passthrough().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  metaDescription: z.string().max(160).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
