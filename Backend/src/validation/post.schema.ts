import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title can't exceed 100 characters" }),

  content: z.string().min(1, { message: "Content is required" }),

  authorId: z.string().optional(),

  media: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url({ message: "Invalid URL format" }),
      })
    )
    .optional(),

  mentions: z.array(z.string()).optional(),
});

export type PostSchema = z.infer<typeof postSchema>;
