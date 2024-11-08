import { z } from "zod";
// we can use a username validation object to find out if it can be a valid username

const commentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1, "Content cannot be empty"), // Ensures content is not empty
  authorId: z.string().min(3, "Author username is too short"), // Validates the username length
  parentCommentId: z.string().uuid().optional(), // Ensures parentCommentId is a valid UUID if provided
  mentions: z.array(z.string()).optional(), // An array of valid strings (usernames or other mentions)
});

export default commentSchema