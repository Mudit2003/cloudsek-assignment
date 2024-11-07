import { Comment } from "../models/Comment";
import { IComment } from "../interfaces/IComment";

export const createComment = async (
  postId: string,
  content: string,
  authorId: string
): Promise<IComment> => {
  const comment = new Comment({ postId, content, authorId });
  return await comment.save();
};

export const addReplyToComment = async (
  postId: string,
  commentId: string,
  content: string,
  authorId: string
): Promise<IComment | void | undefined> => {
  const parentComment: IComment | null = await Comment.findById(commentId);

  if (!parentComment) throw new Error("Not a valid comment to reply to");
  if (parentComment.commentId)
    throw new Error("Nested structure not recommended");

  const comment = new Comment({ postId, commentId, content, authorId });
  return await comment.save();
};

export const getCommentsByPostId = async (postId: string) => {
  return await Comment.find({ postId });
};

export const updateComment = async (
  commentId: string,
  data: Partial<IComment>
) => {
  return await Comment.findByIdAndUpdate(commentId, data, { new: true });
};

export const deleteComment = async (commentId: string) => {
  return await Comment.findByIdAndDelete(commentId);
};
